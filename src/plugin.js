"use strict";
/**
 *
 * Created by zhangsong on 2018/8/3.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("./options");
const index_1 = require("./hooks/index");
const handleEncryptFields_1 = require("./utils/handleEncryptFields");
function plugin(schema, opt) {
    const options = new options_1.default(opt);
    // 删除无效字段,如果是加密全部,使用 schema 中的字段填充
    options.encryptFields = handleEncryptFields_1.default(schema.obj, options.encryptFields);
    const hooks = index_1.default({
        encrypt: options.encrypt,
        decrypt: options.decrypt,
    });
    // find
    schema.post('find', function (data, next) {
        try {
            const array = data.map((doc) => hooks.find.run(doc, options.encryptFields));
            next();
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    });
    // findOne
    schema.post('findOne', function (data) {
        try {
            return hooks.find.run(data, options.encryptFields);
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    });
    // create
    schema.pre('save', function (next) {
        hooks.save.run(this, options.encryptFields);
        return next();
    });
    // update
    schema.pre('update', function (next) {
        const plainTextValue = this._update.$set;
        hooks.update.run(plainTextValue, options.encryptFields);
        return next();
    });
    // 保存到数据库前加密
    schema.pre('findOneAndUpdate', function (next) {
        const plainTextValue = this._update.$set;
        hooks.update.run(plainTextValue, options.encryptFields);
        return next();
    });
    // 查询出结果后解密
    schema.post('findOneAndUpdate', function (data) {
        try {
            return hooks.find.run(data, options.encryptFields);
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    });
    schema.statics.encryption = options.encrypt;
    schema.statics.decryption = options.decrypt;
}
exports.default = plugin;
//# sourceMappingURL=plugin.js.map