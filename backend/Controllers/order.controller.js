import { USER } from "../Models/user.model.js";
import { SHOP } from '../Models/shop.model.js';
import { ORDER } from "../Models/order.model.js";
import { FOOD } from "../Models/food.model.js";
import { DELIVARY } from "../Models/delivary.model.js";
import { CART } from "../Models/cart.model.js";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";


//create order by user :
export let orderTheFoodItem = async (req, res) => {
    try {
        let foodId = req.params.id;  //put food items id on api -

        // Auth (get user and userId from token)
        let token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized . Please log in first",
                success: false
            })
        }

        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        let userId = decoded.id;

        let user = await USER.findById(userId);
        if (user.role !== "user") {
            return res.status(404).json({
                message: "You are not a user",
                success: false
            })
        }

        //Field cheaking 
        let { quantity, paymentMethod, address, pincode } = req.body;
        if (!quantity || !paymentMethod) {
            return res.status(400).json({
                message: "payment method is required",
                success: false
            })
        }

        if (!user.address || !user.pincode) {
            if (!address || !pincode) {
                return res.status(400).json({
                    message: "Address and pincode are required for first order",
                    success: false
                });
            }

            user.address = address;
            user.pincode = pincode;
            await user.save();
        }

        // // Prevent duplicate order : 
        // let orderCount = await ORDER.countDocuments({
        //     foodDetails: foodId,
        //     orderedBy: userId
        // })

        // // if (orderCount >= 3) {
        // //     return res.status(409).json({
        // //         message: "You can order this item only 3 times",
        // //         success: false
        // //     })
        // // }

        // // Get food then shop then owner 

        let food = await FOOD.findById(foodId);
        if (!food) {
            return res.status(201).json({
                message: "Food item not found",
                success: false
            })
        }

        //Cheaking Food is available or not :
        if (food.isAvailable === "yes") {
            let orderGroupId = new mongoose.Types.ObjectId() // Generate a unique order group ID for this order
            let newOrder = await ORDER.create({
                orderedBy: userId,
                foodDetails: foodId,

                //In food controler [register fooditem - in that i polpulate owner and shopDetails]
                shopDetails: food.shopDetails,
                owner: food.owner,

                quantity,
                paymentMethod,
                address: user.address,
                pincode: user.pincode,
                orderGroupId
            })

            let populatedOrder = await ORDER.findById(newOrder._id)
                .populate("orderedBy", "fullname email phone role address pincode location")
                .populate("foodDetails", "foodname price category isAvailable")
                .populate("shopDetails", "shopname location phone city")

            return res.status(201).json({
                message: "Order registered successfully",
                order: populatedOrder,
                success: true
            })
        }

        return res.status(201).json({
            message: "Food is not available",
            success: false
        })

    } catch (error) {
        console.log("Order error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

//Create all order from cart [each shop food separate grouping and order creating] :
export let allShopOrder = async (req, res) => {
    try {
        let userId = req.id
        let user = await USER.findById(userId)
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        let cartData = await CART.find({ userDetails: userId })
            .populate("foodDetails", "foodname price category description isAvailable foodtype shopDetails")
            .populate("userDetails", "fullname email phone location role address pincode")
            .populate("shopDetails", "shopGeoLocation shopname email description location phone city state open")

        if (!cartData || cartData.length < 1) {
            return res.status(400).json({
                message: "No food available for order",
                success: false
            })
        }        

        let { paymentMethod, address, pincode } = req.body
        if (!paymentMethod) {
            return res.status(400).json({
                message: "Payment method is requird",
                success: false
            })
        }
        if (!address || !pincode) {
            if (!user.address || !user.pincode) {
                return res.status(400).json({
                    message: "Address and pincode required",
                    success: false
                })
            }
        }

        let isFoodAvailable = cartData.filter(item => item.foodDetails.isAvailable === "yes")
        if (isFoodAvailable.length === 0) {
            return res.status(400).json({
                message: "No available items to order",
                success: false
            })
        }

        // separate foods by shop :
        let groupedByShop = {}

        isFoodAvailable.forEach(item => {
            let shopId = item.shopDetails._id.toString()
            if (!groupedByShop[shopId]) {
                groupedByShop[shopId] = []
            }
            groupedByShop[shopId].push(item)
        })


        let allOrders = []
        for (let shopId in groupedByShop) {

            let items = groupedByShop[shopId]
            let orderGroupId = new mongoose.Types.ObjectId()

            let createOrders = items.map(item => ({
                orderedBy: userId,
                foodDetails: item.foodDetails._id,
                shopDetails: item.shopDetails._id,
                quantity: item.quantity,
                paymentMethod,
                address: address || user.address,
                pincode: pincode || user.pincode,
                orderGroupId // Generate a unique order group ID for each shop's order
            }))
            let createdOrders = await ORDER.create(createOrders)


            // get only IDs
            let orderIds = createdOrders.map(order => order._id)
            let orderDetails = await ORDER.find({ _id: orderIds })
                .populate("foodDetails", "foodname price category description isAvailable foodtype shopDetails")
                .populate("orderedBy", "fullname email phone location role address pincode")
                .populate("shopDetails", "shopGeoLocation shopname email description location phone city state")

            // push all populated orders 
            allOrders.push(...orderDetails)
        }

        return res.status(201).json({
            message: "Order register successfully",
            totalOrders: allOrders.length,
            allOrders,
            success: true
        })

    } catch (error) {
        console.log("Error in allShopOrder:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}



//Get all cart item by user ID : 
export let getAllCartItem = async (req, res) => {
    try {
        let userId = req.id
        let user = await USER.findById(userId)
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        let cartItems = await CART.find({ userDetails: userId })
            .populate("foodDetails", "foodname price image category description isAvailable foodtype")
            .populate("userDetails", "fullname email phone location role address pincode")
            .populate("shopDetails", "shopGeoLocation shopname email description location phone city state")

        let isAvalableFoodItems = cartItems.filter(item => item.foodDetails.isAvailable === "yes")

        return res.status(200).json({
            message: "All items fetched successfully",
            isAvalableFoodItems,
            success: true
        })



    } catch (error) {
        console.log("Order error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}



//Get all orders from user : [for admin] :
export let getAllOrders = async (req, res) => {
    try {
        let adminId = req.id;

        if (!adminId) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            })
        }

        let admin = await USER.findById(adminId);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({
                message: "You are not admin",
                success: false
            })
        }

        let shop = await SHOP.findOne({ owner: admin._id });
        if (!shop) {
            return res.status(404).json({
                message: "Shop not found",
                success: false
            })
        }

        let allOrders = await ORDER.find({ shopDetails: shop._id })
            .sort({ createdAt: -1 })
            .populate("orderedBy", "fullname email role address pincode phone")
            .populate("foodDetails", "foodname price category foodtype paymentMethod quantity description isAvailable")
            .populate("shopDetails", "_id shopname phone")
            .populate("assignment" , "paymentStatus")
            .populate({
                path: "assignment",
                populate: {
                    path: "assignto",
                    select: "fullname email phone location"
                }
            })

        if (!allOrders || allOrders.length === 0) {
            return res.status(404).json({
                message: "No Orders Registered Yet",
                success: false
            })
        }

        let grouped = {}
        allOrders.forEach(order => {
            let gId = order.orderGroupId.toString()
            if (!grouped[gId]) {
                grouped[gId] = {
                    items: []
                }
            }
            grouped[gId].items.push(order)
        })

        return res.status(200).json({
            message: "All orders fetched successfully",
            allOrders: Object.values(grouped),
            success: true
        })

    } catch (error) {
        console.log("Get All Orders Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

//Get order by groupId : [for admin] by order id :
export const getOrderById = async (req, res) => {
    try {
        let groupId = req.params.id;

        if (!groupId) {
            return res.status(400).json({
                message: "Invalid Order Group ID",
                success: false
            })
        }

        let token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized. Please log in first",
                success: false
            })
        }

        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        let admin = await USER.findById(decoded.id);

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({
                message: "You are not admin",
                success: false
            })
        }

        let shop = await SHOP.findOne({ owner: admin._id });
        if (!shop) {
            return res.status(404).json({
                message: "Shop not found",
                success: false
            })
        }

        let orders = await ORDER.find({ orderGroupId: groupId, shopDetails: shop._id })
            .sort({ createdAt: -1 })
            .populate("orderedBy", "fullname email role address pincode phone")
            .populate("foodDetails", "foodname price category quantity paymentMethod foodtype description isAvailable")
            .populate("shopDetails", "_id shopname phone city state")
            .populate({
                path: "assignment",
                populate: {
                    path: "assignto",
                    select: "fullname email phone location"
                }
            })

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                message: "No orders found",
                success: false
            })
        }

        let grouped = {}
        orders.forEach(item => {
            let gId = item.orderGroupId.toString()
            if (!grouped[gId]) {
                grouped[gId] = { items: [] }
            }
            grouped[gId].items.push(item)
        })

        return res.status(200).json({
            message: "Orders fetched successfully",
            order: Object.values(grouped),
            success: true
        })

    } catch (error) {
        console.log("Order error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

//Update user order or groupOrder status => [by admin] : and assign the delivary boy : [most imp]
export let updateUserOrderStatus = async (req, res) => {
    try {
        let groupId = req.params.id
        let { orderStatus } = req.body

        if (!groupId) {
            return res.status(400).json({
                message: "Invalid Order Group ID",
                success: false
            })
        }

        if (!orderStatus) {
            return res.status(400).json({
                message: "Order status is required",
                success: false
            })
        }

        let token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized. Please login first",
                success: false
            })
        }

        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        let admin = await USER.findById(decoded.id)

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({
                message: "You are not admin",
                success: false
            })
        }

        let shop = await SHOP.findOne({ owner: admin._id })
        if (!shop) {
            return res.status(404).json({
                message: "Shop not found",
                success: false
            })
        }

        // Finding orders :
        let orders = await ORDER.find({ orderGroupId: groupId, shopDetails: shop._id })

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                message: "No orders found",
                success: false
            })
        }

        //Asign delivary boy for the particuler order :
        if ((orderStatus === "out for delivary") || !assignment) {

            if (!shop.shopGeoLocation) {
                return res.status(404).json({
                    message: "Shop not found",
                    success: false
                })
            }

            let [longitude, latitude] = shop.shopGeoLocation.coordinates;
            
            //Free Delivary Boys under 7km :
            let nearByDeliveryBoys = await USER.find({
                role: "delivaryboy",
                available: "yes",
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [longitude, latitude],
                        },
                        $maxDistance: 7000,
                    },
                },
            }).select("_id fullname email phone location role available")

            if (!nearByDeliveryBoys || nearByDeliveryBoys.length === 0) {
                return res.status(400).json({
                    message: "Currently no delivery partner is available nearby. Please try again in a few minutes ..",
                    success: false
                })
            }

            //FindIng busy delivary boys :
            let busyDeliveryBoys = await DELIVARY.find({
                assignto: { $in: nearByDeliveryBoys.map(b => b._id) },
                status: { $nin: ["brodcasted", "compleate"] }
            }).distinct("assignto")

            // Making set of busy delivary boys :
            let busySet = new Set(busyDeliveryBoys.map(id => String(id)))

            //Filtering free delivary boys :
            let freeDeliveryBoys = nearByDeliveryBoys.filter( b => !busySet.has(String(b._id)))

            if (freeDeliveryBoys.length === 0 || !freeDeliveryBoys) {
                return res.status(400).json({
                    message: "All delivery boys are busy . Status not updated.",
                    success: false
                })
            }

            await ORDER.updateMany(
                { orderGroupId: groupId, shopDetails: shop._id },
                { $set: { orderStatus: orderStatus } }
            )

            let delivary = await DELIVARY.create({
                order: orders.map(i => i._id),
                orderedBy: orders.map(i => i.orderedBy)[0],
                shopDetails: shop._id,
                foodDetails: orders.map(i => i.foodDetails),
                brodcasted: freeDeliveryBoys.map(i => i._id),
                status: "brodcasted",
                paymentStatus: "pending"
            })

            await ORDER.updateMany(
                { orderGroupId: groupId, shopDetails: shop._id },
                { $set: { assignment: delivary._id, brodcastedTo: freeDeliveryBoys } }
            )

        } else {
            await ORDER.updateMany(
                { orderGroupId: groupId, shopDetails: shop._id },
                { $set: { orderStatus: orderStatus } }
            )
        }

        let updatedOrders = await ORDER.find({ orderGroupId: groupId, shopDetails: shop._id }).sort({ createdAt: -1 })
            .populate("orderedBy", "fullname email role address pincode phone")
            .populate("foodDetails", "foodname price category foodtype paymentMethod quantity description isAvailable")
            .populate("shopDetails", "_id shopGeoLocation shopname email description location phone city state")
            .populate({
                path: "assignment",
                populate: {
                    path: "assignto",
                    select: "fullname email phone location"
                }
            })

        let grouped = {}

        updatedOrders.forEach(order => {
            let gId = order.orderGroupId.toString()
            if (!grouped[gId]) {
                grouped[gId] = { items: [] }
            }
            grouped[gId].items.push(order)
        })

        return res.status(200).json({
            message: "Order status updated successfully",
            orders: Object.values(grouped),
            success: true
        })

    } catch (error) {
        console.log("Update Order Status Error:", error)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

//Delete Order : 
export let DeleteUserOrderById = async (req, res) => {
    try {
        let orderId = req.params.id

        let deleteOrder = await ORDER.findByIdAndDelete(orderId);
        if (!deleteOrder) {
            return res.status(400).json({
                message: "Order not found",
                success: false,
            })
        }

        return res.status(200).json({
            message: "order deleted successfully",
            success: true
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

//update order address : [for user]
export let updateOrderAddress = async (req, res) => {
    try {
        let orderId = req.params.id;
        let userId = req.id;
        let { address, pincode } = req.body;

        let user = await USER.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        let order = await ORDER.findById(orderId);
        if (!order) {
            return res.status(400).json({
                message: "Order not found",
                success: false
            })
        }

        if (address) {
            order.address = address,
                user.address = address
        }

        if (pincode) {
            order.pincode = pincode,
                user.pincode = pincode
        }

        await user.save();
        await order.save();

        return res.status(200).json({
            message: "Order address updated successfully",
            user: {
                address: user.address,
                pincode: user.pincode
            },
            order: {
                address: order.address,
                pincode: order.pincode
            },
            success: CSSPositionTryRule
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}




// user_side all order get :
export let userOrders = async (req, res) => {
    try {
        let userId = req.id;

        let orders = await ORDER.find({ orderedBy: userId })
            .populate("foodDetails", "foodname price image category description isAvailable foodtype")
            .populate("orderedBy", "fullname email phone location role address pincode")
            .populate("assignment" , "paymentStatus")
            .populate("shopDetails", "shopGeoLocation shopname email description location phone city state")
            .sort({ createdAt: -1 })

        if (!orders || orders.length < 1) {
            return res.status(400).json({
                message: "No order found for this user",
                success: false
            })
        }

        let grouped = {}
        orders.forEach(order => {
            let groupId = order.orderGroupId.toString()
            if (!grouped[groupId]) {
                grouped[groupId] = {
                    orderGroupId: groupId,
                    items: []
                }
            }
            grouped[groupId].items.push(order);
        })

        return res.status(200).json({
            totalRestaurants: Object.keys(grouped).length,
            userOrder: Object.values(grouped),
            success: true
        })

    } catch (error) {
        console.log("Order error:", error)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

// find userOrder By groupId [shop id se shop ke order get karne hai] 
export let getUserOrderById = async (req, res) => {
    try {
        let orderGroupId = req.params.id

        let orderDetails = await ORDER.find({ orderGroupId: orderGroupId })
            .populate("orderedBy", "fullname email phone pincode address location")
            .populate("shopDetails", "shopname email phone state location city")
            .populate("foodDetails", "foodname price description category image isAvailable foodtype")
            .populate("assignment" , "paymentStatus")

        if (!orderDetails) {
            return res.status(400).json({
                message: "Order not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Order data fetched successfully",
            orderDetails,
            success: true
        })

    } catch (error) {
        console.log("Order error:", error)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

//[Admins] can get orders from user [by food id] : [wrong api]
export let getUserOrders = async (req, res) => {
    try {
        let foodId = req.params.id;

        let food = await FOOD.findById(foodId);
        if (!food) {
            return res.status(404).json({
                message: "Food not found",
                success: false
            })
        }

        let details = await ORDER.find({ foodDetails: foodId })
            .populate("orderedBy", "fullname email phone role")
            .populate("foodDetails", "foodname price category")

        //User order details in order model
        let userOrderDetails = details.map((data) => ({
            OrderedBy: data.orderedBy,
            quantity: data.quantity,
            orderStatus: data.orderStatus,
            paymentMethod: data.paymentMethod
        }))

        //Food Details in order model:
        let foodDetails = {
            name: food.foodname,
            price: food.price,
            description: food.description,
            category: food.category,
            foodType: food.foodtype,
            image: food.image
        }

        return res.status(200).json({
            message: "Order details",
            userOrderDetails,
            foodDetails,
            success: true
        })

    } catch (error) {
        console.log("Order error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}