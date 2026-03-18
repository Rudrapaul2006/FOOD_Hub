import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { order_endpoint } from '../Utils/utils';
import { setUserOrderData, setUserOrderLoading } from '../Redux/orderSlice';

const getAllUserOrder = () => {
    let dispatch = useDispatch()
    let {userData} = useSelector(state => state.user)
    
    useEffect(() => {
        if (userData?.user?.role !== "user") return;
        if(!userData) return;

        let fetchUserOrders = async () => {
            dispatch(setUserOrderLoading(true))
            try {
                let res = await axios.get(`${order_endpoint}/userorderget` , {withCredentials : true})
                if(res.data.success){
                    dispatch(setUserOrderData(res.data.userOrder))
                }
            } catch (error) {
                dispatch(setUserOrderData([]))
            } finally {
                dispatch(setUserOrderLoading(false))
            }
        }

        fetchUserOrders()
        
    } ,[dispatch , userData])
}

export default getAllUserOrder
