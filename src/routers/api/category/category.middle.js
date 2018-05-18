const Category = require("models/category");
const User = require("models/user");
const { ObjectId } = require("mongoose").Types;

exports.checkCategory = async (ctx, next) => {
  const { id } = ctx.params;
  const category = await Category.findById(id).exec();
  if (!category) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `요청하신 그룹은 존재하지 않습니다.`
      }
    });
  }

  if (category.owner._id != ctx.user._id) {
    ctx.status = 401;
    return (ctx.body = {
      error: {
        message: `요청하신 작업의 권한이 없습니다.`
      }
    });
  }
  ctx.middle.category = category;

  return await next();
};
