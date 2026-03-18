import { createSlice } from "@reduxjs/toolkit";

let userSlice = createSlice({
    name: "user",
    initialState: {
        userData: [],
        loading: true,
        city: null
    },
    
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
        },
        updateUserProfile: (state, action) => {
            state.userData = action.payload
        },
        updateAddress: (state, action) => {
            if (action.payload.address) {
                state.userData.user.address = action.payload.address;
            }
            if (action.payload.pincode) {
                state.userData.user.pincode = action.payload.pincode;
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setCity: (state, action) => {
            state.city = action.payload
        }
    }
})

export let { setUserData, setLoading, updateUserProfile, updateAddress, setCity } = userSlice.actions;
export default userSlice.reducer;