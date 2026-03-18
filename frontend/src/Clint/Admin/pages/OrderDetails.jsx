import React, { useState } from 'react'
import AdminNav from '../AdminNav'
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { order_endpoint } from '@/Clint/Utils/utils';
import { deleteOrderItem, updateorder } from '@/Clint/Redux/orderSlice';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

const OrderDetails = () => {

  let navigate = useNavigate()
  let dispatch = useDispatch()
  let params = useParams()
  let groupId = params.id

  let { shopData } = useSelector(state => state.admin)

  let [orderDetails, setOrderDetails] = useState([])

  //Fetch Order details :
  let fetchOrderDetails = async () => {
    try {
      let res = await axios.get(`${order_endpoint}/getOrderbyid/${groupId}`, { withCredentials: true });
      if (res.data.success) {
        setOrderDetails(res.data.order)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (groupId) {
      fetchOrderDetails()
    }
  }, [groupId])

  //Order status update :
  let updateOrderStatus = async (newStatus) => {
    try {
      let res = await axios.put(`${order_endpoint}/updatestatus/${groupId}`, { orderStatus: newStatus }, { withCredentials: true })
      if (res.data.success) {
        dispatch(updateorder(res.data.orders))
        setOrderDetails(res.data.orders)
        await fetchOrderDetails()
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to update order status")
    }
  }

  return (
    <>
      <AdminNav />

      <div className='mt-8 lg:mx-30 lg:h-fit border rounded-lg flex flex-col md:flex lg:flex-row justify-between gap-10 lg:gap-0 mb-5'>

        {/* Left Side */}
        <div className='mt-6 px-8 flex flex-col border-r lg:w-[25%]'>
          <button
            className=" w-fit p-1.5 rounded-xl border bg-gray-100 mb-3 hover:bg-gray-200 cursor-pointer duration-200 "
            onClick={() => navigate(-1)}
          >
            <IoIosArrowBack size={22} />
          </button>

          <div className='text-3xl mt-3 text-gray-600 font-semibold pb-5'>
            Customer details
          </div>

          {orderDetails?.map((item, idx) => (
            <div key={idx} className='mt-3'>
              <div className='flex flex-col'>
                <div className='text-gray-800 font-semibold text-[16px] '>Name </div>
                <span className='mb-3 font-normal text-sm text-gray-600'>
                  {item?.items?.[0]?.orderedBy?.fullname || "null"}
                </span>

                <div className='text-gray-800 font-semibold text-[16px] '>Email Address </div>
                <span className='mb-3 font-normal text-sm text-gray-600'>
                  {item?.items?.[0]?.orderedBy?.email || "null"}
                </span>

                <div className='text-gray-800 font-semibold text-[16px] '>Phone Number </div>
                <span className='mb-3 font-normal text-sm text-gray-600'>
                  {item?.items?.[0]?.orderedBy?.phone || "null"}
                </span>

                <div className='text-gray-800 font-semibold text-[16px] '>Role </div>
                <span className='mb-3 font-normal text-sm text-gray-600'>
                  {item?.items?.[0]?.orderedBy?.role || "null"}
                </span>

                <div className='text-gray-800 font-semibold text-[16px] '>Address </div>
                <span className='mb-3 font-normal text-sm text-gray-600'>
                  {item?.items?.[0]?.orderedBy?.address || "null"}
                </span>

                <div className='text-gray-800 font-semibold text-[16px] '>Pincode</div>
                <span className='mb-3 font-normal text-sm text-gray-600'>
                  {item?.items?.[0]?.orderedBy?.pincode || "null"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className='lg:w-[73.5%] flex flex-col px-9 lg:px-2 border-t lg:border-none py-5'>

          {/* Right side */}
          <span className=" flex items-center justify-between mb-6.5"> <div className=' text-4xl font-bold text-[#ff4d2d] '>{shopData?.[0]?.shopname}</div> </span>
          <div className='text-3xl text-gray-600 font-semibold pb-7'>  Food details </div>

          {orderDetails.map((item, idx) => (
            <div key={idx} className=''>

              <div className='flex flex-col pb-3 '>

                <div className='text-gray-800 font-semibold text-[18px] mb-2 lg:ml-1'>Food Item</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {item?.items?.map((i, index) => (
                    <div key={index} className="border rounded-lg px-3 py-2 bg-gray-50">
                      <p className="font-semibold">{`${i?.foodDetails?.foodname} [${i?.foodDetails?.category || "N/A"}]` || "N/A"}</p>
                      <p className={`text-sm text-gray-700 mt-2 ${i?.foodDetails?.foodtype === "Veg" ? "text-green-600" : "text-red-600"}`}>
                        <span className="mr-1 text-gray-800">Foodtype :</span> {i?.foodDetails?.foodtype || "N/A"}
                      </p>
                      <p className="text-sm text-gray-700 mt-0.5"> Quantity - <span className="font-medium text-blue-500">{i?.quantity || 0}</span> items </p>
                      <p className="text-sm text-gray-700 mt-0.5"> Price - ₹{i?.foodDetails?.price || 0} </p>
                    </div>
                  ))}
                </div>

                <div className='flex flex-col lg:flex-row lg:gap-20 lg:mt-7 mb-2 lg:mb-3 pl-1 lg:pl-2'>

                  <div className='flex flex-col pb-3 mt-7 lg:mt-0'>
                    <div className='text-gray-800 font-semibold text-[16px] '>Price </div>
                    <span className='mb-3 font-normal text-sm text-gray-600'>
                      {item?.items?.map((i, index) => (
                        <div key={index}>
                          {`${i?.quantity} * ₹${i?.foodDetails?.price || 0} = ₹${(i?.quantity || 0) * (i?.foodDetails?.price || 0)}`}
                        </div>
                      ))}
                    </span>
                  </div>

                  <div className='flex flex-col pb-3'>
                    <div className='text-gray-800 font-semibold text-[16px] '>Total Price </div>
                    <span className='mb-3 font-normal text-sm text-gray-600'>  ₹{item?.items?.map(i => (i?.quantity || 0) * (i?.foodDetails?.price || 0)).reduce((acc, curr) => acc + curr, 0)} </span>
                  </div>

                </div>

                <div className='flex flex-col lg:flex-row gap-3 lg:gap-8'>

                  {/* Order status update */}
                  <div className='flex justify-between gap-20 lg:gap-0 py-2 px-3 h-fit border lg:w-[55%] mb-2 lg:mb-0'>
                    <div className='flex flex-col'>
                      <div className=' text-gray-800 font-semibold text-[17px]'>Order status</div>
                      <span className='font-normal text-sm text-blue-600 mt-2'> {item?.items?.[0]?.orderStatus || "null"} </span>
                    </div>

                    <div className='flex flex-col'>
                      <span className='font-semibold ml-0 lg:ml-2.5'>Update status</span>
                      <div className="flex flex-wrap gap-2">
                        {["out for delivary"].map((s) => (
                          <button key={s}
                            onClick={() => updateOrderStatus(s)}
                            disabled={["out for delivary", "compleate"].includes(item?.items?.[0]?.orderStatus)}
                            className={`mt-2 text-xs sm:text-sm px-4 py-1 rounded-md border cursor-pointer ${item?.items?.[0]?.orderStatus === s ? "bg-[#ff4d2d] text-white border-[#ff4d2d]" : "bg-gray-100 hover:bg-gray-200"} disabled:opacity-50 disabled:cursor-not-allowed`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border w-full lg:w-[35%] h-fit p-3">
                    <div className="text-sm lg:text-md font-semibold mb-2"> Assigned delivery boy </div>

                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-3 text-sm lg:text-base">
                      <span> <span className="font-medium">Name:</span> {" "} {item?.items?.[0]?.assignment?.assignto?.fullname || "—"} </span>
                      <span> <span className="font-medium">Phone:</span> {" "} {item?.items?.[0]?.assignment?.assignto?.phone || "—"} </span>
                    </div>
                  </div>
                </div>

              </div>

              <div className='lg:mt-1 flex flex-col sm:flex-row lg:flex gap-3 sm:gap-5 sm:mr-7 pb-9 mt-2'>
                <div className='border px-5 lg:px-4 py-1 bg-gray-100 rounded-md '>
                  Available Delivary Boys - <span className='text-blue-600'> {item?.items?.[0]?.brodcastedTo?.length || 0} </span>
                </div>
              </div>

              <div className='lg:mt-1 flex flex-col sm:flex-row lg:flex gap-3 sm:gap-5 sm:mr-7'>
                <div className='border px-5 lg:px-4 py-1 bg-gray-100 rounded-md '>
                  Quantity(all) - <span className='text-blue-600'> {item?.items?.map(i => i?.quantity || 0).reduce((a, b) => a + b, 0)} </span>
                </div>
                <div className='border px-5 lg:px-4 py-1 bg-gray-100 rounded-md '>
                  Payment - <span className='text-blue-600'> {item?.items?.[0]?.assignment?.paymentStatus || "pending"}  </span>
                </div>
                <div className='border px-5 lg:px-4 py-1 bg-gray-100 rounded-md '>
                  Method - <span className='text-blue-600'> {item?.items?.[0]?.paymentMethod || "N/A"} </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </>
  )
}

export default OrderDetails