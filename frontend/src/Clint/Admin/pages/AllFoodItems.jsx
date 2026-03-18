// AllFoodItems.jsx (Parent)
import AdminNav from "../AdminNav";
import FoodItemCard from "../Component/FoodItemCard";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { setSearchFoodByText } from "@/Clint/Redux/foodSlice";
import useGetOrders from "@/Clint/Hooks/useGetOrders";

const AllFoodItems = () => {
  // useGetFoodData() // overWrite the redux toolkit's unshift method - 
  useGetOrders()

  let navigate = useNavigate()
  let dispatch = useDispatch()
  let { shopData } = useSelector((state) => state.admin)
  let { searchFoodByText } = useSelector(state => state.food)

  return (
    <>
      <AdminNav />

      <div className="sticky top-21 lg:top-17 bg-white flex w-full pt-5 pb-3 gap-5 justify-between px-2 sm:px-4 lg:px-0 z-20">
        <div className="lg:mx-20 flex items-center border pl-3 gap-2 bg-white border-gray-300 h-11 rounded-md overflow-hidden w-full max-w-md">

          <input
            type="text"
            value={searchFoodByText}
            onChange={(e) => dispatch(setSearchFoodByText(e.target.value))}
            placeholder="Search for food item's"
            className="w-full mr-3 h-full outline-none text-gray-500 text-sm bg-transparent"
          />

        </div>

        <button
          onClick={() => navigate("/addfoodItems")}
          className="lg:mx-20 mr-2 h-11 w-60 lg:w-fit px-5 py-2.5 rounded-lg bg-[#ff4d2d] text-white font-medium cursor-pointer  focus:scale-97 hover:scale-101 duration-200"
        >
          Add FoodItem
        </button>
      </div>

      <div className="mt-5 lg:mx-20">
        <div className="mb-7 ml-2 lg:ml-0">
          <h1 className="text-[30px] font-bold text-gray-800">
            <span className="text-[#ff4d2d]">
              {shopData?.[0]?.shopname ? <div>{shopData?.[0]?.shopname}'s <span className="text-black">food items</span> </div> : <div className="text-[#ff4d2d] ">Shop <span className="text-black">[null]</span></div>}
            </span>

          </h1>
        </div>

        <div className="mr-0">
          <FoodItemCard />
        </div>
      </div>
    </>
  )
}

export default AllFoodItems;
