var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});
const headers ={"Content-Type":"application/json; charset=utf-8",'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods': 'OPTIONS, POST, GET','Access-Control-Max-Age': 2592000}
const REGEXP_REMOVE_DASH = /-/g
exports.handler = (event) => {
    return new Promise((resolve,reject)=>{
        let data = JSON.parse(event.body);
        var params = {
    TableName:"file",
    Key:{
        "id":Buffer.from(event.pathParameters.id, 'hex'),
    },
    UpdateExpression: "set design_title = :design_title, design_descriptiont=:design_description",
     ConditionExpression: 'user_id = :user_id',
    ExpressionAttributeValues:{
        ":design_title":data.designTitle,
        ":design_description":data.designDescription,
        ":user_id": Buffer.from(event.requestContext.authorizer.claims.sub.replace(REGEXP_REMOVE_DASH, ""), "hex")
    }
};
docClient.update(params, function(err, data) {
    if (err) {
        reject(err)
    } else {
        resolve({headers,statusCode:204})
    }
})
    })
};