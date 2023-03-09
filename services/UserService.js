const User = require('../models/User');
const bcrypt = require("bcrypt");

const UserService = {

    async save(doc) {
        try {
            const user = await User.create(doc);
            return user;
        }
        catch (error) {
            throw error;
        }
    }, 

    async get_all() {
        try {
            const users = await User.find().sort({_id:-1}).exec();
            return users;
        }
        catch (error) {
            throw error;
        }
    },

    async get_user_by_uid(_id) {
        try {
            const user = await User.findOne({_id}).exec();
            return user;
        }
        catch (error) {
            throw error;
        }
    },

    async get_user_by_userid(userid) {
        try {
            const user = await User.findOne({userid}).exec();
            return user;
        }
        catch (error) {
            throw error;
        }
        
    },

    async isDuplicate(type, value) {
        try {
            value = escapeRegExp(value);
            if (type === 'phone') {
                const user = await User.findOne({phone:value}).exec();
                if (user) return true;
                return false 
            }
            else if (type === 'nickname') {
                const user = await User.findOne({nickname:value}).exec();
                if (user) return true;
                return false 
            }
            else if (type === 'name') {
                const user = await User.findOne({name:value}).exec();
                if (user) return true;
                return false 
            }
            else if (type === 'userid') {
                const user = await User.findOne({userid:value}).exec();
                if (user) return true;
                return false 
            }
        }
        catch (error) {
            throw error;
        }
    },

    async verifyPassword(user, password) {
        try {
            return user.verifyPassword(password, function(err, isMatch) {
                if (!err && isMatch) return isMatch;
            });
        }
        catch (error) {
            throw error;
        }
    },

    async password_check(_id, password) {
        try {
            const user = await User.findOne({_id}).exec();
            const result = bcrypt.compareSync(password, user.password);
            return result;
        }
        catch (error) {
            throw error;
        }
    },

    async edit_by_doc(_id, doc) {
        try {
            await User.updateOne({_id}, {$set:doc}).exec();
        }
        catch (error) {
            throw error;
        }
    },

}
module.exports = UserService;

function escapeRegExp(str) {
    str = str.replace(/\0/g, '');
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

