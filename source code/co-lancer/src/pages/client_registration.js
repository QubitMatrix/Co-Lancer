import '../App.css';
import React, {useState} from 'react'
import ImageUpload from './image';
import { useLocation } from 'react-router-dom';

//Registration page extension, for client
function RegisterClient()
{   
    //handle form inputs
    const [inputs, setInputs] = useState({});

    const {state} = useLocation();
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

      const serverUrl = "http://localhost:3000/register_client";

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
          console.log("successfully submitted");
          alert("Registration successful,you will now be required to select a profile picture.");
          
          //Display file upload
          const div1 = document.getElementById("upload_profile_placeholder")
          div1.style.display = "block";
        }
        else 
        {
          console.log("didn't submit");
        }
      }
      catch(err)
      {
        console.error(err);
      }
    }

    return (
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
          </div>
        </form>
        <br/>
      </div>
    );
}

export default RegisterClient;