import '../App.css';
import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import server_url from './endpoint'

//Login page for users and authentication
function Login()
{
    //handle inputs
    const [inputs, setInputs] = useState({});

    //navigate object
    const navigate = useNavigate();

    const handleChange = (e) => {
      e.preventDefault();
      const {name, value}=e.target;
      setInputs({...inputs,[name]:value});
    }
    
    
    const handleSubmit = async(e) => {
      e.preventDefault();
      console.log("Form submitted");
      console.log("inputs"+JSON.stringify(inputs));

      const serverUrl = server_url+"/authenticate"; //url to hit backend and get a response

      console.log(serverUrl);
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
          //check authentication and redirect to the profile page
          const message = data["Message"];
          if(message === "Username not found" || message === "Wrong Password")
          {
            alert(message);
            navigate("/login");
          }
          else if(message === "Freelancer" || message === "Client")
          {
            alert("Successfully logged in");
            navigate("/" + message + "_profile", {state:{username: inputs["username"]}});
          }
          else
          {
            alert(message)
          }
        });        
      }
      catch(err)
      {
        alert("Server in unreachable, try again later."+err);
      }
    }

    //Page rendered at login
    return(
      <div>
        <div className='header'>
          <button className='nav' onClick={()=>navigate('/')}>Home</button>
          <button className='nav' onClick={()=>{navigate('/register')}}>Register</button>
        </div>
        <section id="data_warning">
          <p>This website is currently a sample project undergoing testing. For your safety, please use fake data instead of real information while interacting with the platform. We cannot guarantee the security of personal information at this stage.</p>
        </section>
    
      <div id="login">
        
        <h3 className='text-4xl pt-9 font-bold place-self-center text-center'>Log In</h3>
        <div className='form_div'>
          <form id="login_form" onSubmit={handleSubmit}>
            <label className='reg_label'>Username</label> &nbsp; <br/>
            <input id="login-username" className="reg_input" type="text" name="username" value={inputs.username} onChange={handleChange} required /> <br/> <br/>     
            <label className='reg_label'>Password</label> &nbsp; <br/>
            <input id="login-password" className="reg_input" type="password" name="password" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#\$!%&])(?!.*[^a-zA-Z0-9@#\$!%&]).{8,30}$"  value={inputs.password} onChange={handleChange} required /> <br/> <br/> 
            <br/> 
            <button className="button" id ="b_login" type="submit">Log In</button>
          </form>
        </div>
      </div>
      <section id="footer">&copy;2023 Colancer <br/><img id="github-img" src="https://img.icons8.com/material-outlined/48/null/github.png" alt="github icon"/><a href="https://github.com/QubitMatrix/Co-Lancer">Source code</a></section>
      </div>
    )
}

export default Login;
