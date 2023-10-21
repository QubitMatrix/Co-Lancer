import '../App.css';
import React, {useState} from 'react'

//Registration page extension, for client
function RegisterClient()
{   
    const searchParams = new URLSearchParams(window.location.search); //extract search parameters from URL
    const username = searchParams.get('username'); //extract username

    //handle form inputs
    const [inputs, setInputs] = useState({});
    inputs['username'] = username;

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
          alert("Registration successful, you will be redirected to the home page");
        }
        else 
        {
          console.log("didn't submit");
        }
        document.location="/"; 
      }
      catch(err)
      {
        console.error(err);
      }
    }

    return (
      <div>
        <h1>Client</h1>
        <form id="reg_c_form" onSubmit={handleSubmit}>
          <label className="reg_c_label">Country</label> &nbsp;
          <input id="country_c" className="reg_c_input" type="text" name="country" value={inputs.country} onChange={handleChange} /> <br/>
          <label className="reg_c_label">Company</label> &nbsp;
          <input id="company" className="reg_c_input" type="text" name="company" value={inputs.company} onChange={handleChange} required /> <br/>
          <button className="submit_button" type="submit">Submit</button>
        </form>
      </div>
    );
}

export default RegisterClient;