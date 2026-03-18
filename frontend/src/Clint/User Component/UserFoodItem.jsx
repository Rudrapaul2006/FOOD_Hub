import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import axios from 'axios';
import { cart_endpoint } from '../Utils/utils';
import { toast } from 'sonner';
import { addFoodInCart} from '../Redux/foodSlice';
import useGetAllCartItems from '../User Hooks/useGetAllCartItems';

const UserFoodItem = () => {
    useGetAllCartItems()
    let dispatch = useDispatch()

    //Ecah resturent foods store here {userFooddata : []}
    let { userFoodData, searchUserFoodByText } = useSelector(state => state.food)

    let filteredUserFoodData = userFoodData.filter((food) => (
        food.foodname.toLowerCase().includes(searchUserFoodByText.toLowerCase()) ||
        food.category.toLowerCase().includes(searchUserFoodByText.toLowerCase()) ||
        food.foodtype.toLowerCase().includes(searchUserFoodByText.toLowerCase()) ||
        food.price <= Number(searchUserFoodByText)
    ))

    //Pagination :
    let [currentPage, setCurrentPage] = useState(0)

    let pageSize = 20;
    let totalFoods = filteredUserFoodData.length
    let totalpage = Math.ceil(totalFoods / pageSize)

    let start = currentPage * pageSize  //[20*0  => 20*1 => 20*2]
    let end = (start + pageSize)        //[20*0 + 20  => 20*1 + 20 => 20*2 +20 ]

    let nextPage = () => {
        setCurrentPage(prev => prev + 1)
    }

    let prevPage = () => {
        setCurrentPage(prev => prev - 1)
    }

    //Add to cart :
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
    
    //Cart Data :
    let { cartData } = useSelector(state => state.food)

    return (
        <>
            {/* Food card  */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 lg:gap-15 lg:h-fit ml-2 mr-2 lg:mr-0 lg:ml-0 mb-5'>
                {filteredUserFoodData.length > 0 ? filteredUserFoodData.slice(start, end).map((item) => {

                    let isInCart = cartData.some(i => i.foodDetails?._id === item._id || i.foodDetails === item._id)

                    return (<div key={item._id} className='border border-gray-200 rounded-lg flex flex-col'>
                        <div className='relative'>
                            <img
                                src={item.image}
                                alt={item.foodname}
                                className="w-full h-40 object-cover rounded-t-md "
                            />

                            <div className='flex justify-between'>
                                <div className='mt-1 ml-2'>
                                    <button onClick={() => addFoodToCart(item._id)}
                                        className={`flex items-center justify-center gap-2 px-3 py-1 rounded-lg  border transition-all duration-200  ${isInCart ? "bg-gray-200 text-gray-600 border-gray-300 cursor-not-allowed"
                                            : "bg-white text-gray-800 border-gray-300 cursor-pointer"}`}>
                                        <MdOutlineShoppingCart className='mt-1' />
                                        {isInCart ? <span className='text-sm font-medium text-gray-500 cursor-pointer'>Added</span> :
                                            <span className='text-sm font-medium text-gray-800 cursor-pointer'> Add to Cart</span>}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col p-3 border-t-2 border-[#ff4d2d] mt-1'>
                            <div className=' flex justify-between  mt-1 text-[17px] font-semibold text-[#ff4d2d]'>{item.foodname}</div>
                            <div className='mt-3 text-[14px] text-slate-400 font-normal'> {item.description} </div>

                            <div className='mt-1 mr-0.5 ml-0.5 flex justify-between text-sm text-gray-600'> <span>{item.category}</span> <span>{item.foodtype}</span></div>
                            <div className='mt-2 text-lg flex justify-between'>
                                <span className='font-bold text-green-600'> ₹{item.price} </span>
                                <span className='text-[12px]'>{item.isAvailable === "yes" ? <div className='px-3 py-0.5 mt-1 rounded-xl felx items-center justify-center text-green-700 bg-green-100'>available</div>
                                    : <div className='px-3 py-0.5 mt-1 rounded-xl felx items-center justify-center text-red-700 bg-red-100'>Out of Stock</div>}
                                </span>
                            </div>
                        </div>
                    </div>)
                }) : "No food available yet"}
            </div>

            {/* Pagination  hidden={totalpage <= 1}  */}
            {totalpage > 1 && filteredUserFoodData.length > 0 &&
                <div hidden={totalpage <= 1} className='flex justify-center items-center mt-6 mb-2 sticky bottom-2'>
                    <button disabled={currentPage === 0} onClick={() => prevPage()} className="mr-2 px-2 py-1 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><FaAngleLeft size={22} /></button>
                    {[...Array(totalpage)].map((_0, i) => (
                        <button key={i} onClick={() => setCurrentPage(i)} className={`flex items-center justify-center mx-1 px-3 py-1 rounded-lg border cursor-pointer ${currentPage === i ? "bg-[#ff4d2d] text-white border-[#ff4d2d]" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}>
                            {i + 1}
                        </button>
                    ))}
                    <button disabled={currentPage === totalpage - 1 || totalpage === 0} onClick={() => nextPage()} className="ml-2 px-2 py-1 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><FaAngleRight size={22} /></button>
                </div>}
        </>
    )
}

export default UserFoodItem