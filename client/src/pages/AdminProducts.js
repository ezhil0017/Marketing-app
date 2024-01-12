import React, { useState } from 'react';
import { Button, Table, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../redux/loaderSlice';
import moment from 'moment';
import { GetProducts, UpdateProductStatus } from '../apicalls/products';
import { useEffect } from 'react';
const AdminProducts = () => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [adminProducts, setAdminProducts] = useState([]);
  const getData = async () => {
    try {
      dispatch(setLoader(true));
      const res = await GetProducts(null);
      setAdminProducts(res?.data);
      dispatch(setLoader(false));
      if (res.success) {
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };
  const onStatusChange = async (_id, status) => {
    try {
      console.log(_id, { status });
      dispatch(setLoader(true));
      const res = await UpdateProductStatus(_id, { status });
      dispatch(setLoader(false));
      if (res.success) {
        getData();
        message.success(res.message);
        console.log(res);
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };
  const columns = [
    { title: 'Name', dataIndex: 'name' },

    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => {
        const color = record.status === 'approved' ? 'green' : 'red';
        const style = { color: color };
        return <span style={style}>{record.status.toUpperCase()}</span>;
      },
    },
    {
      title: 'Added On',
      dataIndex: 'createdAt',
      render: (text, record) =>
        moment(record.createdAt).format('DD-MM-YYYY hh:mm:ss A'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => {
        const { status, _id } = record;
        return (
          <div className='flex gap-3'>
            {status === 'pending' && (
              <span
                className='text-green-600 underline cursor-pointer'
                onClick={() => onStatusChange(_id, 'approved')}
              >
                Approve
              </span>
            )}
            {status === 'pending' && (
              <span
                className='text-red-600 underline cursor-pointer'
                onClick={() => onStatusChange(_id, 'rejected')}
              >
                Reject
              </span>
            )}
            {status === 'approved' && (
              <span
                className='text-red-400 underline cursor-pointer'
                onClick={() => onStatusChange(_id, 'blocked')}
              >
                Block
              </span>
            )}
            {status === 'blocked' && (
              <span
                className='text-green-400 underline cursor-pointer'
                onClick={() => onStatusChange(_id, 'approved')}
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
    getData();
  }, []);
  return (
    <div>
      <Table columns={columns} dataSource={adminProducts} />
    </div>
  );
};

export default AdminProducts;
