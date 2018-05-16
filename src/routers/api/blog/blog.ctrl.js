const Blog = require("models/blog");
const File = require("models/file");
const { ObjectId } = require("mongoose").Types;

exports.write = async ctx => {
  console.log(`######## blog write #######`);
  console.log(ctx.request.body);
  console.log(ctx.user);
  if (!ctx.user.email) {
    ctx.status = 401;
    return (ctx.body = "로그인 후 이용 가능합니다.");
  }
  const { title, text, md, files } = ctx.request.body;
  console.log(JSON.stringify(files, null, 2));
  const blog = new Blog({
    email: ctx.user.email,
    name: ctx.user.name,
    title,
    text,
    md,
    files
  });

  console.log(blog);
  try {
    await blog.save();
    ctx.body = {
      blog: blog
    };
  } catch (e) {
    ctx.throw(e, 500);
  }
  console.log(`write`);
};

exports.read = async ctx => {
  console.log(`######## blog Read #######`);
  const { id } = ctx.params;
  try {
    let blog = await Blog.findOne({ _id: id }).exec();
    if (!blog) return (ctx.status = 400);
    ctx.body = { message: `해당 블로그가 존재하지 않습니다.` };
    ctx.body = blog;
  } catch (e) {
    ctx.throw(e, 500);
  }
  console.log(`write`);
};

exports.delete = async ctx => {
  const { id } = ctx.params;
  const user = ctx.user;
  if (!user.email) {
    ctx.status = 401;
    ctx.body = "로그인 후 이용 가능합니다.";
  }
  try {
    let blog = await Blog.find({ email: user.email })
      .findByIdAndRemove(id)
      .exec();
    ctx.body = "삭제되었습니다.";
  } catch (e) {
    return ctx.throw(e, 500);
  }
};

exports.listAll = async ctx => {
  try {
    const blogs = await Blog.find().exec();
    ctx.body = {
      list: blogs
    };
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.listUser = async ctx => {
  const { email } = ctx.user;
  try {
    const blogs = await Blog.find({ email }).exec();
    ctx.body = blogs;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return null;
  }

  return next();
};
