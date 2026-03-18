import React, { useEffect, useState } from 'react'
import AdminNav from '../AdminNav'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useGetFoodData from '@/Clint/Hooks/useGetFoodItem'
import useGetOrders from '@/Clint/Hooks/useGetOrders'
import { IoEllipsisHorizontalOutline } from 'react-icons/io5'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import axios from 'axios'
import { shop_endpoint } from '@/Clint/Utils/utils'
import { toast } from 'sonner'
import useGetShop from '@/Clint/Hooks/useGetShop'

const UserOrders = () => {
  useGetFoodData()
  useGetOrders()

  let navigate = useNavigate()
  let { orderData } = useSelector(state => state.order)
  let { shopData } = useSelector(state => state.admin)

  let filteredOrder = orderData?.filter(i => i?.items?.[0]?.orderStatus === "pending" || i?.items?.[0]?.orderStatus === "out for delivary") || []

  //Pagination :
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

  //Update shop status [open or not open] :
  let [btn, setBtn] = useState("")

  let updateShopStatus = async (value) => {
    try {
      let res = await axios.put(`${shop_endpoint}/shopstatus`, { open: value }, { withCredentials: true })
      if (res.data.success) {
        toast.success(res.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }

  useEffect(() => {
    if (shopData?.length > 0) {
      setBtn(shopData[0]?.open)
    }
  }, [shopData])

  return (
    <>
      <AdminNav />

      <div className='lg:mx-20 flex flex-col mt-3 lg:mt-5'>
        <div className="sticky top-20 lg:top-21 h-16 py-3 pb-3 w-full bg-white z-50 flex justify-between items-center">
          <div className='px-2 lg:px-0'>
            <button
              onClick={() => navigate("/previousorders")}
              className=' border border-[#ff4d2d] text-[#ff4d2d] px-4 py-2 rounded-md cursor-pointer active:scale-95 duration-200 hover:bg-[#ff4d2d] hover:text-white '>
              Previous Order's
            </button>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-6 px-3 lg:px-0">
              <button
                onClick={() => {
                  let newStatus = (btn === "yes" ? "no" : "yes")
                  setBtn(newStatus)
                  updateShopStatus(newStatus)
                }}
                className={`px-5 py-2.5 rounded-sm font-semibold text-sm cursor-pointer ${btn === "yes" ? "bg-green-300 text-green-700"  : "bg-red-300 text-red-700" }`}
              >
                {btn === "yes" ? "Open" : "Close"}
              </button>
          </div>
          
        </div>

        <div className='mt-5 flex flex-col w-full pb-10'>
          <div className=' ml-3 lg:ml-0 mb-5 font-semibold text-2xl lg:text-3xl text-[#ff4d2d]'>
            Order Details :
          </div>

          <div className="ml-3 lg:ml-0 mr-3 lg:mr-0 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Date</th>
                  <th className="border px-4 py-2 text-left">Customer</th>
                  <th className="border px-4 py-2 text-left">Address</th>
                  <th className="border px-7 py-2 text-left">Food Item</th>
                  <th className="border px-4 py-2 text-left">Quantity & Price</th>
                  <th className="border px-4 py-2 text-left">Pay MOD</th>
                  <th className="border px-4 py-2 text-left flex flex-col">Pay Status <span className='text-[10px]'>(From-DelivayBoy)</span></th>
                  <th className="border px-4 py-2 text-left">Order Status</th>
                  <th className="border px-4 py-2 text-left">Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrder?.length > 0 ? (
                  filteredOrder?.slice(start, end).map((group, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">

                      <td className="border px-4 py-2"> {new Date(group?.items?.[0]?.createdAt).toLocaleDateString() || "Null"} </td>

                      <td className="border px-4 py-2"> {group?.items?.[0]?.orderedBy?.fullname || "Null"} </td>

                      <td className="border px-4 py-2"> {group?.items?.[0]?.orderedBy?.address || "Null"} </td>

                      <td className="border px-7 py-2"> {group?.items?.map(i => i?.foodDetails?.foodname).join(", ") || "Null"} </td>

                      <td className="border px-4 py-2">
                        <div className="flex flex-col gap-1">
                          <span>{group?.items?.map(i => `( ${i?.quantity} * ${i?.foodDetails?.price} )` || 0).join(" + ")} </span>
                          <span>Total = <span className='font-semibold'>₹{group?.items?.map(i => (i?.foodDetails?.price || 0) * (i?.quantity || 0)).reduce((a, b) => a + b, 0)}</span> </span>
                        </div>
                      </td>

                      <td className="border px-4 py-2"> {group?.items?.[0]?.paymentMethod || "Null"} </td>

                      <td className="border px-4 py-2">
                        <span className={`px-2 py-1 rounded-xl text-xs font-medium ${group?.items?.[0]?.assignment?.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-[#9a1a1a]"}`}>
                          {group?.items?.[0]?.assignment?.paymentStatus || "pending"}
                        </span>
                      </td>

                      <td className="border px-4 py-2">
                        <span className={`px-2 py-1 rounded-xl text-xs font-medium ${group?.items?.[0]?.orderStatus === "compleate" ? "bg-green-100 text-green-700" : group?.items?.[0]?.orderStatus === "out for delivary"
                          ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-[#a11f1f]"}`}>
                          {group?.items?.[0]?.orderStatus || "pending"}
                        </span>
                      </td>

                      <td className="border px-4 py-2">
                        <IoEllipsisHorizontalOutline
                          size={28}
                          onClick={() => navigate(`/ordersdetail/${group?.items?.[0]?.orderGroupId}`)}
                          className='ml-2 lg:ml-3 hover:bg-gray-200 rounded-full p-1 duration-200 hover:cursor-pointer'
                        />
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-gray-500">
                      No order available
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPage > 1 && filteredOrder.length > 0 &&
        <div className="w-full bg-white sticky bottom-0 mt-5 py-2 pb-2 flex items-center justify-center border-t ">
          <button disabled={currentPage === 0} onClick={() => prevButton()} className="mr-2 w-fit p-2 rounded-full border bg-gray-100 hover:bg-gray-200 cursor-pointer duration-200 disabled:opacity-40 disabled:cursor-not-allowed"><FaAngleLeft size={22} /></button>
          <div className="flex items-center justify-center">
            {[...Array(totalPage)].map((_, i) => (
              <div onClick={() => currentPageNumber(i)} className={i === currentPage ? "border mr-1  rounded-full flex items-center justify-center w-10 h-10 text-sm font-medium cursor-pointer text-gray-700 bg-[#f95437]"
                : "border mr-2 rounded-full flex items-center justify-center w-10 h-10 text-sm font-medium cursor-pointer text-gray-700 bg-[#eee]"}>
                <button onClick={() => currentPageNumber(i)} className="cursor-pointer">{i}</button>
              </div>
            ))}
          </div>
          <button disabled={currentPage === totalPage - 1} onClick={() => nextButton()} className="ml-2 w-fit p-2 rounded-full border bg-gray-100 hover:bg-gray-200 cursor-pointer duration-200 disabled:opacity-40 disabled:cursor-not-allowed"><FaAngleRight size={22} /></button>
        </div>
      }
    </>
  )
}

export default UserOrders