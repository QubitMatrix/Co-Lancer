import '../App.css';
import React, {useState} from 'react'
import bcrypt from 'bcryptjs'

//User registration page
function RegistrationForm()
{
    //handle form inputs
    const [inputs, setInputs] = useState({});
    
    const handleChange = (e) => {
      e.preventDefault(); //prevents page refreshing after form submission
      const {name, value} = e.target; //destructuring assignment to extract name and value from target DOM element
      setInputs({...inputs, [name]:value});
      console.log(name+" "+value);
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
        document.location = "/register_" + inputs['usertype'] + "?username=" + inputs['username']; //once user form submitted open the next form based on user-type, username passed to link the next form details to the user
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
          <label className='reg_label'>Password</label> &nbsp;
          <input id="password" className="reg_input" type="password" name="password" value={inputs.password} onChange={handleChange} required /> <br/>
          <label className='reg_label'>Username</label> &nbsp;
          <input id="username" className="reg_input" type="text" name="username" value={inputs.username} onChange={handleChange} required /> <br/>
          <label className='reg_label'>Are you a: </label> <br/>
          <input id="user_type_1" type="radio" name="usertype" value="Freelancer" checked={inputs['usertype']==="Freelancer"} onClick={handleChange} />
          <label className='reg_label' htmlFor="user_type_1">Freelancer</label> <br/>
          <input id="user_type_2" type="radio" name="usertype" value="Client" checked={inputs['usertype']==="Client"} onClick={handleChange} />
          <label className='reg_label' htmlFor="user_type_2">Client</label> <br/> <br/>
          <button className='button' type="submit">Submit</button>
        </form>
        </div>
      </div>
    );
}
  
export default RegistrationForm;