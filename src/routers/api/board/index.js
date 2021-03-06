const Router = require("koa-router");
const {
  listNickname,
  listCategory,
  add,
  info,
  modify,
  del
} = require("./board.ctrl");
const { checkBoard } = require("./board.middle");
const { checkCategory } = require("../category/category.middle");
const { checkGroup } = require("../group/group.middle");
const { checkAuth, checkObjectId } = require("../user/user.middle");

const category = new Router();

/**
 * GET *
 */
// 그룹 리스트
category.get("/list/nickname/:nickname", listNickname);
category.get("/list/category/:category", listCategory);
category.get("/:id", checkAuth, checkObjectId, info);

/**
 * POST *
 */
// 그룹 추가
category.post("/add", checkAuth, add);

/**
 * PUT *
 */
// 그룹 정보 수정
category.put("/:id", checkAuth, checkObjectId, checkBoard, modify);

/**
 * DELETE *
 */
// 그룹 제거
category.delete("/:id", checkAuth, checkObjectId, checkBoard, del);

module.exports = category;
