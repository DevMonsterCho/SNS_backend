const Static = require("models/static");
const User = require("models/user");
const { ObjectId } = require("mongoose").Types;

exports.checkStatic = async (ctx, next) => {
  const { id } = ctx.params;
  const static = await Static.findById(id).exec();
  if (!static) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `요청하신 그룹은 존재하지 않습니다.`
      }
    });
  }

  if (static.owner._id != ctx.user._id) {
    ctx.status = 401;
    return (ctx.body = {
      error: {
        message: `요청하신 작업의 권한이 없습니다.`
      }
    });
  }
  ctx.middle.static = static;

  return await next();
};
