const Router = require("koa-router");
const user = require("./user");
const { checkAuth } = require("./user/user.middle");
const group = require("./group");
const category = require("./category");
const blog = require("./blog");

const api = new Router();

api.use("/user", user.routes());
api.use("/group", checkAuth, group.routes());
api.use("/category", category.routes());
api.use("/blog", blog.routes());

module.exports = api;
