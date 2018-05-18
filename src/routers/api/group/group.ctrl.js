const Group = require("models/group");
const User = require("models/user");
const { ObjectId } = require("mongoose").Types;

exports.list = async ctx => {
  const { _id, email } = ctx.user;
  const groups = await Group.find({ "owner._id": _id }).exec();

  ctx.body = {
    groups
  };
};

exports.info = async ctx => {
  const { id } = ctx.params;
  const { _id, email } = ctx.user;
  let group = ctx.middle.group;

  ctx.body = {
    group
  };
};

exports.add = async ctx => {
  const { title, private = false } = ctx.request.body;
  try {
    const group = await new Group({
      owner: {
        _id: ctx.user._id,
        name: ctx.user.name,
        nickname: ctx.user.nickname,
        email: ctx.user.email
      },
      title
    }).save();
    console.log(group);

    ctx.body = {
      group
    };
  } catch (e) {
    ctx.throw(e);
  }
};

exports.modify = async ctx => {
  const { _id, name, nickname, email } = ctx.user;
  const { id } = ctx.params;
  const { title, members, private = null } = ctx.request.body;
  const targetGroup = ctx.middle.group;
  console.log(ctx.middle.group);
  let data = {};
  if (name !== targetGroup.owner.name) {
    data.owner.name = name;
  }
  if (nickname !== targetGroup.owner.nickname) {
    data.owner.name = name;
  }
  if (title) data.title = title;
  if (members) data.members = members;
  console.log(private, typeof private);
  if (typeof private === "boolean") data.private = private;
  data.modifyDate = new Date();

  const group = await Group.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  ).exec();

  ctx.body = {
    group
  };
};

exports.del = async ctx => {
  const { _id, email } = ctx.user;
  const { id } = ctx.params;

  await Group.findByIdAndRemove(id).exec();
  ctx.body = {
    message: `삭제 요청이 완료되었습니다.`
  };
};

exports.addMember = async ctx => {
  const { _id, email } = ctx.user;
  const { id } = ctx.params;
  const { member } = ctx.request.body;
  let group = ctx.middle.group;
  const filterMembers = group.members.filter(mem => mem.email === member.email);
  if (filterMembers.length) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `이미 멤버로 존재하는 유저입니다.`
      }
    });
  }

  let targetUser = await User.findOne({ email: member.email }).exec();
  let memberData = {
    _id: targetUser._id,
    name: targetUser.name,
    email: targetUser.email,
    nickname: targetUser.nickname
  };
  group.members.push(memberData);
  try {
    await group.save();
    ctx.body = {
      group
    };
  } catch (e) {
    ctx.throw(e);
  }
};

exports.delMember = async ctx => {
  const { id } = ctx.params;
  const { email } = ctx.request.query;
  let group = ctx.middle.group;

  const filterMembers = group.members.filter((mem, i) => mem.email === email);
  if (!filterMembers.length) {
    ctx.status = 400;
    return (ctx.body = {
      error: {
        message: `멤버로 존재하지 않는 유저입니다.`
      }
    });
  }
  const newMember = group.members.filter((mem, i) => mem.email !== email);
  group.members = newMember;

  try {
    await group.save();
    ctx.body = {
      group
    };
  } catch (e) {
    ctx.throw(e);
  }
};
