import axios from 'axios';

//! register user
export const RegisterUser = async (payload) => {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const res = await axios.post('/api/users/register', payload, config);
    return res.data;
  } catch (error) {
    return error.message;
  }
};

//! Login user
export const LoginUser = async (payload) => {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const res = await axios.post('/api/users/login', payload, config);
    console.log('login: ', res.data);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    return res.data;
  } catch (error) {
    return error.message;
  }
};

//! get current user
export const GetCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const res = await axios.get('/api/users/me', { headers });
    return res.data;
  } catch (error) {
    return error.message;
  }
};

//! get all users
export const GetAllUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const res = await axios.get('/api/users/get-users', { headers });
    return res.data;
  } catch (error) {
    return error.message;
  }
};
//! update user status
export const updateUserStatus = async (id, payload) => {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    console.log('userstats', payload);
    const res = await axios.put(
      `/api/users/update-user-status/${id}`,
      payload,
      { headers }
    );
    return res.data;
  } catch (error) {
    return error.message;
  }
};
