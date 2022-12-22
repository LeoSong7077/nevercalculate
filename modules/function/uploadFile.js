// ### Middleware ###

const multer  = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        if (request.user && request.user.photo) fs.unlinkSync((request.user.photo).substring(1)); // request.user.photo !== '/public/data/photos/profile.png')
        let path = 'public/data/photos/'
        cb(null, path);
    },
    filename: function (request, file, cb) {
        // console.log(file);
        const dot_index = file.originalname.lastIndexOf('.');
        const realname = file.originalname.substring(0, dot_index);
        const filetype = file.originalname.substring(dot_index + 1);
        cb(null, realname  + '-' + Date.now() + '.' + filetype); 
    }
});
const upload = multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } });

const uploadFile = function (...file_info) {
    return upload.fields(file_info);
}

module.exports = uploadFile;