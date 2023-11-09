import '../App.css';
import React, {useState} from 'react'
import bcrypt from 'bcryptjs'
import { useNavigate } from 'react-router-dom';

//User registration page
function RegistrationForm()
{
    //handle form inputs
    const [inputs, setInputs] = useState({});

    //navigate object
    const navigate = useNavigate();

    const handleChange = (e) => {
      e.preventDefault(); //prevents page refreshing after form submission
      const {name, value} = e.target; //destructuring assignment to extract name and value from target DOM element
      setInputs({...inputs, [name]:value});
      //Highlight radiobutton
      if(name == "usertype" && value == "Freelancer")
        document.getElementById("usertype_freelancer").innerHTML=`<input id="user_type_1" type="radio" name="usertype" value="Freelancer" checked onClick={handleChange} required/>`;
      if(name == "usertype" && value == "Client")
        document.getElementById("usertype_2").innerHTML=`<input id="user_type_2" type="radio" name="usertype" value="Client" checked onClick={handleChange} required/>`;
    }

    const handleSubmit = async(e) => {
      e.preventDefault();
      console.log("inputs"+JSON.stringify(inputs));
      console.log("Form submitted");
      
      //generate unique salt to hash the password 
      const salt = bcrypt.genSaltSync(10);
      console.log(salt);
      const hashedpassword = bcrypt.hashSync(inputs["password"], salt);
      inputs["password"] = hashedpassword; 
      console.log("hashed password is "+hashedpassword);
      alert("Your salt for hashing your password is " + salt);

      const serverUrl = "http://localhost:3000/register_user"; //server endpoint to handle form inputs

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
        }
        else
        {
          console.log("didn't submit");
        }
        navigate("/register_" + inputs['usertype'], {state:{username: inputs['username']}}); //once user form submitted open the next form based on user-type, username passed to link the next form details to the user
      }
      catch(err)
      { 
        console.error(err);
      }
    }
  
    return (
      <div>
        <h1 className='text-4xl text-center pt-9'>Register</h1>
        <div className='reg_div'>
        <form id="reg_form" onSubmit={handleSubmit}>
          <label className='reg_label'>Name</label> &nbsp;
          <input id="name" className="reg_input" type="text" name="person_name" value={inputs.person_name} onChange={handleChange} required /> <br/>
          <label className='reg_label'>Email ID</label> &nbsp;
          <input id="email_id" className="reg_input" type="email" name="email" value={inputs.email} onChange={handleChange} required /> <br/>
          <label className='reg_label'>Username</label> &nbsp;
          <input id="username" className="reg_input" type="text" name="username" value={inputs.username} onChange={handleChange} required /> <br/>
          <label><abbr className='reg_label' title="Include atleast one lowercase, one uppercase, one digit and one special symbol. Min length 8 and max length 30">Password</abbr></label> &nbsp;
          <input id="password" className="reg_input" type="password" name="password" value={inputs.password} onChange={handleChange} pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#\$!%&])(?!.*[^a-zA-Z0-9@#\$!%&]).{8,30}$" required /> <br/>
          <label className='reg_label'>Are you a: </label> <br/>
          <div id="usertype_freelancer">
          <input id="user_type_1" type="radio" name="usertype" value="Freelancer"  onClick={handleChange} required/>
          </div>
          <label className='reg_label' htmlFor="user_type_1">Freelancer</label> <br/>
          <div id="usertype_client">
          <input id="user_type_2" type="radio" name="usertype" value="Client"  onClick={handleChange}/>
          </div>
          <label className='reg_label' htmlFor="user_type_2">Client</label> <br/> <br/>
          <button className='button' type="submit">Submit</button>
        </form>
        </div>
      </div>
    );
}
  
export default RegistrationForm;

