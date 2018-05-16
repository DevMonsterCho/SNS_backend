const Router = require('koa-router');
const fileCtrl = require('./file.ctrl');

const file = new Router();

file.get('/list', fileCtrl.list);
file.post('/upload', fileCtrl.fileUpload);
file.get('/:path', fileCtrl.read);
file.get('/:path/:filename', fileCtrl.read);
file.delete('/:id', fileCtrl.remove);

module.exports = file;