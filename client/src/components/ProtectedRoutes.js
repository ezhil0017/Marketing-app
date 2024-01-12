import React, { useEffect, useState } from 'react';
import { GetCurrentUser } from '../apicalls/users';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { message } from 'antd';

const ProtectedRoutes = ({ children }) => {
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validateToken = async () => {
    try {
      const res = await GetCurrentUser();
      if (res.success) {
        dispatch(setUser(res.user));
      } else {
        toast.error(res.message);
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      navigate('/login');
      message.error(error.message);
    }
  };
  useEffect(() => {
    if (localStorage.getItem('token')) {
      validateToken();
    } else {
      message.error('please login to continue');
      navigate('/login');
    }
  }, []);
  return (
    user && (
      <div>
        <div className='flex items-center justify-between p-5 bg-primary'>
          <h1
            className='text-2xl text-white cursor-pointer'
            onClick={() => navigate('/')}
          >
            MMP
          </h1>
          <div className='flex items-center gap-1 px-5 py-2 bg-white rounded'>
            <i className='cursor-pointer ri-user-fill'></i>
            <span
              className='underline uppercase cursor-pointer'
              onClick={() => {
                user?.role === 'admin'
                  ? navigate('/admin')
                  : navigate('/profile');
              }}
            >
              {user?.name}
            </span>
            <i
              className='ml-10 cursor-pointer ri-logout-box-r-line'
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
            ></i>
          </div>
        </div>
        <div className='p-5'>{children}</div>
      </div>
    )
  );
};

export default ProtectedRoutes;
