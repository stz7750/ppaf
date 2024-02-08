import React from 'react';

import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { Button } from 'react-bootstrap';

function Toast() {

  const notify = () => toast.warning('Wow so easy!');
  const noti = () => toast.success("테스트 알림!");

  return (
    <>
     <button onClick={notify}>Notify!</button>
     <Button onClick={noti}>noti</Button>
     
      <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    </>
  );
}

export default Toast;