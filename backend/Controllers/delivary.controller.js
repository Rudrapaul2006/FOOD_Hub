import { DELIVARY } from '../Models/delivary.model.js';
import { ORDER } from '../Models/order.model.js';
import { USER } from '../Models/user.model.js'
import jwt from 'jsonwebtoken'
import { sendOtpDelivary } from '../utils/mail.js';
import { updateUserOrderStatus } from './order.controller.js';

// Available delivary boys get all orders from shop :
export let getAllOrdersFromShop = async (req, res) => {
    try {
        let token = req.cookies.token;
        if (!token) {
            return res.status(400).json({
                message: "Token not found ..",
                success: false
            })
        }

        let decoded = await jwt.verify(token, process.env.JWT_SECRET);
        let delivaryboy = await USER.findById(decoded.id);

        if (delivaryboy.role === "delivaryboy") {
            let shopOrder = await DELIVARY.find({ status: "brodcasted", brodcasted: delivaryboy._id }).sort({ createdAt: -1 }).populate("orderedBy", "fullname email phone role address pincode location")
                .populate("shopDetails", "shopname email location phone city shopGeoLocation").populate("foodDetails", "foodname price category description isAvailable foodtype")
                .populate("order", "quantity paymentMethod orderStatus paymentMethod")

            if (!shopOrder) {
                return res.status(400).json({
                    message: "Shop's order not found",
                    success: false
                })
            }

            return res.status(200).json({
                message: "All order's get successfuly",
                shopOrder,
                success: true
            })
        }

        return res.status(400).json({
            message: "You are not a delivary boy",
            success: false
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

//Accept order by one available guy :
export let acceptShopOrder = async (req, res) => {
    try {
        let userId = req.id;
        let assignmentId = req.params.id;

        let assignment = await DELIVARY.findById(assignmentId);
        if (!assignment || assignment.status !== "brodcasted") {
            return res.status(400).json({
                message: "Assignment not available",
                success: false
            })
        }

        let activeOrder = await DELIVARY.findOne({ assignto: userId, status: "asigned" })

        if (activeOrder) {
            return res.status(400).json({
                message: "Complete current order before accepting a new one",
                success: false
            })
        }

        assignment.assignto = userId;
        assignment.status = "asigned";
        assignment.acceptedate = new Date();
        await assignment.save();

        let shopOrder = await ORDER.findById(assignment.order);
        if (!shopOrder) {
            return res.status(400).json({
                message: "Order not found",
                success: false
            })
        }

        shopOrder.assignedDelivaryBoy = userId;
        shopOrder.assignment = assignment._id;
        await shopOrder.save()

        let delivaryBoyAvailable = await USER.findById(userId);
        delivaryBoyAvailable.available = "no"
        await delivaryBoyAvailable.save()

        return res.status(200).json({
            message: "Order accepted successfully",
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

// get accepted order by delivary boy :
export let acceptedOrderByDelivaryBoy = async (req, res) => {
    try {
        let userId = req.id;
        let assignmentId = req.params.id;

        let acceptedOrder = await DELIVARY.findOne({ _id: assignmentId, assignto: userId, status: "asigned" })
            .populate("orderedBy", "fullname email phone role address pincode location")
            .populate("shopDetails", "shopname email location phone city shopGeoLocation")
            .populate("foodDetails", "foodname price category description quantity paymentMethod isAvailable foodtype")
            .populate("order", "quantity paymentMethod orderStatus orderGroupId")

        if (!acceptedOrder) {
            return res.status(400).json({
                message: "No accepted order found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Accepted order fetched successfully",
            acceptedOrder,
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

//Delivary order status update :
export let delivayPaymentStatus = async (req, res) => {
    try {
        let token = req.cookies.token;
        if (!token) {
            return res.status(400).json({
                message: "Token not found , pls login again",
                success: false
            })
        }
        let decoded = await jwt.verify(token, process.env.JWT_SECRET);
        let user = await USER.findById(decoded.id)

        let assignmentId = req.params.id;
        let { paymentStatus } = req.body;

        if (!assignmentId) {
            return res.status(400).json({
                message: "Order not found",
                success: false
            })
        }

        if (user.role === "delivaryboy") {
            let updateOrderPaymentStatus = await DELIVARY.findByIdAndUpdate(assignmentId, { paymentStatus: paymentStatus , status: "compleate"}, { new: true })
                .populate("orderedBy", "fullname email phone address location")
                .populate("shopDetails", "shopname email city phone location state shopGeoLocation")
                .populate("foodDetails", "foodname price category description foodtype")
                .populate("order", "quantity paymentMethod")

            if (!updateOrderPaymentStatus) {
                return res.status(400).json({
                    message: "Order's payment status not updated",
                    success: false
                })
            }

            user.available = "yes"
            await user.save()
            
            return res.status(200).json({
                message: "Order's payment status updated succesfully",
                updateOrderPaymentStatus,
                success: true
            })
        }

        return res.status(400).json({
            message: "You are not a delivaryboy",
            success: false
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}


// Send Delivary OTP to user :
export let sendDelivaryOtpToUser = async (req, res) => {
    try {
        let groupId = req.params.id;
        let order = await ORDER.find({ orderGroupId: groupId.toString() }).populate("orderedBy", "fullname email phone address location")
        if (!order) {
            return res.status(400).json({
                message: "Order not found",
                success: false
            })
        }

        let userId = (order.map(i => i?.orderedBy?._id.toString())[0])

        let user = await USER.findById(userId)
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        // //Generate otp and expire time :
        let delivaryOtp = Math.floor(1000 + Math.random() * 9000).toString();
        let expireTime = new Date(Date.now() + 5 * 60 * 1000); //5 minutes

        for (let i of order) {
            i.expireOtp = expireTime
            i.sendDelivaryOtp = delivaryOtp
            await i.save()
        }

        await sendOtpDelivary(user.email, delivaryOtp);

        return res.status(200).json({
            message: "Delivary OTP sent to user successfully",
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

// verify the delivary otp :
export let verifyDelivaryOtp = async (req, res) => {
    try {
        let groupId = req.params.id;
        let { delivaryOtp } = req.body;

        let order = await ORDER.find({ orderGroupId: groupId.toString() }).populate("orderedBy", "fullname email phone address location");

        if (!order || order.length === 0) {
            return res.status(400).json({
                message: "Order not found",
                success: false
            })
        }

        if (order.map(i => i.sendDelivaryOtp)[0] !== delivaryOtp.toString() || !order.map(i => i.expireOtp)[0] || order.map(i => i.expireOtp)[0] < new Date()) {
            return res.status(400).json({
                message: "OTP expired or OTP is incorrect",
                success: false
            })
        }

        for (let i of order) {
            i.orderStatus = "compleate"
            i.sendDelivaryOtp = null
            i.expireOtp = null
            await i.save()
        }

        return res.status(200).json({
            message: "Delivery OTP verified successfully",
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



//Found how many order this delivary guy delivered : [reset after one day]
export let howManyDelivaryCompleate = async (req, res) => {
    try {
        let userId = req.id;
        if (!userId) {
            return res.status(400).json({
                message: "Delivery boy not found",
                success: false
            })
        }

        let startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        let endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        let completedOrders = await DELIVARY.find({
            assignto: userId,
            status: "compleate",
            updatedAt: { $gte: startOfDay, $lte: endOfDay }
        })
            // .populate("assignto").populate("order", "quantity paymentMethod orderStatus paymentMethod")
            .populate("foodDetails", "foodname price category description foodtype")
            .populate("shopDetails", "shopname email city phone location state shopGeoLocation")
        // .populate("orderedBy", "fullname email phone address location")

        return res.status(200).json({
            message: "Today's completed orders fetched",
            count: completedOrders.length,
            orders: completedOrders,
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