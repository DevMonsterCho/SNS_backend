const User = require("models/user");
const { ObjectId } = require("mongoose").Types;
const crypto = require("crypto");

const cryptoPbkdf2Sync = (password, salt = null) => {
  let key = crypto.pbkdf2Sync(
    password,
    salt ? salt : "salt",
    777777,
    64,
    "sha512"
  );
  return key.toString("base64");
};

const createSession = (ctx, data) => {
  let agent = ctx.request.header["user-agent"];
  let language = ctx.request.header["accept-language"];
  let sessData = { ...data, agent, language };
  let sess = cryptoPbkdf2Sync(JSON.stringify(sessData));
  let value = JSON.stringify(sessData);

  ctx.cache.set(sess, value, (err, data) => {
    if (err) {
      console.log(err);
      res.send("error " + err);
      return;
    }
    ctx.cache.expire(sess, 100 * 60);
  });
  return sess;
};

exports.add = async ctx => {
  console.log(`add`);
  const {
    name,
    email,
    password,
    grade,
    nickname,
    message = null
  } = ctx.request.body;

  let passkey = cryptoPbkdf2Sync(password);

  const user = new User({
    name,
    email,
    grade,
    nickname,
    message,
    password: passkey
  });
  try {
    console.log(user);
    await user.save();
    let data = {
      _id: user._id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      message: user.message,
      grade: user.grade,
      friends: user.friends
    };
    let sess = createSession(ctx, data);
    ctx.cookies.set("x-access-session", sess);
    delete data._id;
    return (ctx.body = {
      sess,
      user: data
    });
  } catch (e) {
    ctx.status = 500;
    ctx.body = { error: { message: `계정 생성에 문제가 발생하였습니다.` } };
    ctx.throw(e, 500, "계정 생성에 문제가 발생하였습니다.");
  }
};

exports.login = async ctx => {
  //   ctx.set("Content-Type", "application/json;charset=UTF-8");
  const { email, password } = ctx.request.body;
  if (!email || !password) ctx.status = 400;
  if (!email)
    return (ctx.body = {
      error: { message: `이메일을 입력하지 않으셨습니다.` }
    });
  if (!password)
    return (ctx.body = {
      error: { message: `비밀번호를 입력하지 않으셨습니다.` }
    });
  let passkey = cryptoPbkdf2Sync(password);

  try {
    const user = await User.findOne({ email }).exec();
    if (passkey === user.password) {
      let data = {
        _id: user._id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        message: user.message,
        grade: user.grade,
        friends: user.friends
      };
      let sess = createSession(ctx, data);
      console.log(`sess ::: `, sess);
      ctx.cookies.set("x-access-session", sess);

      delete data._id;
      return (ctx.body = {
        sess,
        user: data
      });
    } else {
      ctx.status = 401;
      return (ctx.body = {
        error: { message: `이메일 또는 비밀번호가 일치하지 않습니다.` }
      });
    }
  } catch (e) {
    ctx.status = 400;
    return (ctx.body = { error: { message: `존재하지 않는 이메일 입니다.` } });
  }
};

exports.modify = async ctx => {
  const {
    name,
    email,
    password,
    newpassword = null,
    grade,
    nickname,
    message = null
  } = ctx.request.body;
  const { id } = ctx.params;
  const loginUser = ctx.user;
  const findUserForId = await User.findById(id).exec();
  if (loginUser.grade !== 999 && loginUser.email !== findUserForId.email) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `해당 아이디로 로그인 후 이용해주세요.`
      }
    });
  }
  if (!findUserForId) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `존재하지 않는 유저입니다.`
      }
    });
  }

  if (findUserForId.email !== email) {
    console.log(findUserForId.email);
    console.log(email);
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `이메일 정보가 일치하지 않습니다.`
      }
    });
  }

  let passkey = cryptoPbkdf2Sync(password);
  console.log(passkey);
  if (findUserForId.password !== passkey) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `비밀번호가 일치하지 않습니다.`
      }
    });
  }

  if (newpassword) passkey = cryptoPbkdf2Sync(newpassword);

  console.log(`wwwwwww`);
  console.log(findUserForId);
  let data = {};
  if (findUserForId.name !== name) data.name = name;
  if (findUserForId.grade !== grade && ctx.user.grade === 999)
    data.grade = grade;
  if (findUserForId.nickname !== nickname) data.nickname = nickname;
  if (findUserForId.message !== message) data.message = message;
  if (newpassword) data.password = passkey;
  console.log(data);

  if (Object.keys(data).length > 0) {
    data.modifyDate = new Date();
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      ).exec();
      console.log(user);

      let result = {
        _id: user._id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        message: user.message,
        grade: user.grade,
        friends: user.friends
      };
      let sess = createSession(ctx, result);
      ctx.cookies.set("x-access-session", sess);

      delete result._id;
      return (ctx.body = {
        sess,
        user: result
      });
    } catch (e) {
      ctx.throw(e, 500);
    }
  } else {
    ctx.status = 200;
    return (ctx.body = {
      message: `변경사항이 없습니다.`
    });
  }
};

exports.logout = async ctx => {
  ctx.session = null;
  let sess = ctx.cookies.get("x-access-session");
  if (sess) {
    console.log(`sess : (before destroy)`, sess);
    ctx.session = null;
    ctx.cookies.set("x-access-session", null);
  }
  ctx.body = {
    message: "logout."
  };
};

exports.check = ctx => {
  console.log(`check`);
  let user = ctx.user;
  console.log(user);
  ctx.body = user;
};

exports.info = async ctx => {
  const { id } = ctx.params;
  const { email } = ctx.user;

  try {
    const user = await User.findById(id).exec();
    let resUserData = {
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      message: user.message,
      friends: user.friends
    };

    if (user.email === email) {
      resUserData.grade = user.grade;
    }
    ctx.body = {
      user: resUserData
    };
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.list = async ctx => {
  try {
    const users = await User.find().exec();
    ctx.body = users;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.remove = async ctx => {
  const { id } = ctx.params;

  try {
    let findUser = await User.findById(id).exec();
    console.log(ctx.user);
    console.log(findUser);
    if (findUser.email === ctx.user.email) {
      await User.findByIdAndRemove(id).exec();
      ctx.body = {
        message: "삭제 처리가 완료 되었습니다."
      };
    } else {
      ctx.status = 401;
      ctx.body = {
        error: { message: "권한이 없습니다." }
      };
    }
  } catch (e) {
    ctx.throw(e, 500);
  }
};
