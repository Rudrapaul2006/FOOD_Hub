import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './Clint/Auth/SignUp';
import Home from './Clint/Pages/Home';
import SignIn from './Clint/Auth/SignIn';
import ForgotPassword from './Clint/Pages/ForgotPassword';
import useGetCurrentUser from './Clint/Hooks/useGetCurrentUser';
import { useSelector } from 'react-redux';
import useGetCity from './Clint/Hooks/useGetCity';
import UserProfile from './Clint/Component/UserProfile';
import AllFoodItems from './Clint/Admin/pages/AllFoodItems';
import UserOrders from './Clint/Admin/pages/UserOrders';
import Shop from './Clint/Admin/pages/shop';
import ShopRegister from './Clint/Admin/pages/ShopRegister';
import useGetShop from './Clint/Hooks/useGetShop';
import EditShopDetails from './Clint/Admin/pages/EditShopDetails';
import AddFoodItem from './Clint/Admin/pages/AddFoodItem';
import UpdateFoodItem from './Clint/Admin/pages/UpdateFoodItem';
import useGetFoodData from './Clint/Hooks/useGetFoodItem';
import useGetOrders from './Clint/Hooks/useGetOrders';
import OrderDetails from './Clint/Admin/pages/OrderDetails';
import PreviousOrder from './Clint/Admin/pages/PreviousOrder';
import PreviousOrderDetails from './Clint/Admin/pages/PreviousOrderDetails';
import UseUpdateCurrentPosition from './Clint/Hooks/UseUpdateCurrentPosition';
import useGetShopCoordinates from './Clint/Hooks/useGetShopCoordinates';
import DelivaryBoyHomePage from './Clint/Delivary boy/Pages/DelivaryBoyHomePage';
import useGetDelivaryData from './Clint/Hooks/useGetDelivaryData';
import OrderDetailsForDelivaryBoy from './Clint/Delivary boy/Components/orderDetailsForDelivaryBoy';
import ShopFoods from './Clint/User pages/ShopFoods';
import UserCart from './Clint/User pages/UserCart';
import AllFoods from './Clint/User pages/AllFoods';
import CheakOut from './Clint/User pages/CheakOut';
import UserAllOrders from './Clint/User pages/UserAllOrders';
import UserOrderDetails from './Clint/User pages/UserOrderDetails';
import UpdateProfile from './Clint/User pages/UpdateProfile';
import OrderAllCartItem from './Clint/User pages/OrderAllCartItem';
import PreviousUserOrder from './Clint/User pages/PreviousUserOrder';

const App = () => {
  //All children and parent components can use or access this data :
  UseUpdateCurrentPosition()
  useGetShopCoordinates();
  useGetCurrentUser() // [for get the current user] from hook
  useGetCity() // [for get current city] from hook
  useGetShop() //[Get log in admin's shop] from hook
  useGetFoodData() // [Get all food Form resturent] from hook
  useGetOrders() // [Get all order from user] from hook 
  useGetDelivaryData()


  //User Side :
  // getUserAllShops();


  let { userData, loading } = useSelector((state) => state.user);
  if (loading) return null;

  return (
    <>
      <Routes>

        <Route path="/" element={userData ? (userData.user?.role === "admin" ? <Navigate to="/admins-shop" replace /> : userData.user?.role === "delivaryboy" ? <Navigate to="/delivaryboyhome" replace /> : <Home />)
         : <Navigate to="/signin" replace />}/>


        {/* Auth routes : */}
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
        <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={"/"} />} />
        <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />} />

        {/* Admins side route */}
        <Route path='/admins-shop' element={userData ? <Shop /> : <Navigate to={"/signin"} />} />
        <Route path='/registerShop' element={userData ? <ShopRegister /> : <Navigate to={"/signin"} />} />
        <Route path='/editdetails/:id' element={userData ? <EditShopDetails /> : <Navigate to={"/signin"} />} />

        <Route path='/fooditems' element={userData ? <AllFoodItems /> : <Navigate to={"/signin"} />} />
        <Route path='/addfoodItems' element={userData ? <AddFoodItem /> : <Navigate to={"/signin"} />} />
        <Route path='/updatefoodItem/:id' element={userData ? <UpdateFoodItem /> : <Navigate to={"/signin"} />} />

        <Route path='/allorders' element={userData ? <UserOrders /> : <Navigate to={"/signin"} />} />
        <Route path='/ordersdetail/:id' element={userData ? <OrderDetails /> : <Navigate to={"/signin"} />} />
        <Route path='/previousorders' element={userData ? <PreviousOrder /> : <Navigate to={"/signin"} />} />
        <Route path='/previousorderdetails/:id' element={userData ? <PreviousOrderDetails /> : <Navigate to={"/signin"} />} />

        {/* Delivary Boy Routes */}
        <Route path="/delivaryboyhome" element={userData ? <DelivaryBoyHomePage /> : <Navigate to="/signin" replace />} />
        <Route path='/delivaryOrderDetails/:id' element={userData ? <OrderDetailsForDelivaryBoy /> : <Navigate to={"/signin"} />} />

        {/* User Side Routes */}
        <Route path='/userprofile' element={userData ? <UserProfile /> : <Navigate to={"/signin"} />} />
        <Route path='/shopfooditems/:id' element={userData ? <ShopFoods /> : <Navigate to={"/signin"} />} />
        <Route path='/cart' element={userData ? <UserCart /> : <Navigate to={"/signin"} />} />
        <Route path='/allfoods' element={userData ? <AllFoods /> : <Navigate to={"/signin"} />} />
        <Route path='/cheakout/:id' element={userData ? <CheakOut /> : <Navigate to={"/signin"} />} />
        <Route path='/userorders' element={userData ? <UserAllOrders /> : <Navigate to={"/signin"} />} />
        <Route path='/userorderdetails/:id' element={userData ? <UserOrderDetails /> : <Navigate to={"/signin"} />} />
        <Route path='/updateprofile/:id' element={userData ? <UpdateProfile /> : <Navigate to={"/signin"} />} />
        <Route path='/orderallcartitem' element={userData ? <OrderAllCartItem /> : <Navigate to={"/signin"} />} />
        <Route path='/previoususerorder' element={userData ? <PreviousUserOrder /> : <Navigate to={"/signin"} />} />

      </Routes>
    </>
  )
}

export default App
