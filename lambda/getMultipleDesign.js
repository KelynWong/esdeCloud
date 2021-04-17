const aws = require("aws-sdk");
const ddb = new aws.DynamoDB({ region: "us-east-1" })
const s3 = new aws.S3({ region: "us-east-1" });
const headers = { "Content-Type": "application/json; charset=utf-8" }
const Bucket = "esde3";
const REGEXP_REMOVE_DASH = /-/g
const TableName = "file"
exports.handler = function (event) {
    return new Promise((resolve, reject) => {
        ddb.scan({
            ExpressionAttributeValues: {
                ":u": {
                    B: Buffer.from(event.requestContext.authorizer.claims.sub.replace(REGEXP_REMOVE_DASH, ""), "hex")
                }
            },
            FilterExpression: "user_id=:u",
            TableName
        }).promise().then(data => {
            data.Items.forEach(item => {
                item.file_url = s3.getSignedUrl('getObject', {
                    Bucket,
                    Key: item.file_url.S,
                    Expires: 60 * 5
                })
                item.id = item.id.B.toString("hex");
                delete item.user_id
            })
            resolve({ statusCode: 200, headers, body: JSON.stringify(data.Items) })

        }).catch(reject)
    })
}