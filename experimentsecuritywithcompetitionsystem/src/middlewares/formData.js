const multer = require("multer");
const multerS3 = require("multer-s3")
const { s3 } = require("../services/fileService")
const logger = new (require("../services/loggerService"))("formData")
const REGEXP_MINE_TYPE = /^image\//;
const REGEXP_FILE_NAME=/[\/\\]/
//multer.StorageEngine
/* class Storage {
    _handleFile(req, file, callback) {
        uploadFile(file.stream)
            .then(callback.bind(null,null))
            .catch(callback)
    }
    _removeFile(req, file, cb) {
        delete file.buffer
        cb(null)
    }
} */
const upload= multer({
    storage:multerS3({
        s3,
        bucket:"esde2",
        contentType:multerS3.AUTO_CONTENT_TYPE,
        metadata(req, file, callback) {
            callback(null, {fieldName: file.fieldname});
          },
          key(req, file, callback) {
            callback(null,"images/" +Date.now().toString() + "_"+file.originalname);
        }
    }),
    fileFilter(req, file, callback) {
        if (REGEXP_MINE_TYPE.test(file.mimetype)) {
            if(REGEXP_FILE_NAME.test(file.originalname)){
                    callback(new Error("Invalid file name"));
                    return;
            }
            callback(null, true);
        } else {      
            callback(new Error("Unsupported image format"), false)
        }
    
    }
}).single("file")
/** @type {import("express").RequestHandler} */
module.exports =async function(req,res,next){
    upload(req,res,err=>{
        if (err) {
            switch (err.message) {
                case "File too large":
                    res.status(413).json({message:err.message});
                    break;
                case "Unsupported image format":
                    res.status(415).json({message:err.message});
                    break;
                case "Invalid file name" :
                    res.status(400).json({message:err.message});
                    break
                default:
                    console.log(err)
                    logger.error("Fail to read or upload file due to "+err.message);
                    res.status(500).end();
            }
        } else{
            next()
        }
    })
}