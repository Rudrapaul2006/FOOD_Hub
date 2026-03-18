import React from 'react'
import UserNav from '../Component/UserNav'
import { useSelector } from 'react-redux'
import UserDashBoardPic from '../User Component/UserDashBoardPic';
import UserDashBoardFooter from '../User Component/UserDashBoardFooter';
import { useNavigate } from 'react-router-dom';
import useGetAllCartItems from '../User Hooks/useGetAllCartItems';

const UserHomePage = () => {
    let navigate = useNavigate()
    let { userShopData } = useSelector(state => state.admin)
    
    return (
        <>
            <div className='sticky top-0 z-999 bg-white'> <UserNav /> </div>
            <div className='lg:mx-5 rounded-md overflow-hidden mt-1 lg:mt-3'><UserDashBoardPic /></div>

            <div className='lg:mx-20 flex flex-col'>
                <span className='mt-12 text-3xl font-semibold ml-2 lg:ml-0'>Top Resturent Near You</span>

                <div className='gap-5 w-full mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-5 '>

                    {userShopData.length > 0 && userShopData.map(item => (
                        <div key={item._id}
                            onClick={() =>navigate(`/shopfooditems/${item._id}`) } 
                            className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer  ml-2 mr-2 lg:ml-0 lg-mr-0"
                        >
                            <div className="h-40 w-full overflow-hidden">
                                <img src={item.image} alt="null" className="h-full w-full object-cover hover:scale-102 transition-transform duration-300" />
                            </div>

                            
                            <div className="p-3 border-t-2 border-[#ff4d2d] mt-1">
                                <h3 className="text-lg font-semibold text-[#ff4d2d] truncate "> {item.shopname} </h3>
                                <h3 className="text-[12px] font-semibold text-blue-600 truncate">  {item.description} </h3>
                                <div className="flex items-center justify-between mt-3"> <span className="text-xs text-gray-500"> {item.phone} </span> </div>
                                <div> <span className="text-xs text-gray-500"> {item.email} </span> </div>
                                <div> <span className="text-xs text-gray-500"> {item.city} </span> <span className="text-xs text-gray-500 ml-1"> , {item.location} </span> </div>
                                <div> <span className="text-xs text-gray-500"> {item.state} </span> </div>
                                <div className="flex items-center gap-5 lg:gap-7 mt-3">
                                    <span className="text-xs text-gray-500">LON : {item.shopGeoLocation.coordinates[0]} </span> 
                                    <span className="text-xs text-gray-500">LAT : {item.shopGeoLocation.coordinates[1]} </span> 
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            <UserDashBoardFooter/>
        </>
    )
}

export default UserHomePage