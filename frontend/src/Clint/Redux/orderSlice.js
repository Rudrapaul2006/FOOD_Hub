import { createSlice } from "@reduxjs/toolkit"

let orderSlice = createSlice({
    name : "order",
    initialState : ({
        orderData : [],
        orderLoading : true,
        searchOrderDataByText : "",

        // user side : [user order data stored here]
        userOrderData: [],
        userOrderLoading: true,
    }),
    reducers:({
        setOrderData : (state , action) => {
            state.orderData = (action.payload)
        },
        setOrderLoading : (state , action) => {
            state.orderLoading = action.payload
        },
        addOrder: (state, action) => {
            state.orderData.unshift(action.payload)
        },
        updateorder : (state , action) => {
            state.orderData = state.orderData.map((order) => order._id === action.payload.id ? {...order , ...action.payload} : order)
        },
        deleteOrderItem : (state , action) => {
            state.orderData = state.orderData.filter(item => item._id !== action.payload)
        },
        setSearchOrderDataByText : (state , action) => {
            state.searchOrderDataByText = action.payload;
        },

        // user side : [user order data ]
        setUserOrderData : (state , action) => {
            state.userOrderData = action.payload
        },
        setUserOrderLoading : (state , action) => {
            state.userOrderLoading = action.payload
        },


    })
})

export let {setOrderData , setOrderLoading , updateorder , deleteOrderItem , setSearchOrderDataByText, setUserOrderData, setUserOrderLoading} = orderSlice.actions;
export default orderSlice.reducer;