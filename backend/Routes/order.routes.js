import express from 'express';
import { isAuth } from "../isAuth/isAuthentication.js";
import { allShopOrder, DeleteUserOrderById, getAllCartItem, getAllOrders, getOrderById, getUserOrderById, getUserOrders, orderTheFoodItem, updateOrderAddress, updateUserOrderStatus, userOrders } from '../Controllers/order.controller.js';

let orderRoute = express.Router();

orderRoute.post("/apply_order/:id" , isAuth, orderTheFoodItem );    
orderRoute.post("/applyallorder" , isAuth , allShopOrder); //[for single food]
orderRoute.get("/allitems", isAuth , getAllCartItem);
orderRoute.get("/get", isAuth, getAllOrders );  
orderRoute.get("/getOrderbyid/:id", isAuth, getOrderById);  
orderRoute.get("/getorderdetails/:id" ,isAuth, getUserOrders ); //extra api
orderRoute.put("/updatestatus/:id" ,isAuth, updateUserOrderStatus );
orderRoute.delete("/delete/:id" ,isAuth, DeleteUserOrderById );
orderRoute.put("/updateaddress/:id" ,isAuth, updateOrderAddress);


//User order get :
orderRoute.get("/userorderget", isAuth , userOrders)   
orderRoute.get("/userorder/:id", isAuth , getUserOrderById)

export default orderRoute;    