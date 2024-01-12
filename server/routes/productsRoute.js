const router = require('express').Router();
const Product = require('../models/productModel');
const authMiddleware = require('../middleware/authMiddleware');
const cloudinary = require('../config/cloudinaryConfig');
const multer = require('multer');
//! add a new product

router.post('/add-product', authMiddleware, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.send({
      success: true,
      message: 'product added successfully',
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//! get all products
router.post('/get-products', authMiddleware, async (req, res) => {
  try {
    const { seller, category = [], age = [], status } = req.body;
    let filters = {};
    if (seller) {
      filters.seller = seller;
    }
    if (status) {
      filters.status = status;
    }
    if (category.length > 0) {
      filters.category = { $in: category };
    }
    if (age.length > 0) {
      age.forEach((item) => {
        const fromAge = item.split('-')[0];
        const toAge = item.split('-')[1];
        filters.age = { $gte: fromAge, $lte: toAge };
      });
    }
    const products = await Product.find(filters).sort({ createdAt: -1 });
    res.send({
      success: true,
      data: products,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//! edit a product
router.put('/edit-product/:id', authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: 'Product Updated Successfully',
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//! delete a product
router.delete('/delete-product/:id', authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: 'Product Deleted Successfully',
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//! handle image upload to cloudinary
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

router.post(
  '/upload-image-to-product',
  authMiddleware,
  multer({ storage: storage }).single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        throw new Error('No file uploaded');
      }

      if (!req.body.productId) {
        throw new Error('ProductId not provided');
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'MMP',
      });
      console.log('Result: ', result);
      const productId = req.body.productId;
      await Product.findByIdAndUpdate(productId, {
        $push: { images: result.secure_url },
      });
      res.send({
        success: true,
        message: 'Image uploaded successfuly',
        data: result.secure_url,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  }
);
//! updata status for an product
router.put('/update-product-status/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { status });
    res.send({
      success: true,
      message: 'Product status update successfully',
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//! get product by id
router.get('/get-product-by-id/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller');
    res.send({
      success: true,
      data: product,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;
