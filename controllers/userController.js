const router = require("express").Router();
const { UserModel } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize");

const { validateSession } = require("../middlewares");

router.get('/', async(req,res) => {
    try {
        const User = await UserModel.findAll() 
        res.status(201).json(User)
    }catch(err){
        console.log(err)
    }
})

router.post("/register", async (req, res) => {
    let { email, password, firstName, lastName, admin } = req.body.user;
    try {
        const User = await UserModel.create({
            email,
            password: bcrypt.hashSync(password, 10),
            firstName,
            lastName,
            admin
        });

        let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        res.status(201).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Incorrect login",
            });
        } else {
            res.status(500).json({
                message: "Failed to regsiter user",
            });
        }
    }
});

router.post("/login", async (req, res) => {
    let { email, password } = req.body.user;

    try {
        let loginUser = await UserModel.findOne({
            where: {
                email: email,
            },
        });

        if (loginUser) {

            let passwordComparison = await bcrypt.compare(password, loginUser.password);

            if (passwordComparison) {

                let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in!",
                    sessionToken: token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect email or password"
                });
            }
        } else {
            res.status(401).json({
                message: "Incorrect email or password"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
});

module.exports = router;