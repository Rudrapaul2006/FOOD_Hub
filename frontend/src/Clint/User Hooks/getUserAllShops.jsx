import React, { use, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setUserShopData, setUserShopLoading } from '../Redux/adminSlice';
import { shop_endpoint } from '../Utils/utils';
import axios from 'axios';

const getUserAllShops = () => {
    let dispatch = useDispatch()

    let { userData } = useSelector((state) => state.user);
    if (!userData) return;

    useEffect(() => {
        if (userData?.user?.role !== "user") return;
        dispatch(setUserShopLoading(true))

        let fetchAllShops = async () => {
            try {
                let res = await axios.get(`${shop_endpoint}/getallshops` , { withCredentials: true } )
                if (res.data.success) {
                    dispatch(setUserShopData(res.data.shops))
                    dispatch(setUserShopLoading(false))
                }
            } catch (error) {
                console.log(error)
                dispatch(setUserShopData([]))
            } finally {
                dispatch(setUserShopLoading(false))
            }
        }

        fetchAllShops()
    }, [userData , dispatch])
}

export default getUserAllShops
