import { Modal, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoader } from '../redux/loaderSlice';
import { GetAllBids } from '../apicalls/products';
import moment from 'moment';

const Bids = ({ showBidsModal, setShowBidsModal, selectedProduct }) => {
  const [bidsData, setBidsData] = useState([]);
  console.log('bids:', selectedProduct);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(setLoader(true));
      const response = await GetAllBids({ product: selectedProduct._id });
      dispatch(setLoader(false));
      if (response.success) {
        setBidsData(response.data);
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };
  console.log('all bids:', bidsData);
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => {
        return <h1>{record.buyer.name}</h1>;
      },
    },
    { title: 'Bid Amount', dataIndex: 'bidAmount' },
    {
      title: 'Bid Date',
      dataIndex: 'createdAt',
      render: (text, record) => {
        return moment(text).format('MMM DD YYYY,h:MM:ss a');
      },
    },
    { title: 'Message', dataIndex: 'message' },
    {
      title: 'Contact Details',
      dataIndex: 'contactDetails',
      render: (text, record) => {
        return (
          <div>
            {record?.phone && <p>Phone:{record?.phone}</p>}
            {record?.buyer?.email && <p>Email:{record?.buyer?.email}</p>}
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    if (selectedProduct) {
      getData();
    }
  }, [selectedProduct]);
  return (
    <Modal
      title='Bids'
      open={showBidsModal}
      onCancel={() => setShowBidsModal(false)}
      centered
      width={800}
      footer={null}
    >
      <div className='flex flex-col gap-5'>
        <h1 className='text-xl text-primary'>
          Product Name: {selectedProduct?.name}
        </h1>
        <Table columns={columns} dataSource={bidsData} />
      </div>
    </Modal>
  );
};

export default Bids;
