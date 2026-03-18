import { FOOD } from "../Models/food.model.js";
import { SHOP } from "../Models/shop.model.js";
import { USER } from "../Models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken'


//Add Food : [upload image by cloudinary]
export let registerFood = async (req, res) => {
    try {
        let { foodname, price, category, description, isAvailable, foodtype } = req.body;
        let owner = req.id;    //[basically this comes from auth.js and food model has "owner" : {ref : "User"}]

        if (!foodname || !price || !category || !description || !foodtype) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }

        //upload on cloudinay :
        let image = "";
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
            if (!image) {
                return res.status(500).json({
                    message: "Image upload failed",
                    success: false
                })
            }
        }

        //Find the shop of owner :
        let shop = await SHOP.findOne({ owner });
        if (!shop) {
            return res.status(404).json({
                message: "Shop not found for this owner",
                success: false
            })
        }

        let shopDetails = shop._id;  // [getting id from shop model (and it restored in food model as shopDetails {shopDetails : "ref" : "Shop"} )]
        let foodItem = await FOOD.create({
            foodname,
            price,
            category,
            image,
            description,
            isAvailable,
            foodtype,
            owner,
            shopDetails
        });

        foodItem = await foodItem.populate([
            { path: "owner", select: "fullname email phone" },
            { path: "shopDetails", select: "shopname email location phone city" }
        ]);

        return res.status(200).json({
            message: "FoodItem registered successfully",
            foodItem,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

// Get all Food items : [for admin]
export let getAllfoods = async (req, res) => {
    try {
        let token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized. Please login first",
                success: false,
            });
        }

        let foods = await FOOD.find({ owner: req.id })
            .populate("shopDetails", "_id shopname email location phone city")
            .populate("owner", "fullname email phone")

        if (!foods || foods.length === 0) {
            return res.status(404).json({
                message: "FoodItems not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "FoodItems found",
            foods,
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
}

//Get food by id :
export let getFoodById = async (req, res) => {
    try {
        let owner = req.id;
        let foodId = req.params.id;

        let foodItem = await FOOD.findById(foodId)
            .populate("shopDetails", "_id shopname email location phone city state phone email")
            .populate("owner", "fullname email phone")

        if (!foodItem) {
            return res.status(404).json({
                message: "FoodItem not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "FoodItem details",
            foodItem,
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        })
    }
}

//Update foods by id : [update image]
export let updateFoodDetails = async (req, res) => {
    try {
        let foodId = req.params.id;
        let token = req.cookies.token;
        if (!token) {
            return res.status(404).json({
                message: "Token not found pls log in",
                success: false
            })
        }

        let decoded = await jwt.verify(token, process.env.JWT_SECRET)

        let user = await USER.findById(decoded.id)
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        if (user.role === "admin") {
            let { foodname, price, category, description, foodtype, isAvailable } = req.body;

            let foodItem = await FOOD.findById(foodId);
            if (!foodItem) {
                return res.status(404).json({
                    message: "FoodItem not found",
                    success: false,
                });
            }

            if (!foodname && !price && !category && !description && !foodtype && !isAvailable) {
                return res.status(404).json({
                    message: "Update atleast one",
                    success: false,
                });
            }

            if (foodname) foodItem.foodname = foodname;
            if (price) foodItem.price = price;
            if (category) foodItem.category = category;
            if (description) foodItem.description = description;
            if (foodtype) foodItem.foodtype = foodtype;
            if (isAvailable) foodItem.isAvailable = isAvailable;

            // Update image if uploaded
            if (req.file) {
                let image = await uploadOnCloudinary(req.file.path);
                if (!image) {
                    return res.status(500).json({
                        message: "Image upload failed",
                        success: false,
                    });
                }
                foodItem.image = image;
            }

            await foodItem.save();

            return res.status(200).json({
                message: "FoodItem details updated successfully",
                foodItem,
                success: true,
            });
        }

        return res.status(200).json({
            message: "You are not admin",
            success: false
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
}

//Delete Food by id : 
export let deleteFoodByID = async (req, res) => {
    try {
        let foodId = req.params.id;

        let foodItem = await FOOD.findByIdAndDelete(foodId)
        if (!foodItem) {
            return res.status(404).json({
                message: "FoodItem not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "FoodItem deleted successfully",
            foodItem: {
                name: foodItem.foodname,
                price: foodItem.price,
                foodtype: foodItem.foodtype
            },
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        })
    }
}




//Get foodItem For [login user] -
export let getFoodForLoginUser = async (req, res) => {
    try {
        let token = req.cookies.token;
        if (!token) {
            return res.status(404).json({
                message: "Unauthorized . Pls log in first"
            })
        }

        let foods = await FOOD.find().populate("shopDetails" , "shopname")
        if (!foods) {
            return res.status(404).json({
                message: "No food found",
                success: false
            })
        }

        return res.status(200).json({ 
            message: "All foods fetched",
            foods,
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

//Get food item of each shop :
export let getFoodsFromShop = async (req, res) => {
    try {
        let shopId = req.params.id;
        if (!shopId) {
            return res.status(400).json({
                message: "shop not found", 
                success: false
            })
        }

        let foods = await FOOD.find({shopDetails : shopId}).populate("shopDetails")
        if (!foods) {
            return res.status(400).json({ 
                message: "Foods not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Shop foods fetched successfully",
            foods,
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}
 