const Router = require("koa-router");
const user = require("./user");
const blog = require("./blog");

const api = new Router();

api.use("/user", user.routes());
api.use("/blog", blog.routes());

module.exports = api;
