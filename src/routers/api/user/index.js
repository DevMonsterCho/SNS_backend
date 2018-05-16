const Router = require("koa-router");
const userCtrl = require("./user.ctrl");
const userMiddle = require("./user.middle");

const user = new Router();

user.get("/check", userCtrl.check);
user.get("/list", userCtrl.list);
user.get("/:id", userMiddle.checkObjectId, userCtrl.info);

user.post("/login", userCtrl.login);
user.post("/logout", userMiddle.checkAuth, userCtrl.logout);
user.post("/join", userCtrl.join);
user.put("/modify", userMiddle.checkAuth, userCtrl.modify);
user.delete(
  "/:id",
  userMiddle.checkAuth,
  userMiddle.checkObjectId,
  userCtrl.remove
);

module.exports = user;
