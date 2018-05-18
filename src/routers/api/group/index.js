const Router = require("koa-router");
const {
  list,
  add,
  info,
  addMember,
  modify,
  delMember,
  del
} = require("./group.ctrl");
const { checkGroup } = require("./group.middle");
const { checkObjectId } = require("../user/user.middle");

const group = new Router();

// 그룹 리스트
group.get("/list", list);
group.get("/:id", checkObjectId, checkGroup, info);

// 그룹 추가
group.post("/add", add);
// 그룹 내 멤버 추가
group.post("/member/:id", checkObjectId, checkGroup, addMember);

// 그룹 정보 수정
group.put("/:id", checkObjectId, checkGroup, modify);

// 그룹 내 멤버 제거
group.delete("/member/:id", checkObjectId, checkGroup, delMember);
// 그룹 제거
group.delete("/:id", checkObjectId, checkGroup, del);

module.exports = group;
