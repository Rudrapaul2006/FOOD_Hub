import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaBagShopping, FaClipboardList, FaMoneyCheckDollar, FaMountainCity, FaPhone } from "react-icons/fa6";
import { MdEditLocationAlt, MdOutlineMail } from "react-icons/md";
import { TbBuildingEstate } from "react-icons/tb";
import ResturentImageComp from "./Component/ResturentImageComp";

const ShopUi = () => {
    let { shopData } = useSelector(state => state.admin)
    let { orderData } = useSelector(state => state.order)
    let { foodData } = useSelector(state => state.food)

    let price = orderData?.map(i => i?.items?.map(j => (j?.foodDetails?.price * j?.quantity) || 0)).flat() || []
    let totalPrice = price.map(i => i).reduce((a, b) => a + b, 0)

    let navigate = useNavigate()

    return (
        <>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-semibold ml-4 lg:ml-0">Welcome Back</h1>
                    <p className="text-sm lg:text-md text-gray-500 mt-2 ml-4 lg:ml-0">
                        Here are your latest stats and updates 
                    </p>
                </div>
                <span className={`mt-4 lg:mt-0 ml-4 lg:ml-0 w-fit px-5 py-2 rounded-md font-semibold ${shopData?.[0]?.open === "yes" ? "bg-green-300 text-green-700" : "bg-red-300 text-red-700"}`}>
                    {shopData?.[0]?.open === "yes" ? "Open" : "Closed"}
                </span>
            </div>

            <div className="px-4 lg:px-0">
                <div className="mt-9 w-full flex flex-col lg:flex-row justify-between border rounded-md shadow-sm">
                <div className="flex gap-2 p-4">
                    <div className="p-3 bg-[#facfc8] rounded-full ">
                        <FaClipboardList className="text-orange-500" size={28} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[18px] font-medium">{foodData.length}</span>
                        <span className="text-gray-500 text-[12px]">Total Items</span>
                    </div>
                </div>
                <div className="flex gap-2 p-4">
                    <div className="p-3 bg-[#facfc8] rounded-full ">
                        <FaBagShopping className="text-orange-500" size={28} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[18px] font-medium">{orderData.length}</span>
                        <span className="text-gray-500 text-[12px]">Total Orders</span>
                    </div>
                </div>

                <div className="flex gap-2 p-4">
                    <div className="p-3 bg-[#facfc8] rounded-full ">
                        <FaMoneyCheckDollar className="text-orange-500" size={28} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[18px] font-medium">{totalPrice}</span>
                        <span className="text-gray-500 text-[12px]">Total Revenue</span>
                    </div>
                </div>
            </div>
            </div>

            {shopData.map((shopd) => (
                <div key={shopd._id} className="ml-4 lg:ml-0 mr-4 lg:mr-0 pb-4 lg:pb-0 flex flex-col lg:flex-row gap-6 mt-7 lg:mt-10">
                    <div className="w-full lg:w-1/2">
                        <ResturentImageComp />
                    </div>

                    <div className="w-full lg:w-1/2 px-4 py-4 flex flex-col border rounded-md">
                        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-700">
                            {shopd.shopname}
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">{shopd.description}</p>

                        <div className="mt-6 flex flex-col gap-3 text-sm">
                            <div className="flex items-start">
                                <MdEditLocationAlt className="text-[#ef6249] mt-0.5" size={18} />
                                <span className="ml-2 font-semibold text-black/70">Location :</span>
                                <span className="ml-2 text-gray-500">{shopd.location}</span>
                            </div>

                            <div className="flex items-start break-all">
                                <MdOutlineMail className="text-[#ef6249] mt-0.5" size={18} />
                                <span className="ml-2 font-semibold text-black/70">Email :</span>
                                <span className="ml-2 text-gray-500">{shopd.email}</span>
                            </div>

                            <div className="flex items-start">
                                <FaPhone className="text-[#ef6249] mt-0.5" size={18} />
                                <span className="ml-2 font-semibold text-black/70">Phone :</span>
                                <span className="ml-2 text-gray-500">{shopd.phone}</span>
                            </div>

                            <div className="flex items-start">
                                <FaMountainCity className="text-[#ef6249] mt-0.5" size={18} />
                                <span className="ml-2 font-semibold text-black/70">City :</span>
                                <span className="ml-2 text-gray-500">{shopd.city}</span>
                            </div>

                            <div className="flex items-start">
                                <TbBuildingEstate className="text-[#ef6249] mt-0.5" size={18} />
                                <span className="ml-2 font-semibold text-black/70">State :</span>
                                <span className="ml-2 text-gray-500">{shopd.state}</span>
                            </div>

                            <button
                                onClick={() => navigate(`/editdetails/${shopd._id}`)}
                                className="mt-4 w-full sm:w-auto px-6 py-3 text-white font-semibold rounded-md bg-[#ff5a3c] shadow-md transition-all duration-200 hover:shadow-lg hover:scale-101 active:scale-99 cursor-pointer"
                            >
                                Update Restaurant Details
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default ShopUi;
