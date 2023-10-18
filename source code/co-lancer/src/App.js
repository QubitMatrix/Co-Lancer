import './App.css';
import React, {useState, useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import bcrypt from 'bcryptjs'


//main function called at runtime
function App() 
{
  //Home page
  class Home extends React.Component
  {
    render()
    {
      return (
        <div id="home">
          <h1>Colancer</h1>
          <p>Elevate Your Freelance Game With <b>CO-LANCER</b><br/><i>Collaborate To Thrive!!!</i></p>
          <button id="reg_button" onClick={()=>document.location="/register"}>Register</button>
          <button id="login_button" onClick={()=>document.location="/login"}>Login</button>
        </div>
      )
    }
  }

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
        <h1>Register</h1>
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
          <label htmlFor="user_type_1">Freelancer</label> <br/>
          <input id="user_type_2" type="radio" name="usertype" value="Client" checked={inputs['usertype']==="Client"} onClick={handleChange} />
          <label htmlFor="user_type_2">Client</label> <br/>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
  

  //Registration page extension, for freelancer
  function RegisterFreelancer()
  {
    /*del_education=()=>{
      console.log("val")
    }*/
    //handle form inputs
    const searchParams = new URLSearchParams(window.location.search); //extract search parameters from URL
    const username = searchParams.get('username'); //extract username


    const [education_details, set_education_details] = useState([]);
    const [skill_details, set_skill_details] = useState([]);
    const [social_details, set_social_details] = useState([]);
    const [inputs, set_inputs] = useState({});
    inputs["username"] = username;

    //clear the input fields for next entry
    useEffect(()=>{
      document.getElementById("degree").value="";
      document.getElementById("year_of_grad").value="";
    },[education_details]);

    useEffect(()=>{
      document.getElementById("skill").value="";
      document.getElementById("experience").value="";
    },[skill_details]);

    useEffect(()=>{
      document.getElementById("media").value="";
      document.getElementById("userhandle").value="";
    },[social_details]);


    //handles changes in input fields and hooks them with the `inputs` variable
    const handleChange = (e) => {
      e.preventDefault(); //prevents page refreshing after form submission
      const {name, value} = e.target; //destructuring assignment to extract name and value from target DOM element
      set_inputs({...inputs, [name]:value});
      console.log("x"+name+" "+value);
    }

    //handles submission of form and connects to the backend
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Form submitted");
      console.log("inputs" + JSON.stringify(inputs));
      inputs["educations"] = JSON.stringify(education_details);
      inputs["skills"] = JSON.stringify(skill_details);
      inputs["socials"] = JSON.stringify(social_details);
      console.log("inputs" + JSON.stringify(inputs));
      console.log(education_details.length + " " + JSON.stringify(education_details));
      const serverUrl = "http://localhost:3000/register_freelancer"; //server endpoint to handle form inputs

      try {
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputs),
        });

        if (response.ok)
        {
          console.log("successfully submitted");
          alert("Registration successful, you will be redirected to the home page");
        }
        else 
        {
          console.log("didn't submit");
        }
      }
      catch (err) 
      {
        console.error(err);
      }
      document.location = "/"
    }

    const add_education = (e) => {
      e.preventDefault(); //prevents page refreshing after form submission

      //extract values from input fields
      const degree_val = document.getElementById("degree").value;
      const year_of_grad_val = document.getElementById("year_of_grad").value;
      console.log(degree_val + " " + year_of_grad_val);

      //Create new entries for entered details if input area is not empty 
      if(degree_val && year_of_grad_val)
      {
        const new_education = {"degree":degree_val, "year_of_grad": year_of_grad_val};
        set_education_details([...education_details,new_education]);
        console.log(JSON.stringify(education_details)+"xx");     
      
        //add each entry as a list element
        const edu_div = document.createElement("div");
        edu_div.innerHTML = '<input type="text" class="degree_list ' + degree_val + '" value=' + degree_val + '></input> <input class="year_list ' + year_of_grad_val + '" type="text" value=' + year_of_grad_val + '></input><button class="delete_edu ' + degree_val + '">Delete</button>';
        const edu_list = document.getElementById("education_list");
        edu_list.appendChild(edu_div);
      }
    }

    const add_skill = (e) => {
      e.preventDefault(); //prevents page refreshing after form submission

      //extract values from input fields
      const skill_val = document.getElementById("skill").value;
      const experience_val = document.getElementById("experience").value;
      console.log(skill_val+" "+experience_val);

      //Create new entries for entered details if input area is not empty 
      if(skill_val && experience_val)
      {
        const new_skill = {"skill":skill_val, "experience": experience_val};
        set_skill_details([...skill_details,new_skill]);
        console.log(JSON.stringify(skill_details)+"xx");
       
        //add each entry as a list element
        const skill_div = document.createElement("div");
        skill_div.innerHTML = '<input type="text" class="skill_list ' + skill_val + '" value=' + skill_val + '></input> <input class="experience_list ' + experience_val + '" type="text" value=' + experience_val + '></input><button class="delete_edu ' + skill_val + '">Delete</button>';
        const skillset_list = document.getElementById("skillset_list");
        skillset_list.appendChild(skill_div);
      }
    }

    const add_social = (e) => {
      e.preventDefault(); //prevents page refreshing after form submission

      //extract values from input fields
      const media_val = document.getElementById("media").value;
      const userhandle_val = document.getElementById("userhandle").value;
      console.log(media_val+" "+userhandle_val);     

      //Create new entries for entered details if input area is not empty 
      if(media_val && userhandle_val)
      {
        const new_social = {"media":media_val, "userhandle": userhandle_val};
        set_social_details([...social_details,new_social]);
        console.log(JSON.stringify(social_details)+"xx");
        
        //add each entry as a list element
        const social_div = document.createElement("div");
        social_div.innerHTML = '<input type="text" class="media_list ' + media_val + '" value=' + media_val + '></input> <input class="userhandle_list ' + userhandle_val + '" type="text" value=' + userhandle_val + '></input><button class="delete_edu ' + media_val + '">Delete</button>';
        const social_list = document.getElementById("social_list");
        social_list.appendChild(social_div);
      }
    }

    //Page to be rendered on invoking the RegisterFreelancer component
    return (
        <div>
          <h1>Freelancer</h1>
          <form id="reg_f_form" onSubmit={handleSubmit}>
            <label className='reg_f_label'>Date of Birth</label> <input id="dob" className="reg_f_input" type="date" name="dob" value={inputs.dob} onChange={handleChange} /> <br/>
            <label className='reg_f_label'>Country</label> <input id="country_f" className="reg_f_input" type="text" name="country" value={inputs.country} onChange={handleChange} /> <br/>
            <div id="educations">
              <label className='reg_f_label'>Education</label> <input id="degree" className="reg_f_input" type="text" name="degree" placeholder="degree" /> <input id="year_of_grad" className="reg_f_input" type="text" name="year_of_grad" placeholder="year of  graduation" /> <br/>
              <li id="education_list"></li>
              <button id="add_education" className="add_button" onClick={add_education}>Add Education</button>
            </div>
            <div id="skills">
              <label className='reg_f_label'>Skill Set</label> <input id="skill" className="reg_f_input" type="text" name="skill" placeholder="skill" />
              <label for="experience"></label>
              <select id="experience" className="reg_f_input" name="experience">
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select><br/>
              <li id="skillset_list"></li>
              <button id="add_skill" className="add_button" onClick={add_skill}>Add Skill</button>
            </div>
            <div id="social_profiles">
              <label className='reg_f_label'>Social Profile</label> <input id="media" className="reg_f_input" type="text" name="media" placeholder="media" /> <input id="userhandle" className="reg_f_input" type="text" name="userhandle" placeholder="userhandle" /><br/>
              <li id="social_list"></li>
              <button id="add_social" className="add_button" onClick={add_social}>Add Social</button>
            </div>    
            <input className="submit_button" type="submit" name="submit" value="Submit" />
          </form>
        </div>
      );
  }

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
        <h3>Login Page</h3>
        <form id="login_form" onSubmit={handleSubmit}>
          <label className='reg_label'>Username</label> &nbsp;
          <input id="login-username" className="reg_input" type="text" name="username" value={inputs.username} onChange={handleChange} required /> <br/>      
          <label className='reg_label'>Password</label> &nbsp;
          <input id="login-password" className="reg_input" type="password" name="password" value={inputs.password} onChange={handleChange} required /> <br/>
          <button className="login_button" type="submit">Login</button>
        </form>
      </div>
    )
  }

  
  //Main return which renders, calls and routes the components on running npm start
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home></Home>}></Route>
          <Route path="/register" element={<RegistrationForm></RegistrationForm>}></Route>
          <Route path="/register_freelancer" element={<RegisterFreelancer></RegisterFreelancer>}></Route>
          <Route path="/register_client" element={<RegisterClient></RegisterClient>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
        </Routes>
      </Router>
   </div>
  );
}

export default App;
