import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LoginUser } from '../apicalls/users';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setLoader } from '../redux/loaderSlice';

const rules = [
  {
    required: true,
    message: 'required',
  },
];

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(setLoader(true));
      const res = await LoginUser(values);
      console.log('login page: ', res);
      dispatch(setLoader(false));
      if (res.success) {
        navigate('/');
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(setLoader(false));
    }
  };
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);
  return (
    <div className='flex items-center justify-center h-screen bg-primary'>
      <div className='p-5 bg-white rounded w-[450px]'>
        <h1 className='text-2xl text-primary'>
          MMP - <span className='text-gray-500'>LOGIN</span>
        </h1>
        <Divider />{' '}
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item label='Email' name='email' rules={rules}>
            <Input placeholder='Email' />
          </Form.Item>
          <Form.Item label='Password' name='password' rules={rules}>
            <Input type='password' placeholder='Password' />
          </Form.Item>
          <Button type='primary' htmlType='submit' block className='mt-2'>
            Login
          </Button>
          <div className='mt-5 text-center'>
            <span className='text-gray-500'>
              Don't have an account?{' '}
              <Link to='/register' className='text-primary'>
                Register
              </Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
