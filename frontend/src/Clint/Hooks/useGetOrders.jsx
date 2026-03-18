import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { order_endpoint } from '../Utils/utils'
import { setOrderData, setOrderLoading } from '../Redux/orderSlice'

const useGetOrders = () => {
  let dispatch = useDispatch()
  let { shopData } = useSelector(state => state.admin)
  let {userData} = useSelector(state => state.user)

  useEffect(() => {

    if (userData?.user?.role !== "admin") return;
    if (!shopData) return;

    let getAllOrders = async () => {
      try {
        dispatch(setOrderLoading(true))

        let res = await axios.get(`${order_endpoint}/get`, { withCredentials: true })

        if (res.data.success) {
          dispatch(setOrderData(res.data.allOrders))
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setOrderLoading(false))
      }
    }

    getAllOrders()

    // Optional polling
    // const polling = setInterval(getAllOrders, 30000)
    // return () => clearInterval(polling)

  }, [shopData, dispatch])
}

export default useGetOrders
