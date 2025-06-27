import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useParams } from 'react-router-dom';
import axios from 'axios';

function App() {


  const [Oldpassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
   const restPassword = async()=>{
    if(!Oldpassword || !newPassword) {
      alert("Please fill all fields");
      return;
    }

    if(Oldpassword === newPassword) {
      alert("New password should be different from old password");
      return;
    }
    
    const token = window.location.pathname.split('/').pop();
     const res = await axios.post(`http://localhost:3000/api/v1/user/reset-password/${token}`,{
      Oldpassword: Oldpassword,
      newPassword: newPassword
     })
     const data = res.data;
     if(data.success) {
      alert(data.message);
     }
    setOldPassword('');
    setNewPassword('');
   }
  return (
    <>
      <div>
        <div className=' flex flex-col'>
          <label htmlFor="">Old Password</label> <br />
          <input onChange={(e)=>setOldPassword(e.target.value)} type="text" className=' border' placeholder='old Password' />
        </div>
        <div className=' flex flex-col'>
          <label htmlFor="">New Password</label> <br />
          <input onChange={(e)=>setNewPassword(e.target.value)} type="text" className=' border' placeholder='old Password' />
        </div>
        <button onClick={restPassword}>Reset</button>
      </div>
    </>
  )
}

export default App
