const Board = require("models/board");
const User = require("models/user");
const { ObjectId } = require("mongoose").Types;

exports.checkBoard = async (ctx, next) => {
  const { id } = ctx.params;
  const board = await Board.findById(id).exec();
  if (!board) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `요청하신 게시글은 존재하지 않습니다.`
      }
    });
  }

  if (board.owner._id != ctx.user._id) {
    ctx.status = 401;
    return (ctx.body = {
      error: {
        message: `요청하신 작업의 권한이 없습니다.`
      }
    });
  }
  ctx.middle.board = board;

  return await next();
};
