const jwt = require("jsonwebtoken");
const { UserModel } = require("../models");
const validateSession = async (req, res, next) => {

    if (req.method == "OPTIONS") {
        next();
    } else if (req.headers.authorization && req.headers.authorization.includes("Bearer")) {
        const { authorization } = req.headers;


        const payload = authorization 
        ? jwt.verify(
            authorization.includes('Bearer') 
            ? authorization.split(' ')[1] 
            : authorization, 
            process.env.JWT_SECRET
            ) 
            : undefined;


        if (payload) {
            const foundUser = await UserModel.findOne({
                where: { id: payload.id }
            });

            if (foundUser) {

                req.user = foundUser;
                next();
            } else {
                res.status(400).json({
                    message: "Not Authorized"
                });
            }
        } else {
            res.status(401).json({
                message: "Invalid Token"
            });
        }
    } else {
        res.status(403).json({
            message: "Forbidden"
        });
    }
};

module.exports = validateSession;