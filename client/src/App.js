import { Button } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoutes from './components/ProtectedRoutes';
import Spinner from './components/Spinner';
import { useSelector } from 'react-redux';
import Profile from './pages/Profile';
import AdminPage from './pages/AdminPage';
import UserLists from './pages/UserLists';
import ProductInfo from './pages/ProductInfo';

function App() {
  const { loading } = useSelector((state) => state.loaders);

  return (
    <div>
      <ToastContainer />
      {loading && <Spinner />}
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoutes>
                <Profile />
              </ProtectedRoutes>
            }
          />
          <Route
            path='/admin'
            element={
              <ProtectedRoutes>
                <AdminPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path='/product/:id'
            element={
              <ProtectedRoutes>
                <ProductInfo />
              </ProtectedRoutes>
            }
          />

          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
