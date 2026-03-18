import React, { useEffect, useState } from 'react'
import UserNav from '../Component/UserNav'
import getUserAllShops from '../User Hooks/getUserAllShops'
import axios from 'axios';
import { food_endpoint, shop_endpoint } from '../Utils/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchUserFoodByText, setUserFoodData } from '../Redux/foodSlice';
import { setSingleShopData } from '../Redux/adminSlice';
import UserFoodItem from '../User Component/UserFoodItem';
import useGetAllCartItems from '../User Hooks/useGetAllCartItems';
import { IoChevronBack } from 'react-icons/io5';

const ShopFoods = () => {
    useGetAllCartItems()

    let params = useParams()
    let dispatch = useDispatch()
    let navigate = useNavigate()
    let shopId = params.id

    let { singleShopData } = useSelector(state => state.admin)
    let { searchUserFoodByText } = useSelector(state => state.food) //Search from userFoodData : [] => redux 

    //Fetch Particular shops food Items :
    let foodItemsOfShop = async () => {
        try {
            let res = await axios.get(`${food_endpoint}/getallshopfoods/${shopId}`, { withCredentials: true })
            if (res.data.success) {
                dispatch(setUserFoodData(res.data.foods))
            }
        } catch (error) {
            console.log(error)
        }
    }

    let fetchShopData = async () => {
        try {
            let res = await axios.get(`${shop_endpoint}/get/${shopId}`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setSingleShopData(res.data.shop))
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        foodItemsOfShop()
        fetchShopData()
    }, [shopId, dispatch])

    return (
        <>
            <div className='sticky top-0 z-999 bg-white'> <UserNav /> </div>

            <div className='lg:mx-20 mt-9'>

                <div className='top-19 h-25 fixed bg-white z-9 flex items-center gap-4 w-full px-2 lg:px-0 py-3'>
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center w-10 h-10 border border-gray-300 bg-white rounded-lg hover:bg-gray-100 active:scale-95 transition duration-200 cursor-pointer"
                        >
                            <IoChevronBack size={20} />
                        </button>
                    </div>

                    <div className='flex-1'>
                        <input
                            value={searchUserFoodByText}
                            onChange={(e) => dispatch(setSearchUserFoodByText(e.target.value))}
                            placeholder='Search For food item'
                            type="text"
                            className='w-full lg:w-[40%] rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring focus:ring-orange-300 focus:border-orange-200 transition'
                        />
                    </div>
                </div>

                <div className='mt-27 lg:mt-25'>
                    <div className='mr-2 ml-2 lg:ml-0 lg:mr-0 text-3xl font-bold text-[#ff4d2d]'>{singleShopData.shopname ? <div>{singleShopData?.shopname} <span className='text-[black]'>'s food item</span></div> : "Null"}</div>

                    <div className='mt-7 w-full'>
                        <UserFoodItem />
                    </div>
                </div>
            </div>
        </>
    )
}


export default ShopFoods