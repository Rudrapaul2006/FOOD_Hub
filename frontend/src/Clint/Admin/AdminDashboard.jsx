import React from 'react'
import Shop from './pages/Shop'
import { useSelector } from 'react-redux'

const AdminDashboard = () => {
  let { shopData, shopLoading } = useSelector(state => state.admin); 
  let {foodData , foodLoading} = useSelector(state => state.food)

  if (shopLoading) return null;
  if (foodLoading) return null;

  return (
    <>
      {shopData.length === 0 ? "no" : <Shop />}
    </>
  );
}

export default AdminDashboard
