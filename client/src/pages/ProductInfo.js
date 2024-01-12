import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setLoader } from '../redux/loaderSlice';
import { GetAllBids, GetProductByID } from '../apicalls/products';
import { Button, message } from 'antd';
import Divider from '../components/Divider';
import moment from 'moment';
import BidModel from './BidModel';

function ProductInfo() {
  const { user } = useSelector((state) => state.users);
  const [showAddNewBid, setShowAddNewBid] = useState(false);
  const [selectedImageIndex = 0, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const getProduct = async () => {
    try {
      dispatch(setLoader(true));
      const resp = await GetProductByID(id);
      console.log('resp prod:', resp);
      dispatch(setLoader(false));
      if (resp.success) {
        const bidsResponse = await GetAllBids({ product: id });
        console.log('all bids:', bidsResponse);

        setProduct({ ...resp.data, bids: bidsResponse.data });
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };
  console.log('all bids in productinfo page:', product);
  useEffect(() => {
    getProduct();
  }, []);
  return (
    product && (
      <div>
        <div className='grid grid-cols-2 gap-5 mt-5'>
          <div className='flex flex-col gap-5'>
            <img
              src={product?.images[selectedImageIndex]}
              alt=''
              className='object-cover w-full rounded-md h-96'
            />
            <div className='flex gap-5'>
              {product?.images?.map((image, index) => {
                return (
                  <img
                    className={
                      'object-cover w-20 h-20 rounded-md cursor-pointer' +
                      (selectedImageIndex === index
                        ? 'border-2 border-green-700 border-solid'
                        : '')
                    }
                    onClick={() => setSelectedImageIndex(index)}
                    src={image}
                    alt=''
                  />
                );
              })}
            </div>
            <Divider />
            <div>
              <h1 className='text-gray-600'>Added On</h1>
              <span className='text-gray-600'>
                {moment(product?.createdAt).format('MMM DD YYYY hh:mm A')}
              </span>
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <div>
              <h1 className='text-2xl text-orange-900 text-semibold'>
                {product?.name}
              </h1>
              <span>{product?.description}</span>
            </div>
            <Divider />
            <div className='flex flex-col'>
              <h1 className='text-2xl font-semibold text-orange-900'>
                Product Details
              </h1>
              <div className='flex justify-between mt-2'>
                <span>Price</span>
                <span>₹ {product?.price}</span>
              </div>
              <div className='flex justify-between mt-2'>
                <span>Category</span>
                <span>{product?.category}</span>
              </div>
              <div className='flex justify-between mt-2'>
                <span>Bill Available</span>
                <span>{product?.billAvailable ? 'Yes' : 'No'}</span>
              </div>
              <div className='flex justify-between mt-2'>
                <span>Box Available</span>
                <span>{product?.boxAvailable ? 'Yes' : 'No'}</span>
              </div>
              <div className='flex justify-between mt-2'>
                <span>Accessories Available</span>
                <span>{product?.accessoriesAvailable ? 'Yes' : 'No'}</span>
              </div>
              <div className='flex justify-between mt-2'>
                <span>Warranty Available</span>
                <span>{product?.warrantyAvailable ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <Divider />
            <div className='flex flex-col'>
              <h1 className='text-2xl font-semibold text-orange-900'>
                Seller Details
              </h1>
              <div className='flex justify-between mt-2'>
                <span>Name</span>
                <span>{product?.seller?.name}</span>
              </div>
              <div className='flex justify-between mt-2'>
                <span>Email</span>
                <span>{product?.seller?.email}</span>
              </div>
            </div>
            <Divider />
            <div className='flex flex-col'>
              <div className='flex justify-between mb-5'>
                <h1 className='text-2xl font-semibold text-orange-900'>Bids</h1>
                <Button
                  onClick={() => setShowAddNewBid(!showAddNewBid)}
                  disabled={user._id === product.seller._id}
                >
                  New Bid
                </Button>
              </div>
              {product.showBidsOnProductPage &&
                product?.bids?.map((bid) => {
                  return (
                    <div className='p-3 mb-3 border border-gray-300 border-solid rounded'>
                      <div className='flex justify-between text-gray-700'>
                        <span>Name</span>
                        <span>{bid.buyer.name}</span>
                      </div>
                      <div className='flex justify-between text-gray-700'>
                        <span>Bid Amount</span>
                        <span>{bid.bidAmount}</span>
                      </div>
                      <div className='flex justify-between text-gray-700'>
                        <span>Bid Placed On</span>
                        <span>
                          {moment(bid.createdAt).format('MMM D, YYYY hh:mm A')}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {showAddNewBid && (
          <BidModel
            product={product}
            reloadData={getProduct}
            showBidModal={showAddNewBid}
            setShowBidModal={setShowAddNewBid}
          />
        )}
      </div>
    )
  );
}

export default ProductInfo;
