import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import { setLoader } from '../redux/loaderSlice';
import { GetProducts } from '../apicalls/products';
import Divider from '../components/Divider';
import { useNavigate } from 'react-router-dom';
import Filters from './Filters';

const Home = (props) => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    status: 'approved',
    category: [],
    age: [],
  });
  const [showFilters, setShowFilters] = useState(true);
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(setLoader(true));
      const response = await GetProducts(filters);
      dispatch(setLoader(false));
      console.log('resp', response);
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    getData();
  }, [filters]);
  return (
    <div className='flex gap-5'>
      {showFilters && (
        <Filters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      <div className='flex flex-col gap-5'>
        <div className='flex items-center gap-5'>
          {!showFilters && (
            <i
              class='ri-filter-3-line'
              onClick={() => setShowFilters(!showFilters)}
            ></i>
          )}
          <input
            type='text'
            placeholder='Search Products here...'
            className='w-full p-2 border border-gray-300 border-solid rounded h-14'
          />
        </div>
        <div
          className={`grid gap-5 ${
            showFilters ? 'grid-cols-4' : 'grid-cols-5'
          }`}
        >
          {products.map((product) => {
            return (
              <div
                className='flex flex-col gap-5 pb-2 border border-gray-300 border-solid rounded rounded-md cursor-pointer'
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.images[0]}
                  alt=''
                  className='object-cover w-full h-40 rounded-md'
                />
                <div className='flex flex-col gap-2 px-2'>
                  <h1 className='text-lg font-semibold'>{product.name}</h1>
                  <p className='text-sm'>{product?.description}</p>
                  <Divider />
                  <span className='text-xl font-semibold text-green-700'>
                    ₹ {product?.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
