const Board = require("models/board");
const Category = require("models/category");
const boardForm = require("format/board.form");
const User = require("models/user");
const { ObjectId } = require("mongoose").Types;

exports.listNickname = async ctx => {
  const { nickname } = ctx.params;
  const user = await User.findOne({ nickname }).exec();
  console.log(user);
  if (!user) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `존재하지 않는 유저입니다.`
      }
    });
  }

  let query = { "owner._id": user._id };
  console.log(user._id);
  console.log(ctx.user._id);
  console.log(user._id != ctx.user._id);
  if (user._id != ctx.user._id) {
    query.private = false;
  }
  let boards = await Board.find(query).exec();
  console.log(boards);

  return (ctx.body = {
    boards: boards
  });
};

exports.listCategory = async ctx => {
  const { category } = ctx.params;
  const findCategory = await Category.findById(category).exec();
  console.log(findCategory);
  let query = { "category._id": findCategory._id };
  console.log(findCategory._id);
  console.log(ctx.user._id);
  console.log(findCategory.owner._id != ctx.user._id);
  if (findCategory.owner._id != ctx.user._id) {
    query.private = false;
  }
  let boards = await Board.find(query).exec();
  console.log(boards);

  return (ctx.body = {
    boards: boards
  });
};

exports.info = async ctx => {
  const { id } = ctx.params;
  const { _id, email } = ctx.user;

  let board = await Board.findById(id).exec();

  ctx.body = {
    board
  };
};

const checkObjectId = id => {
  if (!ObjectId.isValid(id)) {
    return false;
  }
  return true;
};

exports.add = async ctx => {
  console.log(`add board`);
  const {
    category,
    title,
    subTitle,
    type,
    content,
    footer,
    files,
    tags,
    private = false
  } = ctx.request.body;

  if (!category) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: `category 값이 없습니다.`
      }
    };
  }

  if (!title) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: `title 값이 없습니다.`
      }
    };
  }

  if (!type) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: `type 값이 없습니다.`
      }
    };
  }

  console.log(`boardForm.type.enum : `, boardForm.type.enum);
  let filterType = boardForm.type.enum.filter(form => {
    return form === type;
  });
  console.log(`filterType : `, filterType);
  if (!filterType.length) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        enum: categoryForm.type.enum,
        message: `type 값을 enum 형식에 맞춰주세요.`
      }
    });
  }

  if (!content) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: `content 값이 없습니다.`
      }
    };
  }

  let baseData = {
    owner: {
      _id: ctx.user._id,
      name: ctx.user.name,
      email: ctx.user.email
    },
    category: {
      _id: category._id
    },
    title,
    content,
    type
  };

  if (subTitle) baseData.subTitle = subTitle;
  if (footer) baseData.subTitle = footer;
  if (files) baseData.files = files;
  if (tags) {
    console.log(tags);
    let tagsData = [];
    tags.split(",").forEach(tag => {
      let trimTag = tag.trim();
      console.log(trimTag);
      return tagsData.push(trimTag);
    });
    console.log(`tagData : `, tagsData);
    baseData.tags = tagsData;
  }
  if (typeof private === "boolean") baseData.private = private;
  console.log(baseData);

  const board = await new Board(baseData);
  try {
    await board.save();
    return (ctx.body = {
      board
    });
  } catch (e) {
    ctx.throw(e);
  }
};

exports.modify = async ctx => {
  const { _id, name, nickname, email } = ctx.user;
  const { id } = ctx.params;
  const {
    category,
    title,
    subTitle,
    type,
    content,
    footer,
    files,
    tags,
    private = false
  } = ctx.request.body;

  const targetBoard = ctx.middle.board;
  console.log(targetBoard);
  let data = {};
  if (name !== targetBoard.owner.name) {
    data.owner.name = name;
  }
  if (nickname !== targetBoard.owner.nickname) {
    data.owner.name = name;
  }

  let filterType = boardForm.type.enum.filter(form => {
    return form === type;
  });
  if (!filterType.length) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        enum: boardForm.type.enum,
        message: `type 값을 enum 형식에 맞춰주세요.`
      }
    });
  }

  if (category) data.category = category;
  if (title) data.title = title;
  if (subTitle) data.subTitle = subTitle;
  if (type) data.type = type;
  if (content) data.content = content;
  if (footer) data.footer = footer;
  if (files) data.files = files;
  if (tags) {
    console.log(tags);
    let tagsData = [];
    tags.split(",").forEach(tag => {
      let trimTag = tag.trim();
      console.log(trimTag);
      return tagsData.push(trimTag);
    });
    console.log(`tagData : `, tagsData);
    data.tags = tagsData;
  }

  if (typeof private === "boolean") data.private = private;

  data.modifyDate = new Date();

  try {
    const board = await Board.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).exec();

    return (ctx.body = {
      board
    });
  } catch (e) {
    ctx.throw(e);
  }
};

exports.del = async ctx => {
  console.log(`del`);
  const { _id, email } = ctx.user;
  const { id } = ctx.params;

  await Board.findByIdAndRemove(id).exec();
  ctx.body = {
    message: `삭제 요청이 완료되었습니다.`
  };
};
