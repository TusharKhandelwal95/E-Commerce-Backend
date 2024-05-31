/**
 * Need to write a controller / logic to register a user
 */
const bcrypt = require("bcryptjs")
const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")
const secret = require("../configs/auth.config")

exports.signup = async (req, res) => {    //can have any name as signup
    /**
    * Logic to crate the user
    */

    //1. Read the request body
    const request_body = req.body

    //2. Insert the data in the Users collection in mongoDB
    const userObj = {
        name: request_body.name,
        userId: request_body.userId,
        email: request_body.email,
        userType: request_body.userType,
        password: bcrypt.hashSync(request_body.password, 8)
    }

    try {
        const user_created = await user_model.create(userObj)
        /**
         * Return the user
         */
        const res_obj = {
            name: user_created.name,
            userId: user_created.userId,
            email: user_created.email,
            userType: user_created.userType,
            createdAt: user_created.createdAt,
            updatedAt: user_created.updatedAt
        }
        res.status(201).send(res_obj)  //201 indicate successfully done
    } catch (err) {
        console.log("Error while registering the user", err)
        res.status(500).send({
            message: "Some error happened while registering the user"
        })
    }
    //3. Return the response back to the user

}

exports.signin = async (req, res) => {

    //Check if the user id is present in the system
    const user = await user_model.findOne({ userId: req.body.userId })

    if (user == null) {
        return res.status(400).send({
            message: "User id passed is not valid user id"
        })
    }

    //Check if Password is correct
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password)  //comparesync is method provided in bcrypt. it is synchronous so it will wait. If we used "compare" then we have to use async
    if (!isPasswordValid) {
        return res.status(401).send({
            message: "Wrong password passed"
        })
    }

    //using jwt we will create the access token with a given TTL nad return
    const token = jwt.sign({ id: user.userId }, secret.secret, {  //on what data we want token , secretcode
        expiresIn: 120    //how much time we want token for i.e here 120seconds
    })

    res.status(200).send({
        name: user.name,
        userId: user.userId,
        email: user.email,
        userType: user.userType,
        accessToken: token
    })
}