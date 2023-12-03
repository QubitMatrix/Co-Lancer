//PAYMENTS
import '../App.css';
import React, {useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import server_url from './endpoint'

const Payment=()=>{
    const {state} = useLocation();
    const username=state?.username;
    const pid=state?.pid;
    console.log("pay:"+username+pid)
    const [mode,setMode]=useState([])
    const [amount,setAmount]=useState([])
    
    //navigate object
    const navigate = useNavigate();

    const handleSubmit=async(e)=>
    {
        e.preventDefault();
        console.log("submit")
        console.log("mode:"+mode)
        console.log("amount:"+amount)
        try {
            const response = await fetch(server_url+'/payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({'username':username,'pid':pid,'mode':mode,'amount':amount}), 
            });
      
            if (!response.ok) 
            {
              alert('Server Error'); 
            }
            else
            {
              alert("Payment Successful");
            }
            // Handle success, if needed
          } catch (error) 
          {
            alert('Server unreachable, try again later.'+error);
          }

    }

    const handleChange=(e)=>{
        e.preventDefault();
        const data=e.target.value
        setAmount(data)

    }

    const handleDropdownChange=()=>
    {
        const dropdown=document.getElementById("Dropdown").value
        //const data=dropdown.value
        console.log("mode chosen:"+dropdown)
        if (dropdown!=='')
        setMode(dropdown)
    }

    return(
      <div>
        <div className='header'>
            <button className='nav' onClick={()=>{navigate('/client_profile',{state:{username:username}})}}>Profile</button>
            <div>
                <button className='logout' onClick={()=>{navigate('/')}}>Log Out</button>
            </div>
        </div>
        <div className='payment-div'>
            <br/>
            <form onSubmit={handleSubmit} className='align-center pl-20'>
                <label>Payment Mode</label>
                <select id="Dropdown" onChange={handleDropdownChange}>
                  <option value="">Select an option</option>
                  <option value="upi">UPI</option>
                  <option value="credit/debit card">Credit/Debit Card</option>
                  <option value="netbanking">Net Banking</option>
                </select>
                <br/> <br/>
                <label>Amount Paid</label>
                <input className='amount' type="number" onChange={handleChange}/>
                <br/> <br/>
                <button className='pay-submit' type="submit">Submit</button>
            </form>
            <br/>
        </div>
        <section id="footer">&copy;2023 Colancer <br/><img id="github-img" src="https://img.icons8.com/material-outlined/48/null/github.png" alt="github icon"/><a href="https://github.com/QubitMatrix/Co-Lancer">Source code</a></section>
        </div>
    )

}

export default Payment;