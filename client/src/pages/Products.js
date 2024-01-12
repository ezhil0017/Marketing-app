import { Button, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import ProductForm from './ProductForm';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../redux/loaderSlice';
import moment from 'moment';
import { DeleteProduct, GetProducts } from '../apicalls/products';
import { useNavigate } from 'react-router-dom';
import Bids from './Bids';

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [showBidsModal, setShowBidsModal] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getData = async () => {
    try {
      dispatch(setLoader(true));
      const res = await GetProducts({ seller: user._id });
      console.log(res);
      dispatch(setLoader(false));
      if (res.success) {
        setProducts(res?.data);
        console.log(products);
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };
  const deleteProduct = async (id) => {
    try {
      dispatch(setLoader(true));
      const res = await DeleteProduct(id);
      dispatch(setLoader(false));
      console.log(res);
      if (res.success) {
        getData();
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
        return (
          <div className='flex gap-5'>
            <i
              className='ri-delete-bin-line'
              onClick={() => {
                deleteProduct(record._id);
              }}
            ></i>
            <i
              className='ri-edit-2-line'
              onClick={() => {
                setSelectedProduct(record);
                setShowProduct(true);
              }}
            ></i>
            <span
              className='underline cursor-pointer'
              onClick={() => {
                setShowBidsModal(!showBidsModal);
                setSelectedProduct(record);
              }}
            >
              Show Bids
            </span>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    if (user.role === 'admin') {
      message.error('Not authorized');
      navigate('/');
    }
    getData();
  }, []);
  return (
    <div>
      <div className='flex justify-end'>
        <Button
          type='default'
          onClick={() => {
            setShowProduct(true);
            setSelectedProduct(null);
          }}
        >
          Add Product
        </Button>
      </div>
      <Table columns={columns} dataSource={products} />
      {showProduct && (
        <ProductForm
          showProduct={showProduct}
          setShowProduct={setShowProduct}
          selectedProduct={selectedProduct}
          getData={getData}
        />
      )}
      {showBidsModal && (
        <Bids
          showBidsModal={showBidsModal}
          setShowBidsModal={setShowBidsModal}
          selectedProduct={selectedProduct}
        />
      )}
    </div>
  );
};

export default Products;
