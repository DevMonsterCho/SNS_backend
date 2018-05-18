const Group = require("models/group");
const User = require("models/user");
const { ObjectId } = require("mongoose").Types;

exports.checkGroup = async (ctx, next) => {
  const { id } = ctx.params;
  const group = await Group.findById(id).exec();
  if (!group) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `요청하신 그룹은 존재하지 않습니다.`
      }
    });
  }

  if (group.owner._id != ctx.user._id) {
    ctx.status = 401;
    return (ctx.body = {
      error: {
        message: `요청하신 작업의 권한이 없습니다.`
      }
    });
  }
  ctx.middle.group = group;

  return await next();
};
