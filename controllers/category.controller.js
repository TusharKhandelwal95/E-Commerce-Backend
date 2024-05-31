const category_model = require("../models/category.model")

/**
 * Controller for creating the category
 * 
 * POST 0.0.0.0:8888/eComm/api/v1/auth/categories
 * 
 * {
        "name" : "Household",
        "description" : "This will have all the household items"
    }
 */

exports.createNewCategory = async (req, res) => {

    //Read the category
    //Create the category object
    const cat_data = {
        name: req.body.name,
        description: req.body.description
    }
    try {
        //insert into mongodb
        const category = await category_model.create(cat_data)
        return res.status(201).send(category)
    } catch (err) {
        console.log("Error while creating the category", err)
        return res.status(500).send({
            message: "Error while creating the category"
        })
    }

    //Return the response of the created category
}