const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")
const auth_cofig = require("../configs/auth.config")
/**
 * Create a mw will if the request body is proper and correct
 */

/**
 * Middle ware helps in giving a gracefull error message to the user
 * Rather then breaking the application there
 */

const verifySignUpBody = async (req, res, next) => {
    try {

        //Check for the name
        if (!req.body.name) {
            return res.status(400).send({
                message: "Failed ! Name was not provided in request body"
            })
        }

        //Check for the email
        if (!req.body.email) {
            return res.status(400).send({
                message: "Failed ! Email was not provided in request body"
            })
        }

        //Check for the userId
        if (!req.body.userId) {
            return res.status(400).send({
                message: "Failed ! UserId was not provided in request body"
            })
        }

        //Check if the user with the same userId is already present
        const user = await user_model.findOne({ userId: req.body.userId })

        if (user) {
            return res.status(400).send({
                message: "Failed ! User with same userId is already created"
            })
        }
    }
    catch (err) {
        console.log("Error while validating the request object", err)
        res.status(500).send({
            message: "Error while validating the request body"
        })
    }
}

const verifySignInBody = async (req, res, next) => {

    if (!req.body.userId) {
        return res.status(400).send({
            message: "UserId is not provided"
        })
    }
    if (!req.body.password) {
        return res.status(400).send({
            message: "Password is not provided"
        })
    }
    next()
}

const verifyToken = (req, res, next) => {
    //Check if the token us present in the header
    const token = req.headers['x-access-token']

    if (!token) {
        return res.status(403).send({
            message: "No token found : Unauthorized"
        })
    }

    //If its the valid token
    jwt.verify(token, auth_cofig.secret, async (err, decoded) => {     //jwt.verify is inbuilt method in jwt to verify
        if (err) {
            return res.status(401).send({
                message: "Unauthorized !"
            })
        }
        const user = await user_model.findOne({ userId: decoded.id })
        if (!user) {
            return res.status(400).send({
                message: "Unathorized, the user for this token doesn't exist"
            })
        }
        //Set the user info in the req body
        req.user = user
        next()//only when we found the user then we should go to next step
    })

    //Then move to the next step
}

//we want only admin shd be able to add category
const isAdmin = (req, res, next) => {
    const user = req.user
    if (user && user.userType == "ADMIN") {
        next()
    } else {
        return res.status(403).send({
            message: "Only ADMIN users are allowed to access"
        })
    }
}

module.exports = {
    verifySignUpBody: verifySignUpBody,
    verifySignInBody: verifySignInBody,
    verifyToken: verifyToken,
    isAdmin: isAdmin
}