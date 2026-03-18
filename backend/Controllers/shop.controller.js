import { SHOP } from '../Models/shop.model.js';
import { FOOD } from "../Models/food.model.js"
import uploadOnCloudinary from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken'
import { USER } from '../Models/user.model.js';

//Shop Rejister : [pic upload by cloudinary]
export let ShopRegister = async (req, res) => {
    try {
        let { shopname, email, description, location, phone, city, state, open } = req.body;
        if (!shopname || !email || !description || !location || !phone || !state || !city) {
            return res.status(404).json({
                message: "All fields are required",
                success: false
            })
        }
        let owner = req.id; //Comes this id from auth.js

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

        //1 owner 1 shop :
        let existingShopByUser = await SHOP.findOne({ owner });
        if (existingShopByUser) {
            return res.status(404).json({
                message: "Owner already has a shop",
                success: false
            });
        }

        let shop = await SHOP.create({
            shopname, email, description, location, phone, city, state, image, open, owner //owners id from User model
        })

        shop = await shop.populate("owner", "fullname email phone ");

        return res.status(200).json({
            message: "Shop details registered",
            shop,
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

// Get Shop :
export let getShop = async (req, res) => {
    try {
        let owner = req.id;
        let shop = await SHOP.find({ owner }).populate("owner", "fullname email phone role");

        if (!shop) {
            return res.status(404).json({
                message: "This admin dont have any shop",
                success: false
            });
        }

        return res.status(200).json({
            message: "Shop details",
            shop,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

//Update shop open or close :
export let shopStatus = async (req, res) => {
    try {
        let adminId = req.id;
        let user = await USER.findById({ _id: adminId });
        let {open} = req.body

        if (user.role !== "admin") {
            return res.status(400).json({
                message: "You are not admin",
                success: false
            })
        }

        let shop = await SHOP.find({owner : adminId})
        if (!shop) {
            return res.status(400).json({
                message: "Admin dont have any shop",
                success: false
            })
        }

        for (let i of shop){
            i.open = open
            await i.save()
        }
        
        return res.status(200).json({
            message : "Shop status updated" , 
            shop, 
            success : true
        })
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error ",
            success: false
        })
    }
}

//Update Shops details (by id) : [image update by multer and cloudinary]
export let shopUpdate = async (req, res) => {
    try {
        let { shopname, email, description, location, phone, city } = req.body;
        let shopId = req.params.id;

        let shop = await SHOP.findById(shopId);
        if (!shop) {
            return res.status(404).json({
                message: "Shop not found",
                success: false
            })
        }

        if (!shopname && !email && !description && !location && !phone && !city && !req.file) {
            return res.status(400).json({
                message: "You need to update at least one field",
                success: false
            })
        }

        if (shopname) shop.shopname = shopname;
        if (email) shop.email = email;
        if (description) shop.description = description;
        if (location) shop.location = location;
        if (phone) shop.phone = phone;
        if (city) shop.city = city;

        //Image update
        if (req.file) {
            let image = await uploadOnCloudinary(req.file.path)
            if (!image) {
                return res.status(500).json({
                    message: "Image upload failed",
                    success: false
                })
            }
            shop.image = image;
        }

        await shop.save();

        return res.status(200).json({
            message: "Shop details update successfully",
            shop,
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

//Delete shop by id :
export let deleteShop = async (req, res) => {
    try {
        let shopId = req.params.id;
        let shop = await SHOP.findByIdAndDelete(shopId);
        if (!shop) {
            return res.status(404).json({
                message: "Shop not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Shop deleted successfully",
            deletedshop: {
                name: shop.shopname,
                email: shop.email,
                description: shop.description,
                location: shop.location,
                phone: shop.phone
            },
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

//Update shop location :
export let ShopGeoLocation = async (req, res) => {
    try {
        let ownerId = req.id;
        let { lon, lat } = req.body

        if (!lon || !lat) {
            return res.status(400).json({
                message: "Longitude and latitude are required",
                success: false
            })
        }

        let shop = await SHOP.findOneAndUpdate({ owner: ownerId }, { shopGeoLocation: { type: "Point", coordinates: [lon, lat] } }, { new: true })
        if (!shop) {
            return res.status(404).json({
                message: "Shop not found for this owner",
                success: false
            })
        }

        return res.status(200).json({
            message: "Shop geolocation set successfully",
            shopGeoLocation: [
                { longitude: shop.shopGeoLocation.coordinates[0] },
                { latitude: shop.shopGeoLocation.coordinates[1] }
            ],
            success: true
        })

    } catch (error) {
        console.log("Shop geo error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}



// get all shop's or resturent :
export let getAllShops = async (req, res) => {
    try {
        let shops = await SHOP.find().populate("owner")
        if (!shops) {
            return res.status(400).json({
                message: "Shop not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "All shop fetched successfully",
            shops,
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

//[user]  
//Find shops by id : [extra api because 1 owner 1 shop] :
export let getShopById = async (req, res) => {
    try {
        let shopId = req.params.id;

        let shop = await SHOP.findById(shopId).populate("owner", "fullname email phone role")
        if (!shop) {
            return res.status(404).json({
                message: "Shop not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Shop details ",
            shop,
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
