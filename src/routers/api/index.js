const Router = require("koa-router");
const user = require("./user");
const { checkAuth } = require("./user/user.middle");
const group = require("./group");
const category = require("./category");
const board = require("./board");
const static = require("./static");

const api = new Router();

api.use("/user", user.routes());
api.use("/group", checkAuth, group.routes());
api.use("/category", category.routes());
api.use("/board", board.routes());
api.use("/static", static.routes());

module.exports = api;
