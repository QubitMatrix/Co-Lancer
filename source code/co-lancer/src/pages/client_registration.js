import '../App.css';
import React, {useState} from 'react'
import ImageUpload from './image';
import { useLocation,useNavigate } from 'react-router-dom';
import server_url from './endpoint'

//Registration page extension, for client
function RegisterClient()
{   
    //handle form inputs
    const [inputs, setInputs] = useState({});

    const {state} = useLocation();
    const navigate=useNavigate()
    inputs['username'] = state.username;

    const handleChange = (e) => {
      e.preventDefault();
      const {name, value}=e.target;
      setInputs({...inputs,[name]:value});
    }

    const handleSubmit = async(e) => {
      e.preventDefault();
      console.log("Form submitted");
      console.log("inputs"+JSON.stringify(inputs));

      const serverUrl = server_url+"/register_client";

      try
      {
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputs),
        });

        if(response.ok)
        {
          const data = await response.json()
          alert(data.Message);
          
          //Display file upload
          const div1 = document.getElementById("upload_profile_placeholder")
          div1.style.display = "block";
        }
        else 
        {
          alert("Failed to register, server error");
        }
      }
      catch(err)
      {
        alert("Server is unreachable, try again later."+err)
      }
    }

    return (
      <div>
       <div className='header'>
          <button className='nav' onClick={()=>navigate('/')}>Home</button>
          <button className='nav' onClick={()=>{navigate('/login')}}>Log In</button>
        </div>
      <div className='reg_c_div'>
        <h1 className='text-4xl text-center pt-4'>Client</h1>
        <br/>
        <form id="reg_c_form" onSubmit={handleSubmit}>
          <label className="reg_c_label">Country</label> &nbsp;
          <input id="country_c" className="reg_c_input" type="text" name="country" value={inputs.country} onChange={handleChange} /> <br/>
          <br/>
          <label className="reg_c_label">Company</label> &nbsp;
          <input id="company" className="reg_c_input" type="text" name="company" value={inputs.company} onChange={handleChange} required /> <br/>
          <br/>
          <button className="submit_button" type="submit">Submit</button>
          <br/>
          <div id="upload_profile_placeholder">
            <ImageUpload  username={inputs.username} /> 
            <br/><br/>
          </div>
        </form>
      </div>
      <section id="footer">&copy;2023 Colancer <br/><img id="github-img" src="https://img.icons8.com/material-outlined/48/null/github.png" alt="github icon"/><a href="https://github.com/QubitMatrix/Co-Lancer">Source code</a></section>
      </div>
    );
}

export default RegisterClient;