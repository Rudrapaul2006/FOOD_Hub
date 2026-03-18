import React, { useEffect, useState } from 'react'
import UserNav from '../Component/UserNav'
import getAllFoodsFromShops from '../User Hooks/getAllFoodsFromShops'
import { useDispatch, useSelector } from 'react-redux';
import getUserAllShops from '../User Hooks/getUserAllShops';
import { MdOutlineShoppingCart } from 'react-icons/md';
import axios from 'axios';
import { cart_endpoint } from '../Utils/utils';
import { addFoodInCart, setFindAllFoodByText } from '../Redux/foodSlice';
import useGetAllCartItems from '../User Hooks/useGetAllCartItems';
import { toast } from 'sonner';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

const AllFoods = () => {
    getAllFoodsFromShops()
    useGetAllCartItems()

    //All Foods from every resturent stored here :
    let { userAllFoodData } = useSelector(state => state.food)

    //Filtered userAllFoodData : 
    let { findAllFoodByText } = useSelector(state => state.food)

    let filteredUserAllFoods = userAllFoodData.filter(food => (
        food.foodname.toLowerCase().includes(findAllFoodByText.toLowerCase()) ||
        food.category.toLowerCase().includes(findAllFoodByText.toLowerCase()) ||
        food.foodtype.toLowerCase().includes(findAllFoodByText.toLowerCase()) ||
        food.price <= Number(findAllFoodByText)
    ))

    //Add to cart :
    let dispatch = useDispatch()
    let addFoodToCart = async (foodId) => {
        try {
            let res = await axios.post(`${cart_endpoint}/add/${foodId}`, {}, { withCredentials: true })
            if (res.data.success) {
                dispatch(addFoodInCart(res.data.cartData))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message)
        }
    }

    // Cart Data :
    let { cartData } = useSelector(state => state.food)


    //Pagination :
    let [currentPage, setCurrentPage] = useState(0)

    let pageSize = 20;
    let totalFoods = userAllFoodData.length;
    let totalpage = Math.ceil(totalFoods / pageSize)

    let start = currentPage * pageSize  //[20*0  => 20*1 => 20*2]
    let end = (start + pageSize)        //[20*0 + 20  => 20*1 + 20 => 20*2 +20 ]

    let nextButton = () => {
        setCurrentPage(prev => prev + 1)
    }

    let prevButton = () => {
        setCurrentPage(prev => prev - 1)
    }

    function currentPageNumber(i) {
        setCurrentPage(i)
    }

    return (
        <>
            <div className='sticky top-0 z-999 bg-white'> <UserNav /> </div>

            <div className='lg:mx-20 mt-6 lg:mt-1 px-2 lg:px-0'>
                <div className='sticky top-19 w-full h-fit py-4 px-2 lg:px-0 pb-8 lg:pb-7 bg-white z-9'>
                    <input
                        value={findAllFoodByText}
                        onChange={(e) => dispatch(setFindAllFoodByText(e.target.value))}
                        className='w-full lg:w-[30%] border border-gray-300 px-3 py-2 rounded-md focus:border-none focus:outline-none focus:ring focus:ring-orange-500 text-gray-600'
                        placeholder='Search for food item' type="text" />
                </div>

                <div className='text-4xl font-bold ml-2.5 lg:ml-0'>
                    All Food Items
                </div>

                <div className='gap-10 w-full h-fit mt-7 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-7'>
                    {filteredUserAllFoods.length > 0 ? filteredUserAllFoods?.slice(start, end).map((item) => {
                        let isInCart = cartData.some(i => i.foodDetails?._id === item._id || i.foodDetails === item._id)

                        return (
                            <div key={item._id} className='mr-2 lg:mr-0 ml-2 lg:ml-0 border border-gray-200 rounded-md shadow-sm hover:shadow-md duration-300'>
                                <div className='relative'>
                                    <img
                                        src={item.image}
                                        alt={item.foodname}
                                        className="w-full h-40 object-cover rounded-t-md "
                                    />

                                    <div className='flex justify-between'>
                                        <div className='mt-1 ml-2'>
                                            <button onClick={() => addFoodToCart(item._id)}
                                                className={`flex items-center justify-center gap-2 px-3 py-1 rounded-lg  border transition-all duration-200 cursor-pointer ${isInCart ? "bg-gray-200 text-gray-600 border-gray-300 cursor-not-allowed"
                                                    : "bg-white text-gray-800 border-gray-300 cursor-pointer"}`}>
                                                <MdOutlineShoppingCart className='mt-1' />
                                                {isInCart ? <span className='text-sm font-medium text-gray-500 cursor-pointer'>Added</span> :
                                                    <span className='text-sm font-medium text-gray-800 cursor-pointer'> Add to Cart</span>}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col p-3 border-t-2 border-[#ff4d2d] mt-1'>
                                    <div className=' flex justify-between  mt-1 text-[17px] font-semibold text-[#ff4d2d]'>{item?.foodname || "null"}</div>
                                    <div className=' flex justify-between  mt-1 text-[14px] font-semibold text-[#6538f7]'>{item?.shopDetails?.shopname || "null"} </div>
                                    <div className='mt-3 text-[14px] text-slate-400 font-normal'> {item.description} </div>

                                    <div className='mt-1 mr-0.5 ml-0.5 flex justify-between text-sm text-gray-600'> <span>{item?.category || "null"}</span> <span>{item?.foodtype || "null"}</span></div>
                                    <div className='mt-2 text-lg flex justify-between'>
                                        <span className='font-bold text-green-600'> ₹ {item?.price || "null"}</span>
                                        <span className='text-[12px]'>{item?.isAvailable === "yes" ? <div className='px-3 py-0.5 mt-1 rounded-xl felx items-center justify-center text-green-700 bg-green-100'>available</div>
                                            : <div className='px-3 py-0.5 mt-1 rounded-xl felx items-center justify-center text-red-700 bg-red-100'>Out of Stock</div>}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : <div>No foods Available yet</div>}
                </div>
            </div>

            {/* Pagination */}
            {/* totalpage > 1 && */}
            {totalpage > 1 && userAllFoodData.length > 0 && filteredUserAllFoods.length > 0 &&
                <div hidden={!currentPage === 0} className="w-full bg-white sticky bottom-0 mt-5 py-2 pb-2 flex items-center justify-center border-t">
                    <button disabled={currentPage === 0} onClick={() => prevButton()} className="mr-2 w-fit p-2 rounded-full border bg-gray-100 hover:bg-gray-200 cursor-pointer duration-200 disabled:opacity-40 disabled:cursor-not-allowed"><FaAngleLeft size={22} /></button>

                    <div className="flex items-center justify-center">
                        {[...Array(totalpage)].map((_, i) => (
                            <div onClick={() => currentPageNumber(i)} className={i === currentPage ? "border mr-1  rounded-full flex items-center justify-center w-10 h-10 text-sm font-medium cursor-pointer text-gray-700 bg-[#f95437]"
                                : "border mr-2 rounded-full flex items-center justify-center w-10 h-10 text-sm font-medium cursor-pointer text-gray-700 bg-[#eee]"}>
                                <button onClick={() => currentPageNumber(i)} className="cursor-pointer">{i}</button>
                            </div>
                        ))}
                    </div>

                    <button disabled={currentPage === totalpage - 1} onClick={() => nextButton()} className="w-fit p-2 rounded-full border bg-gray-100 hover:bg-gray-200 cursor-pointer duration-200 disabled:opacity-40 disabled:cursor-not-allowed"><FaAngleRight size={22} /></button>
                </div>}
        </>
    )
}

export default AllFoods