import { Col, Form, Input, Row, Tabs, message } from 'antd';
import Modal from 'antd/es/modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';
import { setLoader } from '../redux/loaderSlice';
import { AddProduct, EditProduct } from '../apicalls/products';
import ImagesForm from './ImagesForm';

const additionalThings = [
  { label: 'Bill Available', name: 'billAvailable' },
  { label: 'Warranty Available', name: 'warrantyAvailable' },
  { label: 'Accessories Available', name: 'accessoriesAvailable' },
  { label: 'Box Available', name: 'boxAvailable' },
  { label: 'Show Bids', name: 'showBidsOnProductPage' },
];
const rules = [{ required: true, message: 'Required' }];
const ProductForm = ({
  showProduct,
  setShowProduct,
  selectedProduct,
  getData,
}) => {
  const [selectedTab = '1', setSelectedTab] = useState('1');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const formRef = useRef(null);
  console.log(selectedProduct);
  useEffect(() => {
    if (selectedProduct) {
      formRef.current.setFieldsValue(selectedProduct);
    }
  }, [selectedProduct]);
  const onFinish = async (values) => {
    try {
      let res = null;
      if (selectedProduct) {
        dispatch(setLoader(true));
        res = await EditProduct(selectedProduct._id, values);
      } else {
        values.seller = user?._id;
        values.status = 'pending';
        dispatch(setLoader(true));
        res = await AddProduct(values);
      }
      dispatch(setLoader(false));

      if (res.success) {
        setShowProduct(false);
        message.success(res.message);
        getData();
      } else {
        setShowProduct(false);
        console.error(res.message);
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.error(error.message);
    }
  };
  return (
    <div>
      <Modal
        title=''
        width={1000}
        centered
        open={showProduct}
        onCancel={() => setShowProduct(false)}
        okText='Save'
        onOk={() => {
          formRef.current.submit();
        }}
        {...(selectedTab === '2' && { footer: false })}
      >
        <div>
          <h1 className='text-2xl font-semibold text-center uppercase text-primary'>
            {selectedProduct ? 'Edit Product' : 'Add Product'}
          </h1>
          <Tabs
            defaultActiveKey='1'
            activeKey={selectedTab}
            onChange={(key) => setSelectedTab(key)}
          >
            <Tabs.TabPane tab='General' key='1'>
              <Form layout='vertical' ref={formRef} onFinish={onFinish}>
                <Form.Item label='Name' name='name' rules={rules}>
                  <Input type='text' />
                </Form.Item>
                <Form.Item label='Description' rules={rules} name='description'>
                  <Input type='text' />
                </Form.Item>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item label='Price' name='price' rules={rules}>
                      <Input type='number' />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label='Category' name='category' rules={rules}>
                      <select name='' id=''>
                        <option value=''>--Select--</option>
                        <option value='electronics'>Electronics</option>
                        <option value='fashion'>Fashion</option>
                        <option value='home'>Home</option>
                        <option value='sports'>Sports</option>
                      </select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label='Age' name='age'>
                      <Input type='text' />
                    </Form.Item>
                  </Col>
                </Row>
                <div className='flex gap-10'>
                  {additionalThings.map((item) => {
                    return (
                      <Form.Item
                        label={item?.label}
                        name={item?.name}
                        valuePropName='checked'
                      >
                        <Input
                          type='checkbox'
                          value={item.name}
                          onChange={(e) => {
                            formRef.current.setFieldsValue({
                              [item.name]: e.target.checked,
                            });
                          }}
                          checked={formRef.current?.getFieldValue(item.name)}
                        />
                      </Form.Item>
                    );
                  })}
                </div>
              </Form>
            </Tabs.TabPane>
            <Tabs.TabPane tab='Images' key='2' disabled={!selectedProduct}>
              <ImagesForm
                selectedProduct={selectedProduct}
                getData={getData}
                setShowProduct={setShowProduct}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Modal>
    </div>
  );
};

export default ProductForm;
