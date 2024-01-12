const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
const connectDB = require('./config/db');
const userRoute = require('./routes/usersRoute');
const productRoute = require('./routes/productsRoute');
const bidsRoute = require('./routes/bidsRoute');
const path = require('path');
//*Connect to MongoDB
connectDB();

//* Init Middleware
app.use(express.json({ extented: false }));
//! routes
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/bids', bidsRoute);

// deployment config

__dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.listen(port, () => console.log(`Node Js server started on port ${port}`));
}
