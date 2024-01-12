import { Form, Input, Modal, message } from 'antd';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../redux/loaderSlice';
import { PlaceNewBid } from '../apicalls/products';

function BidModel({ showBidModal, setShowBidModal, product, reloadData }) {
  const formRef = useRef(null);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const rules = [{ required: true, message: 'Required' }];
  const onFinish = async (values) => {
    try {
      dispatch(setLoader(true));
      const response = await PlaceNewBid({
        ...values,
        product: product._id,
        seller: product.seller._id,
        buyer: user._id,
      });
      dispatch(setLoader(false));
      if (response.success) {
        message.success('Bid Successfully Added');
        reloadData();
        setShowBidModal(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(setLoader(false));
    }
  };
  return (
    <Modal
      onCancel={() => setShowBidModal(false)}
      open={showBidModal}
      width={600}
      centered
      onOk={() => formRef.current.submit()}
    >
      <div className='flex flex-col gap-5'>
        <h1 className='mb-5 text-2xl font-semibold text-center text-orange-900'>
          New Bid
        </h1>
        <Form layout='vertical' ref={formRef} onFinish={onFinish}>
          <Form.Item label='Bid Amount' rules={rules} name='bidAmount'>
            <Input type='number' />
          </Form.Item>
          <Form.Item label='Message' rules={rules} name='message'>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label='Phone' rules={rules} name='phone'>
            <Input type='number' />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default BidModel;
