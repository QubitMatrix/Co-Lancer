import '../App.css';
import React, {useState} from 'react'

//Login page for users and authentication
function Login()
{
    //handle inputs
    const [inputs, setInputs] = useState({});

    const handleChange = (e) => {
      e.preventDefault();
      const {name, value}=e.target;
      setInputs({...inputs,[name]:value});
    }
    
    
    const handleSubmit = async(e) => {
      e.preventDefault();
      console.log("Form submitted");
      console.log("inputs"+JSON.stringify(inputs));

      const serverUrl = "http://localhost:3000/authenticate"; //url to hit backend and get a response

      try
      {
        fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputs),
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);

          //check authentication and redirect to the profile page
          const message = data["message"];
          if(message === "Username not found" || message === "Wrong Password")
          {
            alert(message);
            document.location = "/login";
          }
          else if(message === "Freelancer" || message === "Client")
          {
            alert("Successfully logged in");
            document.location = "/" + message + "_profile?username=" + inputs["username"];
          }
        });        
      }
      catch(err)
      {
        console.error(err);
      }
    }

    //Page rendered at login
    return(
      <div id="login">
        <h3 className='text-4xl pt-9 font-bold place-self-center text-center'>Log In</h3>
        <div className='form_div'>
          <form id="login_form" onSubmit={handleSubmit}>
            <label className='reg_label'>Username</label> &nbsp; <br/>
            <input id="login-username" className="reg_input" type="text" name="username" value={inputs.username} onChange={handleChange} required /> <br/> <br/>     
            <label className='reg_label'>Password</label> &nbsp; <br/>
            <input id="login-password" className="reg_input" type="password" name="password" value={inputs.password} onChange={handleChange} required /> <br/> <br/> 
            <br/> 
            <button className="button" id ="b_login" type="submit">Log In</button>
          </form>
        </div>
      </div>
    )
}

export default Login;
