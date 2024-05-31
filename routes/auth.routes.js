/**
 * POST localhost:8888/eComm/api/v1/auth/signup
 * 
 * I need to intercept this
 */
const authController = require("../controllers/auth.controller")
const authMW = require("../middlewares/auth.mw")

module.exports = (app) => {
    app.post("/eComm/api/v1/auth/signup", [authMW.verifySignUpBody], authController.signup)

    /**
     * route for
     * POST 0.0.0.0:8888/eComm/api/v1/auth/signin
     */

    app.post("/eComm/api/v1/auth/signin", [authMW.verifySignInBody], authController.signin)
}