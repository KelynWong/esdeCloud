require("dotenv").config()
const aws = require('aws-sdk')
let ec2 =  new aws.EC2({region:"us-east-1"})
ec2.stopInstances({InstanceIds:["i-03c22aa11d8d95fdb"]},console.log);
let rds = new aws.RDS({region:"us-east-1"})
rds.stopDBInstance({
    DBInstanceIdentifier:"esde"
},console.log)  