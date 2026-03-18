import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { user_endpoint } from '../Utils/utils';

const UseUpdateCurrentPosition = () => {
    let { userData } = useSelector(state => state.user);

    useEffect(() => {
        if (userData?.user?.role !== "admin") return;
        
        let updateLocation = async (lon , lat) => {
            try {
                let res = await axios.put(`${user_endpoint}/updatelocation`, { lon , lat }, { withCredentials: true });
                // console.log(res.data)
            } catch (error) {
                console.log(error)
            }
        }

        navigator.geolocation.watchPosition((pos) => {
            updateLocation( pos.coords.longitude , pos.coords.latitude)
        })

        // let watchId = navigator.geolocation.watchPosition(
        //     (pos) => {
        //         updateLocation(pos.coords.latitude, pos.coords.longitude);
        //     },
        //     (err) => console.log(err),
        //     { enableHighAccuracy: true }
        // )
        // return () => navigator.geolocation.clearWatch(watchId);

    }, [userData])
}

export default UseUpdateCurrentPosition
