import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { food_endpoint } from '../Utils/utils';
import { setUserAllFoodData, setUserAllFoodLoading } from '../Redux/foodSlice';

const getAllFoodsFromShops = () => {
    let dispatch = useDispatch()
    let {userData} = useSelector(state => state.user)

    useEffect(() => {
        if (userData?.user?.role !== "user") return;
        if(!userData) return;

        let fetchAllFoods = async () => {
            try {
                dispatch(setUserAllFoodLoading(true))
                let res = await axios.get(`${food_endpoint}/userget` , {withCredentials : true})
                if(res.data.success){
                    dispatch(setUserAllFoodData(res.data.foods))
                }
            } catch (error) {
                dispatch(setUserAllFoodData([]))
            } finally {
                dispatch(setUserAllFoodLoading(false))
            }
        }

        fetchAllFoods()
    }, [dispatch , userData])
}

export default getAllFoodsFromShops
