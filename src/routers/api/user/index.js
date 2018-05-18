const Router = require("koa-router");
const userCtrl = require("./user.ctrl");
const userFriendCtrl = require("./user.friend.ctrl");
const userMiddle = require("./user.middle");

const user = new Router();

user.get("/check", userCtrl.check);
user.get("/list", userCtrl.list);
user.get("/friends", userMiddle.checkAuth, userFriendCtrl.friendsList);
user.get("/:id", userMiddle.checkObjectId, userCtrl.info);

user.post("/friend", userMiddle.checkAuth, userFriendCtrl.addFriendForEmail);
user.post("/login", userCtrl.login);
user.post("/logout", userMiddle.checkAuth, userCtrl.logout);
user.post("/join", userMiddle.checkUserAlreadyExists, userCtrl.join);
user.put(
  "/:id",
  userMiddle.checkAuth,
  userMiddle.checkObjectId,
  userCtrl.modify
);
user.delete(
  "/:id",
  userMiddle.checkAuth,
  userMiddle.checkObjectId,
  userCtrl.remove
);
user.delete(
  "/friend/:id",
  userMiddle.checkAuth,
  userMiddle.checkObjectId,
  userFriendCtrl.deleteFriendForEmail
);

module.exports = user;
