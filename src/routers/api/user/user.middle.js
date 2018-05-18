const User = require("models/user");
const { ObjectId } = require("mongoose").Types;
const crypto = require("crypto");

exports.checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `Obejct_id의 형식이 잘못되었습니다.`
      }
    });
  }

  return next();
};

exports.checkAuth = async (ctx, next) => {
  if (ctx.user.email) {
    return await next();
  }
  ctx.status = 401;
  ctx.body = {
    error: {
      message: "로그인이 필요한 서비스 입니다."
    }
  };
};

exports.checkUserAlreadyExists = async (ctx, next) => {
  const { email, nickname } = ctx.request.body;
  const userForEmail = await User.findOne({ email }).exec();
  const userForNickname = await User.findOne({ nickname }).exec();

  if (userForEmail || userForNickname) {
    ctx.status = 400;
    let type = ``;
    if (userForEmail) {
      if (type) type += `, `;
      type += `email`;
    }
    if (userForNickname) {
      if (type) type += `, `;
      type += `nickname`;
    }
    return (ctx.body = {
      error: {
        message: `입력하신 ${type}은 이미 사용중 입니다.`
      }
    });
  }

  return await next();
};
