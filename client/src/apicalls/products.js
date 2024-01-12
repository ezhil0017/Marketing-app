import axios from 'axios';

//! add a new product

export const AddProduct = async (payload) => {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const res = await axios.post('/api/products/add-product', payload, {
      headers,
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
};

//! get all products

export const GetProducts = async (payload) => {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const res = await axios.post('/api/products/get-products', payload, {
      headers,
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
};
//! edit a product
export const EditProduct = async (id, payload) => {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const response = await axios.put(
      `/api/products/edit-product/${id}`,
      payload,
      { headers }
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

//! delete a product
export const DeleteProduct = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const response = await axios.delete(`/api/products/delete-product/${id}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const UploadProductImage = async (payload) => {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const response = await axios.post(
      '/api/products/upload-image-to-product',
      payload,
      { headers }
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const UpdateProductStatus = async (id, payload) => {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    console.log(headers);
    const response = await axios.put(
      `/api/products/update-product-status/${id}`,
      payload,
      { headers }
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const GetProductByID = async (id) => {
  try {
    console.log('product id: ', id);
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const response = await axios.get(`/api/products/get-product-by-id/${id}`, {
      headers,
    });
    console.log('prod info:', response);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const PlaceNewBid = async (payload) => {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const response = await axios.post('/api/bids/place-new-bid', payload, {
      headers,
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const GetAllBids = async (filters) => {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const response = await axios.post('/api/bids/get-all-bids', filters, {
      headers,
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
};
