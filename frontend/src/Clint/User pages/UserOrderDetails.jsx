import React, { useEffect, useState } from 'react'
import UserNav from '../Component/UserNav'
import axios from 'axios'
import { order_endpoint } from '../Utils/utils'
import { useNavigate, useParams } from 'react-router-dom'
import { IoChevronBack } from 'react-icons/io5'

const UserOrderDetails = () => {
    let params = useParams()
    let groupId = params.id
    let navigate = useNavigate()

    let [orderData, setOrderData] = useState([])

    //Order Details by group id :
    let singleOrderData = async () => {
        try {
            let res = await axios.get(`${order_endpoint}/userorder/${groupId}`, { withCredentials: true })
            if (res.data.success) {
                setOrderData(res.data.orderDetails)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        singleOrderData()
    }, [])

    return (
        <>
            <div className='sticky top-0 z-999 bg-white'> <UserNav /> </div>
            <div className='mt-8 lg:mx-20 lg:h-fit border rounded-lg flex flex-col md:flex lg:flex-row mb-5'>

                {/* Right Side */}
                <div className='flex flex-col p-5 gap-5 lg:w-[30%] lg:border-r-2'>
                    <div className='flex gap-5'>
                        <button onClick={() => navigate(-1)}
                            className="flex items-center justify-center w-9 h-9 border border-gray-200 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                        >
                            <IoChevronBack size={20} />
                        </button>
                    </div>

                    <div className='flex flex-col lg:pb-0'>
                        <div className='text-2xl font-bold'>Shop Details</div>
                        <div className='mt-4 text-gray-800 font-semibold text-[16px] '>Shop Name</div>
                        <span className='font-normal text-sm text-gray-600'> {orderData?.[0]?.shopDetails?.shopname || "null"} </span>

                        <div className='mt-4 text-gray-800 font-semibold text-[16px] '>Phone</div>
                        <span className='mb-3 font-normal text-sm text-gray-600'> {orderData?.[0]?.shopDetails?.phone || "null"} </span>

                        <div className='text-gray-800 font-semibold text-[16px] '>Email</div>
                        <span className='mb-3 font-normal text-sm text-gray-600'>{orderData?.[0]?.shopDetails?.email || "null"}</span>

                        <div className='text-gray-800 font-semibold text-[16px] '>Location</div>
                        <span className='mb-3 font-normal text-sm text-gray-600'>{orderData?.[0]?.shopDetails?.location || "null"}</span>

                        <div className='text-gray-800 font-semibold text-[16px] '>City </div>
                        <span className='mb-3 font-normal text-sm text-gray-600'>{orderData?.[0]?.shopDetails?.city || "null"}</span>

                        <div className='text-gray-800 font-semibold text-[16px] '>State</div>
                        <span className='font-normal text-sm text-gray-600'>{orderData?.[0]?.shopDetails?.state || "null"}</span>
                    </div>
                </div>

                {/* Left Side */}
                <div className='flex flex-col border-t-2 lg:border-none p-5 lg:px-8'>

                    <div className='text-3xl font-bold text-[#ff4d2d]'>{orderData?.[0]?.shopDetails?.shopname}</div>
                    <div className='mt-5 text-2xl font-bold'>Food Details</div>

                    <div className='flex flex-col'>
                        <div className='mt-4 text-gray-800 font-semibold text-[16px] '>Item's </div>
                        <span className='mb-3 font-normal text-sm text-gray-600'>
                            {orderData?.map(item => item.foodDetails?.foodname).join(', ') || "null"}
                        </span>

                        <div className=' text-gray-800 font-semibold text-[16px] '>Price</div>
                        <span className=' font-normal text-sm text-gray-600'>

                        </span>
                        <span className='mb-3 flex flex-col lg:flex-row gap-2 font-normal text-sm text-gray-600'>
                            {orderData?.length ? orderData.map((item, index) => (
                                <span key={index}>
                                    <span className='text-gray-900 font-semibold'>{index + 1}</span>. {item.foodDetails?.foodname} : ₹{item.foodDetails?.price}
                                </span>
                            ))
                                : "null"}
                        </span>

                        <div className='text-gray-800 font-semibold text-[16px] '>Description</div>
                        <span className='mb-2 flex flex-col gap-1 font-normal text-sm text-gray-600'>
                            {orderData?.length ? orderData.map((item, index) => (
                                <span key={index}>
                                    <span className='text-gray-900 font-semibold'>{index + 1}</span>. {item.foodDetails?.description || "null"}
                                </span>
                            ))
                                : "null"}
                        </span>

                        <div className='flex flex-col lg:flex-row gap-2 lg:gap-8 mt-1'>
                            <div className='flex flex-col'>
                                <div className='text-gray-800 font-semibold text-[16px] mb-1'>Category</div>
                                <div className='flex flex-col gap-1 text-sm text-gray-600'>
                                    {orderData?.length ? [...new Set(orderData.map(i => `${i.foodDetails?.foodname} - ${i.foodDetails?.category}`))].map((cat, i) => <span key={i} className='bg-gray-100 px-2 py-1 rounded w-fit border'>{cat || "null"}</span>)
                                        : "null"}
                                </div>
                            </div>

                            <div className='flex flex-col'>
                                <div className='text-gray-800 font-semibold text-[16px] mt-1'>Food Type</div>
                                <div className='flex flex-col gap-1 text-sm text-gray-600'>
                                    {orderData?.length
                                        ? [...new Set(orderData.map(i => i.foodDetails?.foodtype))].map((type, i) => <span key={i} className='bg-gray-100 px-2 py-1 rounded w-fit border mb-2'>{type || "null"}</span>)
                                        : "null"}
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col lg:flex-col lg:mt-3'>
                            <div className='text-gray-800 font-semibold text-[16px] '>Quantity </div>
                            <span className='lg:mt-1 mb-3 font-normal text-sm text-gray-600'>
                                {orderData?.map(item => `${item.foodDetails?.foodname} qty : ${item.quantity}`).join(' , ') || "null"}
                            </span>

                            <div className='text-gray-800 font-semibold text-[16px]'>Total Price </div>
                            <span className='lg:mt-1  mb-3 font-normal text-sm text-gray-600'>
                                {orderData.map(i => `(${i?.quantity || 0} * ${i?.foodDetails?.price || 0})`).join(" + ")} =
                                <span className='ml-1 text-gray-900 font-semibold'>{orderData?.length ? orderData.reduce((sum, i) => sum + (i?.quantity ?? 0) * (i?.foodDetails?.price ?? 0), 0) : 0}</span>
                            </span>
                        </div>
                    </div>

                    <div className='mt-5 flex gap-5 '>
                        <div className='border bg-gray-100 px-3 py-1 border-blue-300 rounded-md'>
                            <span className='font-semibold'>Payment mode -</span> {orderData[0]?.paymentMethod || "null"}
                        </div>
                        <div className='border bg-gray-100 px-3 py-1 border-blue-300 rounded-md'>
                            <span className='font-semibold'>Order Status - </span>{orderData[0]?.orderStatus || "null"}
                        </div>
                        <div className='border bg-gray-100 px-3 py-1 border-blue-300 rounded-md'>
                            <span className='font-semibold'>payment Status - </span>{orderData[0]?.assignment?.paymentStatus || "pending"}
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default UserOrderDetails