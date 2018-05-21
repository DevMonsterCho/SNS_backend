const User = require("models/user");
const { ObjectId } = require("mongoose").Types;

exports.addFriendForEmail = async ctx => {
  const { email } = ctx.request.body;
  const loginUser = ctx.user;

  if (email === loginUser.email) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `내 아이디는 친구로 추가 할 수 없습니다.`
      }
    });
  }
  const friend = await User.findOne({ email }).exec();
  let user = await User.findOne({ email: loginUser.email }).exec();

  if (!friend || !user) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `존재하지 않는 유저입니다.`
      }
    });
  }

  let filterUser;

  filterUser = user.friends.filter(item => {
    return item.email === email;
  });

  if (filterUser.length) {
    console.log(filterUser);
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `이미 친구 목록에 있는 유저입니다.`
      }
    });
  }

  user.friends.push({
    _id: friend._id,
    name: friend.name,
    email: friend.email,
    nickname: friend.nickname
  });

  try {
    await user.save();
    let data = {
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      message: user.message,
      grade: user.grade,
      friends: user.friends
    };

    return (ctx.body = {
      user: data
    });
  } catch (e) {
    return ctx.throw(e);
  }
};

exports.deleteFriendForEmail = async ctx => {
  console.log(`deleteFriendForEmail`);
  const { email } = ctx.request.query;
  const loginUser = ctx.user;

  const friend = await User.findOne({ email }).exec();
  let user = await User.findOne({ email: loginUser.email }).exec();
  console.log(friend);
  console.log(user);
  if (!friend || !user) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `존재하지 않는 유저입니다.`
      }
    });
  }

  let dropUser = user.friends.filter(item => {
    return item.email === email;
  });
  if (!dropUser.length) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `친구 목록에 없는 유저입니다.`
      }
    });
  }

  let filterUser = user.friends.filter(item => {
    return item.email !== email;
  });
  user.friends = filterUser;

  try {
    await user.save();
    let data = {
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      message: user.message,
      grade: user.grade,
      friends: user.friends
    };

    return (ctx.body = {
      user: data
    });
  } catch (e) {
    return ctx.throw(e);
  }
};

exports.friendsList = async ctx => {
  console.log(`friendsList`);
  const { email } = ctx.user;
  try {
    const user = await User.findOne({ email }).exec();
    console.log(user);

    console.log(`friends`, user.friends);
    return (ctx.body = {
      friends: user.friends
    });
  } catch (e) {}
};
