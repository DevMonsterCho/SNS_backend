const File = require('models/file');
const { ObjectId } = require('mongoose').Types;
const fs = require('fs');
const path = require('path');

exports.fileUpload = async (ctx) => {
    console.log(`######## file Upload #######`);
    const { user, request } = ctx;
    if(!user.email) return ctx.status = 401; ctx.body = {message: '로그인 후 이용 가능합니다.'}
    const { files } = ctx.request.body.files;
    console.log('ctx.request.body.files :: ', ctx.request.body.files)
    console.log(user)
    files.path = files.path.replace('uploads/upload', 'download');
    const file = new File({
        uploader: user.email,
        size: files.size,
        path: `${files.path}/${files.name}`,
        name: files.name,
        type: files.type,
        lastModifiedDate: files.lastModifiedDate,
    });

    console.log(file);
    try {
        await file.save();
        ctx.body = file;
    } catch(e) {
        ctx.throw(e, 500);
    }
};

exports.list = async (ctx) => {
    console.log(`######## file list #######`);
    const { email } = ctx.user;
    console.log(email);
    if(!email) return ctx.body = {message: `로그인 후 이용가능합니다.`}
    try {
        let files = await File.find({ uploader: email }).exec();
        let newList = [];
        files.forEach((file, i) => {
            let item = file;
            // item.path = item.path.replace('uploads/upload', 'download');
            newList.push(item);
        })
        console.log(files);
        ctx.body = {
            list: newList
        };
    } catch (e) {
        ctx.throw(e, 500);
    }
}

exports.read = async (ctx) => {
    console.log(`######## file Read #######`);
    // const { email } = ctx.user;
    // console.log(email)
    // if(!email) {
    //     ctx.status = 401; 
    //     return ctx.body = {
    //         message: '로그인이 필요한 요청입니다.'
    //     }
    // }
    const { params } = ctx;
    let newPath = params.path;
    console.log(newPath);
    newPath = newPath.replace('download', 'uploads/upload');
    console.log(newPath);
    let joinPath = path.join(ctx.root, newPath);
    console.log(joinPath);
    let read = fs.readFileSync(joinPath);
    console.log(read);

    ctx.body = read
}

exports.remove = async (ctx) => {
    console.log(`######## file Remove #######`);
    const { id } = ctx.params;
    try {
        await File.findByIdAndRemove(id).exec();
        ctx.body = {message: '삭제되었습니다.'};
    } catch (e) {
        ctx.throw(e, 500);
    }
}

exports.checkObjectId = (ctx, next) => {
    const { id } = ctx.params;
    if(!ObjectId.isValid(id)) {
        ctx.status = 400;
        return null;
    }
    return next();
}