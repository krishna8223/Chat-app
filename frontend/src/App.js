import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Chat from './pages/Chat';
import Register from './pages/Register';
import Login from './pages/Login';
import SetAvatar from './pages/SetAvatar';
import { ToastContainer, toast } from 'react-toastify';



function App() {
  return (
    <>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ToastContainer />

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/setAvatar' element={<SetAvatar />} />
        </Routes>
      </BrowserRouter>

    </>

  );
}

export default App;
