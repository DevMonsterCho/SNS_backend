const User = require("models/user");
const { ObjectId } = require("mongoose").Types;
const crypto = require("crypto");

exports.checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return null;
  }

  return next();
};

exports.checkAuth = async (ctx, next) => {
  if (ctx.user.email) {
    return await next();
  }
  ctx.status = 401;
  ctx.body = {
    message: "로그인이 필요한 서비스 입니다."
  };
};
