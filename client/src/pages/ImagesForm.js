import { Button, message } from 'antd';
import Upload from 'antd/es/upload/Upload';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoader } from '../redux/loaderSlice';
import { UploadProductImage } from '../apicalls/products';

const ImagesForm = ({ selectedProduct, getData, setShowProduct }) => {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState(selectedProduct.images);
  const [showPreview, setShowPreview] = useState(true);
  const dispatch = useDispatch();
  const upload = async () => {
    console.log(file);
    try {
      dispatch(setLoader(true));
      //! upload image code here
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', selectedProduct._id);
      const response = await UploadProductImage(formData);
      dispatch(setLoader(false));
      if (response.success) {
        message.success(response.message);
        setImages([...images, response.data]);
        getData();
        setShowPreview(false);
        setFile(null);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };
  console.log(setShowProduct);
  return (
    <div>
      <Upload
        listType='picture'
        beforeUpload={() => false}
        onChange={(info) => {
          setFile(info.file);
          setShowPreview(true);
        }}
        showUploadList={showPreview}
      >
        <div className='flex gap-5'>
          {images.map((image) => {
            return (
              <div className='flex items-end gap-2 p-2 border border-gray-500 border-solid rounded'>
                <img className='object-cover w-20 h-20' src={image} alt='' />
                <i className='ri-delete-bin-line' onClick={() => {}}></i>
              </div>
            );
          })}
        </div>
        <Button type='dashed'>Upload Image</Button>
      </Upload>
      <div className='flex justify-end gap-5 mt-5'>
        <Button type='primary' onClick={() => setShowProduct(false)}>
          Cancel
        </Button>
        <Button type='primary' onClick={upload} disabled={!file}>
          Upload
        </Button>
      </div>
    </div>
  );
};

export default ImagesForm;
