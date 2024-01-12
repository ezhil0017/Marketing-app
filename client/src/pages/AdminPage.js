import React, { useEffect } from 'react';
import { Tabs, message } from 'antd';
import AdminProducts from './AdminProducts';
import UserLists from './UserLists';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  useEffect(() => {
    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
      message.error('Not Authorized');
    }
  }, []);
  return (
    <div>
      <Tabs>
        <Tabs.TabPane tab='Products' key='1'>
          <AdminProducts />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Users' key='2'>
          <UserLists />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default AdminPage;
