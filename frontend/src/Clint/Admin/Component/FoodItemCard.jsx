import { food_endpoint } from "@/Clint/Utils/utils";
import axios from "axios";
import { FaAngleLeft, FaAngleRight, FaPenToSquare } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deleteFood } from "@/Clint/Redux/foodSlice";
import { useEffect, useState } from "react";

const FoodItemCard = () => {
  let navigate = useNavigate()
  let dispatch = useDispatch()

  //Search logic :
  let { foodData, searchFoodByText } = useSelector((state) => state.food)
  let filteredFood = foodData.filter(food =>
    food.foodname.toLowerCase().includes(searchFoodByText) ||
    food.category.toLowerCase().includes(searchFoodByText.toLowerCase()) ||
    food.foodtype.toLowerCase().includes(searchFoodByText) ||
    food.price <= Number(searchFoodByText)
  )

  //Delete Food item : [state manage by redux toolkit]
  let deleteFoodItem = async (foodId) => {
    let isConfirm = window.confirm("Are you sure you delete this item ?");
    if (!isConfirm) return;

    try {
      let res = await axios.delete(`${food_endpoint}/delete/${foodId}`, { withCredentials: true })

      if (res.data.success) {
        dispatch(deleteFood(foodId))
        toast.success("Food deleted")
      }
    } catch (error) {
      toast.error("Delete failed");
      console.log(error)
    }
  }

  //Pagination :
  let [currentPage, setCurrentPage] = useState(0)

  let pageSize = 20;
  let totalFoods = foodData.length;
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

  //if i delete food item in any page if there also food available then dont setCurrent page 0 , otherwise setCurrentpage 0 -
  useEffect(() => {
    if (currentPage >= totalpage) {
      setCurrentPage(0)
    }
  }, [foodData.length])


  return (
    <>
      <div className="w-[97%] pb-8 lg:w-full gap-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredFood.length > 0 ? filteredFood.slice(start, end).map((item) => (
          <div key={item._id}>
            <div className="flex flex-col h-full ml-2 rounded-lg border bg-white shadow-md hover:shadow-xl duration-300">
              <img
                src={item.image}
                alt={item.foodname}
                className="w-full h-40 object-cover rounded-t-md"
              />

              <div className="mt-2 mb-2 flex justify-between px-4">
                <span
                  onClick={() => navigate(`/updatefoodItem/${item._id}`)}
                  className="p-2 rounded-full bg-gray-300 cursor-pointer hover:text-red-600"
                >
                  <FaPenToSquare />
                </span>

                <span
                  onClick={() => deleteFoodItem(item._id)}
                  className="p-2 rounded-full bg-gray-300 cursor-pointer hover:text-red-600"
                >
                  <MdDelete size={18} />
                </span>
              </div>

              <div className="p-3 border-t-2 border-[#ff4d2d]">
                <h2 className="text-md text-[#ff4d2d] font-semibold truncate">
                  {item.foodname}
                </h2>

                <p className="text-sm text-gray-400">
                  {item.description}
                </p>

                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>{item.category}</span>
                  <span>{item.foodtype}</span>
                </div>

                <div className="flex justify-between mt-2">
                  <span className="font-bold text-green-600">
                    ₹{item.price}
                  </span>

                  <span className={`text-xs px-2 py-1 rounded-full ${item.isAvailable === "yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {item.isAvailable === "yes" ? "Available" : "Out of stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )) : <div className="text-gray-400">No foods available yet</div>}
      </div>

      {/* Pagination */}
      {/* totalpage > 1 && */}
      {totalpage > 1 && foodData.length > 0 && filteredFood.length > 0 &&
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

export default FoodItemCard;