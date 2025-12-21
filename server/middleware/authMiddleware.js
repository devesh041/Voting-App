const jwt = require("jsonwebtoken");
const HttpError = require("../models/ErrorModel");


const authMiddleware = async(req, res, next) => {
    try {
        const Authorization = req.headers.Authorization || req.headers.authorization;
        if(Authorization && Authorization.startsWith("Bearer")){
            const token = Authorization.split(" ")[1];
            if(!token){
                return next(new HttpError("Authentication failed! Token missing",401));
            }
            jwt.verify(token,process.env.JWT_SECRET,(err,info)=>{
                if(err){
                    return next(new HttpError("Token is not valid",403));
                }
                req.user = info;
                next();
            })
        }else{
            return next(new HttpError("Authentication failed! No token",403));
        }
    } catch (error) {
        return next(new HttpError("Authentication failed",500));
    }
}

module.exports = authMiddleware;