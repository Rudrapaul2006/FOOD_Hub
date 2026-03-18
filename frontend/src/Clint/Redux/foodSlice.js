import { createSlice } from "@reduxjs/toolkit"

let foodSlice = createSlice({
    name: "food",
    initialState: ({
        foodData: [],
        foodLoading: true,
        searchFoodByText: "",

        //User food data
        userFoodData: [],  //[each resturent's particular foods stored here]
        searchUserFoodByText: "",

        //All Food Data's for user : [foods from all shops]
        userAllFoodData: [],
        userAllFoodLoading: true,
        findAllFoodByText: "",

        //Cart System
        cartData: [],
        cartDataLoading: true
    }),

    reducers: ({
        setFoodData: (state, action) => {
            state.foodData = action.payload
        },
        setFoodLoading: (state, action) => {
            state.foodLoading = action.payload
        },
        setSearchFoodByText: (state, action) => {
            state.searchFoodByText = action.payload
        },

        addFood: (state, action) => {
            state.foodData.unshift(action.payload)
        },
        deleteFood: (state, action) => {
            state.foodData = state.foodData.filter(food => food._id !== action.payload)
        },
        updateFood: (state, action) => {
            state.foodData = state.foodData.map(food =>
                food._id === action.payload._id ? action.payload : food
            )
        },


        // User foodData : // [each resturent's particular foods stored here]
        setUserFoodData: (state, action) => {
            state.userFoodData = action.payload
        },
        setSearchUserFoodByText: (state, action) => {
            state.searchUserFoodByText = action.payload
        },


        //All user food data : [ all foods ]
        setUserAllFoodData: (state, action) => {
            state.userAllFoodData = action.payload
        },
        setUserAllFoodLoading: (state, action) => {
            state.userAllFoodLoading = action.payload
        },
        setFindAllFoodByText: (state, action) => {
            state.findAllFoodByText = action.payload
        },


        // Cart Functionality :
        setCartData: (state, action) => {  //get all added foods [added food stored here]
            state.cartData = action.payload;
        },
        setCartDataLoading: (state, action) => {
            state.cartDataLoading = action.payload;
        },
        addFoodInCart: (state, action) => {    //add to cart
            let { shopId } = action.payload
            state.cartData.push({ ...action.payload, shopId })
        },
        removeFoodFromCart: (state, action) => { // remove from cart
            state.cartData = state.cartData.filter(item => item._id !== action.payload);
        },
        removeAllFoodFromCart: (state, action) => {
            state.cartData = []
            // state.cartData.length = 0
        },
        updateQuantityInCart: (state, action) => {
            state.cartData = state.cartData.map(item =>
                item._id === action.payload._id ? { ...item, quantity: action.payload.quantity } : item
            )
        }
    })
})


export let { setFoodData, setFoodLoading, deleteFood, addFood, updateFood, setSearchFoodByText, //Admin side
    setUserFoodData, setSearchUserFoodByText, //each resturent foods / Shop foods
    setCartData, setCartDataLoading, addFoodInCart, removeFoodFromCart, removeAllFoodFromCart, updateQuantityInCart, //Cart data
    setUserAllFoodData, setUserAllFoodLoading, setFindAllFoodByText // allFoods
} = foodSlice.actions
export default foodSlice.reducer