/**
 * POST 0.0.0.0:8888/eComm/api/v1/auth/categories
 */
category_controller = require("../controllers/category.controller")
auth_mw = require("../middlewares/auth.mw")

module.exports = (app) => {
    app.post("/eComm/api/v1/auth/categories", [auth_mw.verifyToken, auth_mw.isAdmin], category_controller.createNewCategory)
}