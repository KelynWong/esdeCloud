const { parse } = require('aws-multipart-parser');
const { extname } = require("path")
const aws = require("aws-sdk")
const headers = { "Content-Type": "application/json; charset=utf-8" }
const Bucket = "esde3";
const REGEXP_REMOVE_DASH = /-/g
const TableName = "file"
const { v4: uuid } = require('uuid');
const REGEXP_TEXT = /^[\w\s]{1,}$/;
const REGEXP_FILE_NAME = /[\/\\]/
const REGEXP_MINE_TYPE = /^image\//;
const s3 = new aws.S3({ region: "us-east-1" })
const ddb = new aws.DynamoDB({ region: "us-east-1" });
exports.handler = function (event, context) {
    return new Promise((resolve, reject) => {
        const { designTitle, designDescription, file } = parse(event, true);
        if (designTitle == null || designDescription == null || file == null) {
            resolve({
                statusCode: 400,
                body: JSON.stringify({ message: "messing input" }),
                headers
            });
            return;
        }
        if (REGEXP_TEXT.test(designTitle) && REGEXP_TEXT.test(designDescription) && (!REGEXP_FILE_NAME.test(file.filename))) {
            if (REGEXP_MINE_TYPE.test(file.contentType)) {
                let id = uuid().replace(REGEXP_REMOVE_DASH, Math.floor(Math.random() * 16).toString(16));
                let Key = "images/" + id + extname(file.filename);
                s3.upload({
                    Bucket,
                    Key,
                    ContentType: file.contentType,
                    ContentLength: file.content.length,
                    Body: file.content
                }).promise()
                    .then(() => {
                        return ddb.putItem({
                            TableName,
                            Item: {
                                id: { B: Buffer.from(id, "hex") },
                                user_id: { B: Buffer.from(event.requestContext.authorizer.claims.sub.replace(REGEXP_REMOVE_DASH, ""), "hex") },
                                file_url: { S: Key },
                                design_title: { S: designTitle },
                                design_description: { S: designDescription }
                            }
                        }).promise()
                    })
                    .then(data => {
                        resolve({
                            statusCode: 201,
                            body: JSON.stringify({ message: 'File submission completed.', id }),
                            headers
                        });
                    })
                    .catch(reject);

            } else {
                resolve({
                    statusCode: 415,
                    body: JSON.stringify({ message: "Invalid file type" }),
                    headers
                });
            }


        } else {
            resolve({
                statusCode: 400,
                body: JSON.stringify({ message: "invalid import" }),
                headers
            });
        }
    })


}