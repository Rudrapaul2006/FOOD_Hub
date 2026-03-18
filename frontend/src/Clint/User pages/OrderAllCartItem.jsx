import React, { useEffect, useState } from 'react'
import UserNav from '../Component/UserNav'
import axios from 'axios'
import { order_endpoint } from '../Utils/utils'
import { useSelector } from 'react-redux'
import { IoChevronBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const OrderAllCartItem = () => {

    let { userData } = useSelector(state => state.user)
    let address = userData?.user?.address

    let [cartItem, setCartItem] = useState([])
    let quantity = cartItem.map(i => i?.quantity)
    let price = cartItem.map(i => (i?.foodDetails?.price * i?.quantity))
    let totalPrice = price.reduce((curr, penn) => curr + penn , 0)

    let navigate = useNavigate()

    // Cart Items :
    let cartItems = async () => {
        try {
            let res = await axios.get(`${order_endpoint}/allitems`, { withCredentials: true })
            if (res.data.success) {
                setCartItem(res.data.isAvalableFoodItems)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        cartItems()
    }, [userData])

    //Order All items :
    let [loading, setLoading] = useState(false)
    let [input, setInput] = useState({
        address: "",
        pincode: "",
        paymentMethod: ""
    })
    let handleInput = (e) => {
        setInput({ ...input , [e.target.name]: e.target.value })
    }

    let handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        let allOrder = async () => {
            try {
                let res = await axios.post(`${order_endpoint}/applyallorder`, {
                    quantity: quantity,
                    paymentMethod: input.paymentMethod,
                    address: input.address || userData?.user?.address,
                    pincode: input.pincode || userData?.user?.pincode,
                }, { withCredentials: true })

                if (res.data.success) {
                    toast.success(res.data.message)
                    navigate("/allfoods")
                }
            } catch (error) {
                console.log(error)
                toast.error(error.response.data.message || "Something went wrong")
            } finally {
                setLoading(false)
            }
        }
        allOrder()
    }

    return (
        <>
            <div className='w-full fixed z-99 bg-white top-0'> <UserNav /> </div>

            <div className='mt-18 lg:mt-25 lg:mx-20 flex flex-col-reverse lg:flex-row lg:gap-10 lg:h-[80vh]'>

                {/* LEFT SIDE */}
                <div className='ml-4 lg:ml-0 mr-4 lg:mr-0 mt-7 lg:w-[35%] border rounded-md mb-5 p-3 lg:p-5 lg:sticky lg:top-25 h-fit'>
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center w-9 h-9 border border-gray-200 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                        >
                            <IoChevronBack size={20} />
                        </button>
                    </div>

                    {/* Address */}
                    {!address ? <div className='w-full flex flex-col mt-5 gap-2'>
                        <div className='flex items-center text-[17px]'> <span className='mr-3 text-gray-800 font-semibold'>Address </span>
                            <input name='address' value={input.address} onChange={handleInput} placeholder='Enter your address' className='ml-1 lg:ml-0 w-full lg:w-[42.5vh] focus:outline-none px-3 py-1 border border-blue-300 focus:border-blue-400 rounded-md text-gray-700' type="text" />
                        </div>

                        <div className='flex  items-center text-[17px]'> <span className='mr-3 text-gray-800 font-semibold'>Pincode</span>
                            <input name="pincode" value={input.pincode} onChange={handleInput} className=' w-full lg:w-[15vh] focus:outline-none px-3 py-1 border border-blue-300 focus:border-blue-400 rounded-md text-gray-700' type="text" />
                        </div>
                    </div> : <div className='mt-5 flex  text-[17px]'> <span className='mr-3 text-gray-800 font-semibold'>Address </span> <span className='text-gray-600 font-normal'>: {userData.user.address || "Null"} {"," + userData.user.pincode || "Null"}</span></div>}


                    {/* Payment Method - */}
                    <div className='w-full mt-5 px-2 py-1 rounded-md border border-blue-300'>
                        <label className=''> <input className='cursor-pointer' type="radio" name="paymentMethod" onChange={handleInput} value="online" /> Online Payment </label>
                        <label className='ml-10'> <input className='cursor-pointer' type="radio" name="paymentMethod" onChange={handleInput} value="cod" /> Cash on Delivery (COD) </label>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className='mt-6 w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition cursor-pointer'
                    >
                        {loading ? "Processing..." : "Order All Items"}
                    </button>
                </div>

                {/* RIGHT SIDE */}
                <div className='w-full lg:w-[65%] mt-7 mb-5 lg:h-full lg:overflow-y-auto'>
                    <div className="w-[99%]">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ml-4 lg:ml-0 mr-4 lg:mr-0">
                            {cartItem.length > 0 && cartItem.map((item) => {
                                return (
                                    <div key={item._id} className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 border-b border-orange-600 lg:border-gray-200 last:border-b-0 hover:bg-gray-50 transition " >

                                        <div className='flex flex-col lg:flex-row gap-2 lg:gap-5'>
                                            <img className="w-40 h-40 rounded-lg object-cover"
                                                src={item.foodDetails?.image || ""}
                                                alt={item.foodDetails.foodname || "Null"} />

                                            <div className="flex flex-col lg:flex-row justify-between w-full lg:w-[65%] lg:mr-10 lg:gap-15">
                                                <div className="flex flex-col mt-1 lg:mt-0">
                                                    <span className="font-semibold text-gray-800"> {item.foodDetails?.foodname} </span>
                                                    {/* <span className="text-sm text-gray-500">  {item?.foodDetails?.description} </span> */}
                                                    <span className="text-sm text-gray-500">Item Price : <span className='text-sm text-gray-900'>{item?.foodDetails?.price}</span></span>
                                                    <span className="text-sm text-gray-500">Quantity : <span className='text-sm text-gray-900'>{item?.quantity}</span> </span>
                                                    <span className='text-sm mt-1'>Total Price for {item.quantity} item(s) = ₹{item.quantity * item.foodDetails?.price || 0}</span>
                                                    
                                                    <span className='mt-2'> {item?.foodDetails?.isAvailable === "yes" ? <div className='px-3 rounded-md flex border w-fit bg-green-100 text-sm text-green-700'> available </div> :
                                                        <div className='px-3 rounded-md flex border w-fit bg-red-100 text-sm text-red-700'>  Out of Stock </div>}
                                                    </span>
                                                </div>

                                                <div className="w-[99%] flex flex-col mt-5 lg:mt-0">
                                                    <span className="font-semibold text-gray-800"> {item.shopDetails?.shopname} </span>
                                                    <span className="text-sm text-gray-500">  {item?.shopDetails?.email} </span>
                                                    <span className="text-sm text-gray-500">{item?.shopDetails?.phone}</span>
                                                    <span className='text-sm mt-1'>{item?.shopDetails?.location} , {item?.shopDetails?.state}</span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            <div className='lg:mx-22 flex justify-between items-center h-15 lg:h-20 font-bold lg:border-none'>
                                <span className='ml-4 lg:ml-0'>Total Price <span className='ml-2'>{"₹ " + totalPrice}</span></span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderAllCartItem