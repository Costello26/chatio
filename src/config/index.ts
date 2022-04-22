import multer from 'multer';
import path from 'path';

export default {
    port: process.env.PORT || 8080,
    dbUrl: process.env.DATABASE_URL,
    upload: multer({
        storage : multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'static/attachments/');
              },
              filename: function (req, file, cb) {
                cb(null, file.originalname + Date.now() + '.jpg');
              }
        }),
        limits: {
            fileSize: 524288, //5mb,
        },
        fileFilter: function (req, file, callback) {
            const ext = path.extname(file.originalname);
            if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(new Error('Only images are allowed'));
            }
            callback(null, true);
        },
    }),
    attachmentsDirectory: process.env.NODE_ENV == "production" ? 
        `${process.env.domain}/public/attachments/`
        :
        `http://localhost:${process.env.PORT}/public/attachments/` 
};