const Router = require("koa-router");
const { list, add, info, modify, del } = require("./category.ctrl");
const { checkCategory } = require("./category.middle");
const { checkGroup } = require("../group/group.middle");
const { checkAuth, checkObjectId } = require("../user/user.middle");

const category = new Router();

/**
 * GET *
 */
// 그룹 리스트
category.get("/list", checkAuth, list);
category.get("/:id", checkAuth, checkObjectId, checkCategory, info);

/**
 * POST *
 */
// 그룹 추가
category.post("/add", checkAuth, add);

/**
 * PUT *
 */
// 그룹 정보 수정
category.put("/:id", checkAuth, checkObjectId, checkCategory, modify);

/**
 * DELETE *
 */
// 그룹 제거
category.delete("/:id", checkAuth, checkObjectId, checkCategory, del);

module.exports = category;
