/**
 * @author Ang Yun Zane (1949955)
 * @author Wong En Ting Kelyn (1935800)
 * Class:DIT/FT/2A/21
 */
// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const verifyToken = require('./middlewares/verifyToken');
const formData =require("./middlewares/formData")
const logger = new (require("./services/loggerService"))("route");
const recaptcha = require("./middlewares/recaptcha");
const {resolve} = require("path")

// Match URL's with controllers
/**
 * @param {import('express').Router} router 
 */
exports.appRoute = router => {
   // router.post('/api/user/process-submission',verifyToken,formData,recaptcha, userController.processDesignSubmission);
    router.use(recaptcha)
    router.post('/api/user/login', authController.processLogin);
    router.post('/api/user/register', authController.processRegister);
    router.patch('/api/user/register/verify', authController.emailVilified);
   router.use(verifyToken)
   router.post('/api/user/process-submission',userController.processDesignSubmission);
    router.put('/api/user/', userController.processUpdateOneUser);
    router.put('/api/user/design/', userController.processUpdateOneDesign);
    router.get('/api/user/process-search-design/:pagenumber/:search?',userController.processGetSubmissionData);
    router.get('/api/user/process-search-user/:pagenumber/:search?',userController.processGetUserData);
    router.get('/api/user/:recordId',userController.processGetOneUserData);
    router.get('/api/user/design/:fileId', userController.processGetOneDesignData);
    router.get('/api/log', function(req,res){
        if (req.token.userRole === 'admin'){
            res.sendFile(resolve(__dirname+"/../logs/app.log"),console.log);
        }else{
            logger.warn("user with id="+req.token.userId+" and IP="+req.connection.remoteAddress+" tried to access forbidden data");
            res.status(403).json({ message: "you are not allow to view the logs" })
        }
    })

};