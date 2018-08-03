"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const mongoose_1 = require("mongoose");
const mongoose_field_encryption_1 = require("mongoose-field-encryption");
const db_js_1 = require("../db.js");
const Post = new mongoose_1.Schema({
    title: String,
    message: String,
    references: {
        author: String,
        date: Date,
    },
});
Post.plugin(mongoose_field_encryption_1.fieldEncryption, { fields: ['message', 'references'], secret: 'some secret key' });
const model = db_js_1.default.model('admin', Post, 'admin');
model.create({
    title: '哦呢啊手机打开拉丝机老地方',
    message: moment().format('YYYY_MM_DD HH:mm:ss:SSS'),
    references: {
        author: 'zhangsan',
        date: new Date(),
    },
})
    .then((result) => {
    console.log(JSON.stringify(result));
})
    .catch((e) => {
    console.error(e);
});
//# sourceMappingURL=mongoose-field-encryption.js.map