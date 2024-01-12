import { Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoader } from '../redux/loaderSlice';
import { GetAllUsers, updateUserStatus } from '../apicalls/users';
import moment from 'moment';

const UserLists = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const getUsers = async () => {
    try {
      dispatch(setLoader(true));
      const res = await GetAllUsers();
      dispatch(setLoader(false));
      console.log('users', res);
      if (res.success) {
        dispatch(setLoader(false));
        setUsers(res.data);
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };
  const onChangeUserStatus = async (_id, status) => {
    try {
      console.log('user status: ', _id, { status }, status);
      dispatch(setLoader(true));
      const res = await updateUserStatus(_id, { status });
      dispatch(setLoader(false));
      if (res.success) {
        dispatch(setLoader(false));
        getUsers();
        message.success(res.message);
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };
  const columns = [
    { title: 'Name', dataIndex: 'name' },

    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => {
        const color = record.status === 'active' ? 'green' : 'red';
        const style = { color: color };
        return <span style={style}>{record.status.toUpperCase()}</span>;
      },
    },
    {
      title: 'CreatedAt',
      dataIndex: 'createdAt',
      render: (text, record) =>
        moment(record.createdAt).format('DD-MM-YYYY hh:mm:ss A'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => {
        const { _id, status } = record;
        return (
          <div>
            {status === 'active' && (
              <span
                className='underline cursor-pointer'
                onClick={() => onChangeUserStatus(_id, 'Blocked')}
              >
                Block
              </span>
            )}
            {status === 'Blocked' && (
              <span
                className='underline cursor-pointer'
                onClick={() => onChangeUserStatus(_id, 'active')}
              >
                Unblock
              </span>
            )}
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      <Table columns={columns} dataSource={users} />
    </div>
  );
};

export default UserLists;
