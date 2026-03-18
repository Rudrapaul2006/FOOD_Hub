import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { food_endpoint } from "@/Clint/Utils/utils";
import { setFoodData, setFoodLoading } from "../Redux/foodSlice";

let useGetFoodData = () => {
  let dispatch = useDispatch()
  let {userData} = useSelector(state => state.user)

  useEffect(() => {
    if (userData?.user?.role !== "admin") return;
    let fetchFoods = async () => {
      try {
        dispatch(setFoodLoading(true));

        let res = await axios.get(`${food_endpoint}/get`, { withCredentials: true })

        dispatch(setFoodData(res.data.foods || []));
      } catch (error) {
        console.log("Food fetch error:", error);
        dispatch(setFoodData([]));
      } finally {
        dispatch(setFoodLoading(false));
      }
    }
    fetchFoods();

    //Polling [Acceable from any brouser]
    // let polling = setInterval(fetchFoods, 3000);
    // return () => { clearInterval(polling)}

  }, [dispatch])
}

export default useGetFoodData;
