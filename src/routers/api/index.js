const Router = require("koa-router");
const user = require("./user");
const { checkAuth } = require("./user/user.middle");
const group = require("./group");
const category = require("./category");
const board = require("./board");

const api = new Router();

api.use("/user", user.routes());
api.use("/group", checkAuth, group.routes());
api.use("/category", category.routes());
api.use("/board", board.routes());

module.exports = api;
