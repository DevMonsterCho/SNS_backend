const Category = require("models/category");
const categoryForm = require("models/category.form");
const Group = require("models/group");
const User = require("models/user");
const { ObjectId } = require("mongoose").Types;

exports.list = async ctx => {
  const { _id, email } = ctx.user;
  const categories = await Category.find({ "owner._id": _id }).exec();

  ctx.body = {
    categories
  };
};

exports.info = async ctx => {
  const { id } = ctx.params;
  const { _id, email } = ctx.user;
  let group = ctx.middle.group;

  ctx.body = {
    group
  };
};

const checkObjectId = id => {
  if (!ObjectId.isValid(id)) {
    return false;
  }
  return true;
};

exports.add = async ctx => {
  console.log(`add category`);
  const {
    key,
    category,
    type,
    read,
    write,
    sequence,
    private = false
  } = ctx.request.body;

  if (!key) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: `key 값이 없습니다.`
      }
    };
  }

  console.log(`categoryForm.type.enum : `, categoryForm.type.enum);
  let filterType = categoryForm.type.enum.filter(form => {
    return form === type;
  });

  console.log(`filterType : `, filterType);
  if (!filterType) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        enum: categoryForm.type.enum,
        message: `type 값을 enum 형식에 맞춰주세요.`
      }
    });
  }

  console.log(`read : `, read);
  if (!checkObjectId(read)) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `잘못된 형식의 read ObjectId 입니다.`
      }
    });
  }

  const findReader = await Group.findById(read).exec();
  if (!findReader) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `입력하신 read 그룹이 존재하지 않습니다.`
      }
    });
  }
  let reader = {
    _id: findReader._id,
    title: findReader.title
  };

  if (!checkObjectId(write)) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `잘못된 형식의 write ObjectId 입니다.`
      }
    });
  }
  const findWriter = await Group.findById(write).exec();
  if (!findWriter) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `입력하신 wite 그룹이 존재하지 않습니다.`
      }
    });
  }
  let writer = {
    _id: findWriter._id,
    title: findWriter.title
  };

  console.log("reader : ", reader);
  console.log("writer : ", writer);

  let baseKey = typeof key === "string" ? key.trim() : key;
  console.log(key, baseKey, baseKey.length);
  if (baseKey.length < 4) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        key: baseKey,
        length: baseKey.length,
        message: `key 값은 최소 4자 입니다.`
      }
    });
  }

  let baseData = {
    owner: {
      _id: ctx.user._id,
      name: ctx.user.name,
      nickname: ctx.user.nickname,
      email: ctx.user.email
    },
    key: baseKey,
    category,
    type,
    read: reader,
    write: writer
  };
  if (sequence) baseData.sequence = sequence;
  if (typeof private === "boolean") baseData.private = private;

  try {
    const category = await new Category(baseData).save();
    console.log(category);

    ctx.body = {
      category
    };
  } catch (e) {
    ctx.throw(e);
  }
};

exports.modify = async ctx => {
  const { _id, name, nickname, email } = ctx.user;
  const { id } = ctx.params;
  const { title, members, private = null } = ctx.request.body;
  const targetGroup = ctx.middle.group;
  console.log(ctx.middle.group);
  let data = {};
  if (name !== targetGroup.owner.name) {
    data.owner.name = name;
  }
  if (nickname !== targetGroup.owner.nickname) {
    data.owner.name = name;
  }
  if (title) data.title = title;
  if (members) data.members = members;
  console.log(private, typeof private);
  if (typeof private === "boolean") data.private = private;
  data.modifyDate = new Date();

  const group = await Group.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  ).exec();

  ctx.body = {
    group
  };
};

exports.del = async ctx => {
  const { _id, email } = ctx.user;
  const { id } = ctx.params;

  await Group.findByIdAndRemove(id).exec();
  ctx.body = {
    message: `삭제 요청이 완료되었습니다.`
  };
};

exports.addMember = async ctx => {
  const { _id, email } = ctx.user;
  const { id } = ctx.params;
  const { member } = ctx.request.body;
  let group = ctx.middle.group;
  const filterMembers = group.members.filter(mem => mem.email === member.email);
  if (filterMembers.length) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `이미 멤버로 존재하는 유저입니다.`
      }
    });
  }

  let targetUser = await User.findOne({ email: member.email }).exec();
  let memberData = {
    _id: targetUser._id,
    name: targetUser.name,
    email: targetUser.email,
    nickname: targetUser.nickname
  };
  group.members.push(memberData);
  try {
    await group.save();
    ctx.body = {
      group
    };
  } catch (e) {
    ctx.throw(e);
  }
};

exports.delMember = async ctx => {
  const { id } = ctx.params;
  const { email } = ctx.request.query;
  let group = ctx.middle.group;

  const filterMembers = group.members.filter((mem, i) => mem.email === email);
  if (!filterMembers.length) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `멤버로 존재하지 않는 유저입니다.`
      }
    });
  }
  const newMember = group.members.filter((mem, i) => mem.email !== email);
  group.members = newMember;

  try {
    await group.save();
    ctx.body = {
      group
    };
  } catch (e) {
    ctx.throw(e);
  }
};
