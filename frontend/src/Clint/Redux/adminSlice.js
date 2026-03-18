import { createSlice } from "@reduxjs/toolkit";

let adminSlice = createSlice({
    name: "admin",
    initialState: {
        shopData: [],
        shopLoading: true,
        
        userShopData: [], // all shops stored here
        userShopLoading: true,

        singleShopData : [],
    },
    reducers: {
        //Admins shop data :
        setShopData: (state, action) => {
            state.shopData = action.payload
        },
        setShopLoading: (state, action) => {
            state.shopLoading = action.payload
        },
        updateShop : (state, action) => {
            state.shopData = state.shopData.map((shop) => shop._id === action.payload._id ? {...shop , ...action.payload } : shop)
        },

        //user's shop data :
        setUserShopData : (state, action) => {
            state.userShopData = action.payload
        },
        setUserShopLoading : (state, action) => {
            state.userShopLoading = action.payload
        },

        setSingleShopData : (state , action) => {
            state.singleShopData = action.payload
        }
    }
})
 
export let { setShopData, setShopLoading , updateShop , setUserShopData , setUserShopLoading , setSingleShopData } = adminSlice.actions;
export default adminSlice.reducer;