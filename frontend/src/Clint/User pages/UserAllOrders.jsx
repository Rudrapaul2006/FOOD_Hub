import React, { useState } from 'react'
import getAllUserOrder from '../User Hooks/getAllUserOrder'
import { useSelector } from 'react-redux';
import UserNav from '../Component/UserNav';
import { HiDotsHorizontal } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

const UserAllOrders = () => {
    getAllUserOrder()

    let navigate = useNavigate()
    let { userOrderData } = useSelector(state => state.order)

    let filteredOrder = userOrderData?.filter(i => i?.items?.map(j => j?.orderStatus)[0] === "pending" || i?.items?.map(j => j?.orderStatus)[0] === "out for delivary") || []


    //pagintion :
    let [currentPage, setCurrentPage] = useState(0)
    let pageSize = 10;
    let totalOrders = filteredOrder.length;
    let totalPage = Math.ceil(totalOrders / pageSize)

    let start = currentPage * pageSize
    let end = start + pageSize

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

            <div className='lg:mx-20 sticky top-18 lg:top-18 mt-3 lg:mt-3 flex justify-between z-100 bg-white items-center mb-3 lg:mb-0 px-0 py-5 lg:px-0 lg:py-5'>
                <div className='text-2xl font-bold'><span className='ml-2 lg:ml-0'> Your Orders :</span></div>

                <div
                    onClick={() => navigate("/previoususerorder")}
                    className="relative mr-3 lg:mr-0 overflow-hidden rounded-md border border-red-300 px-4 py-1 text-lg font-normal text-red-500 cursor-pointer transition-all duration-500 hover:bg-red-500 hover:text-white active:scale-93"
                >
                    <span className="relative z-10">Previous Orders</span>
                </div>
            </div>

            <div className='lg:mx-20 mt-6 lg:mt-9 mb-5 lg:mb-0 pb-7'>
                <div className="ml-3 lg:ml-0 mr-3 lg:mr-0 overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2 text-left">Date</th>
                                <th className="border px-4 py-2 text-left">Customer</th>
                                {/* <th className="border px-4 py-2 text-left">Address</th> */}
                                <th className="border px-2 py-2 text-left">Food Item</th>
                                <th className="border px-2 py-2 text-left">Quantity</th>
                                <th className="border px-2 py-2 text-left ">Total Price</th>
                                <th className="border px-1 py-2 text-left">Pay MOD</th>
                                <th className="border px-1 py-2 text-left">Pay status</th>
                                <th className="border px-1 py-2 text-left">Order Status</th>
                                <th className="border px-2 py-2 text-left">View Details</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredOrder.length > 0 ?
                                filteredOrder?.slice(start, end).map((order, index) => {

                                    return (
                                        <tr key={index}>
                                            <td className="border px-4 py-2"> {new Date(order.items[0]?.updatedAt || order.createdAt || "Null").toLocaleDateString()} </td>

                                            <td className="border px-4 py-2"> {order.items[0]?.orderedBy.fullname || "Null"} </td>
                                            {/* <td className="border px-4 py-2"> {order.items[0]?.orderedBy.address} </td> */}

                                            <td className="border px-4 py-2">
                                                {order.items?.map((item, i) => (
                                                    <div key={i}>
                                                        {item.foodDetails.foodname || "Null"}
                                                    </div>
                                                ))}
                                            </td>

                                            <td className="border px-1 py-2">
                                                {order.items?.map((item, i) => (
                                                    <div key={i}>
                                                        qty : {item.quantity || "Null"} x {item.foodDetails.price || "Null"} =  {item.quantity * item.foodDetails.price || "Null"}
                                                    </div>
                                                ))}
                                            </td>

                                            <td className="border px-5 py-2">
                                                <div className="flex gap-1 font-medium text-gray-700">
                                                    <span className="font-semibold">₹</span>
                                                    <span> {order.items?.reduce((total, item) => total + (item.foodDetails.price * item.quantity), 0) || "Null"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="border px-2 py-2 "> {order.items[0]?.paymentMethod || "Null"} </td>

                                            <td className="p-2 text-center border">
                                                <span className={`flex items-center justify-center px-2 py-1 rounded-xl text-xs font-medium border ${order?.items?.map(i => i?.assignment?.paymentStatus === "paid"
                                                    ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200")}`}>
                                                    {order?.items?.map(i => i?.assignment?.paymentStatus)[0] || "pending"}
                                                </span>
                                            </td>

                                            <td className="p-2 text-center border">
                                                <span className={`flex items-center justify-center px-2 py-1 rounded-xl text-xs font-medium border ${order?.items?.[0]?.orderStatus === "compleate"
                                                    ? "bg-green-100 text-green-700 border-green-200"
                                                    : order?.items?.[0]?.orderStatus === "out for delivary"
                                                        ? "bg-blue-100 text-blue-800 border-blue-200"
                                                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                                    }`}>
                                                    {order?.items?.[0]?.orderStatus || "pending"}
                                                </span>
                                            </td>

                                            <td className="border px-2 py-2 text-center align-middle">
                                                <div className="flex justify-center items-center">
                                                    <button
                                                        onClick={() => navigate(`/userorderdetails/${order.items[0]?.orderGroupId}`)}
                                                        className="p-2 rounded-full hover:bg-red-50 active:scale-95 transition-all duration-200 cursor-pointer"
                                                    >
                                                        <HiDotsHorizontal size={20} className="text-gray-600" />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    )
                                }) : <tr><td colSpan="10" className="text-center py-4 border">No orders found</td></tr>}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPage > 1 && userOrderData.length > 0 && filteredOrder.length > 0 &&
                <div hidden={!currentPage === 0} className="w-full bg-white sticky bottom-0 mt-5 py-2 pb-2 flex items-center justify-center border-t">
                    <button disabled={currentPage === 0} onClick={() => prevButton()} className="mr-2 w-fit p-2 rounded-full border bg-gray-100 hover:bg-gray-200 cursor-pointer duration-200 disabled:opacity-40 disabled:cursor-not-allowed"><FaAngleLeft size={22} /></button>

                    <div className="flex items-center justify-center">
                        {[...Array(totalPage)].map((_, i) => (
                            <div onClick={() => currentPageNumber(i)} className={i === currentPage ? "border mr-1  rounded-full flex items-center justify-center w-10 h-10 text-sm font-medium cursor-pointer text-gray-700 bg-[#f95437]"
                                : "border mr-2 rounded-full flex items-center justify-center w-10 h-10 text-sm font-medium cursor-pointer text-gray-700 bg-[#eee]"}>
                                <button onClick={() => currentPageNumber(i)} className="cursor-pointer">{i}</button>
                            </div>
                        ))}
                    </div>

                    <button disabled={currentPage === totalPage - 1} onClick={() => nextButton()} className="w-fit p-2 rounded-full border bg-gray-100 hover:bg-gray-200 cursor-pointer duration-200 disabled:opacity-40 disabled:cursor-not-allowed"><FaAngleRight size={22} /></button>
                </div>}
        </>
    )
}

export default UserAllOrders
