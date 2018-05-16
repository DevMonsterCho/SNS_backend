const Router = require('koa-router');
const api = require('./api');
const file = require('./file');

const page = new Router();

page.use('/api', api.routes());
page.use('/file', file.routes());

module.exports = page;
