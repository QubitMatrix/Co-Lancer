import './App.css';
import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

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
          <div>Colancer</div>
          <button id="reg_button" onClick={()=>document.location="/register"}>Register</button>
          <button id="login_button" onClick={()=>document.location="/login"}>Login</button>
        </div>
      )
    }
  }

  //User registration page
  class Register extends React.Component
  {
    render()
    {
      return (
        <div>
          <h1>Register</h1>
          <form id="reg_form">
            <label className='reg_label'>Name</label> <input id="name" className="reg_input" type="text" name="name" required></input><br/>
            <label className='reg_label'>Email ID</label> <input id="email_id" className="reg_input" type="email" name="email_id" required></input><br/>
            <label className='reg_label'>Password</label> <input id="password" className="reg_input" type="password" name="password" required></input><br/>
            <label className='reg_label'>Username</label> <input id="username" className="reg_input" type="text" name="username" required></input><br/>
            <label className='reg_label'>Are you a: </label><br/>
            <input id="user_type_1" type="radio" name="user_type" value="Freelancer" onClick={()=>document.location="/reg_freelancer"}></input>
            <label for="user_type_1">Freelancer</label><br/>
            <input id="user_type_2" type="radio" name="user_type" value="Client" onClick={()=>document.location="/reg_client"}></input>
            <label for="user_type_2">Client</label><br/>
          </form>
        </div>
      )
    }
  }

  //Registration page extension, for freelancer
  class Register_freelancer extends React.Component
  {
    /*del_education=()=>{
      console.log("val")
    }*/
    add_education=()=>{
      //extract values from input fields
      const degree_val=document.getElementById("degree").value
      const grad_year_val=document.getElementById("year_of_grad").value
      console.log(degree_val+" "+grad_year_val)

      //clear the input fields for next entry
      document.getElementById("degree").value=""
      document.getElementById("year_of_grad").value=""

      
      //Create new entries for entered details if input area is not empty 
      if(degree_val && grad_year_val)
      {
        const edu_div=document.createElement("div")
        edu_div.innerHTML='<input type="text" class="degree_list '+degree_val+'" value='+degree_val+'></input> <input class="year_list '+grad_year_val+'" type="text" value='+grad_year_val+'></input><button class="delete_edu '+degree_val+'">Delete</button>'
        const edu_list=document.getElementById("education_list")
        edu_list.appendChild(edu_div)
      }
    }

    add_skill=()=>{
      //extract values from input fields
      const skill_val=document.getElementById("skill").value
      const experience_val=document.getElementById("experience").value
      console.log(skill_val+" "+experience_val)

      //clear the input fields for next entry
      document.getElementById("skill").value=""
      document.getElementById("experience").value=""

      //Create new entries for entered details if input area is not empty 
      if(skill_val && experience_val)
      {
        const skill_div=document.createElement("div")
        skill_div.innerHTML='<input type="text" class="skill_list '+skill_val+'" value='+skill_val+'></input> <input class="experience_list '+experience_val+'" type="text" value='+experience_val+'></input><button class="delete_edu '+skill_val+'">Delete</button>'
        const skillset_list=document.getElementById("skillset_list")
        skillset_list.appendChild(skill_div)
      }
    }

    add_social=()=>{
      //extract values from input fields
      const media_val=document.getElementById("media").value
      const userhandle_val=document.getElementById("userhandle").value
      console.log(media_val+" "+userhandle_val)

      //clear the input fields for next entry
      document.getElementById("media").value=""
      document.getElementById("userhandle").value=""

      //Create new entries for entered details if input area is not empty 
      if(media_val && userhandle_val)
      {
        const social_div=document.createElement("div")
        social_div.innerHTML='<input type="text" class="media_list '+media_val+'" value='+media_val+'></input> <input class="userhandle_list '+userhandle_val+'" type="text" value='+userhandle_val+'></input><button class="delete_edu '+media_val+'">Delete</button>'
        const social_list=document.getElementById("social_list")
        social_list.appendChild(social_div)
      }
    }

    //Page to be rendered on invoking the Register_freelancer component
    render()
    {
      return (
        <div>
          <h1>Freelancer</h1>
          <form id="reg_f_form">
            <label className='reg_f_label'>Date of Birth</label> <input id="dob" className="reg_f_input" type="date" name="dob"></input><br/>
            <label className='reg_f_label'>Country</label> <input id="country_f" className="reg_f_input" type="text" name="country"></input><br/>
            <div id="educations">
              <label className='reg_f_label'>Education</label> <input id="degree" className="reg_f_input" type="text" name="degree" placeholder="degree"></input><input id="year_of_grad" className="reg_f_input" type="text" name="year_of_grad" placeholder="year of  graduation"></input><br/>
              <li id="education_list"></li>
              <button id="add_education" className="add_button" onClick={this.add_education}>Add Another Education</button>
            </div>
            <div id="skills">
              <label className='reg_f_label'>Skill Set</label> <input id="skill" className="reg_f_input" type="text" name="skill" placeholder="skill"></input>
              <label for="experience"></label>
              <select id="experience" className="reg_f_input" name="experience">
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select><br/>
              <li id="skillset_list"></li>
              <button id="add_skill" className="add_button" onClick={this.add_skill}>Add Another Skill</button>
            </div>
            <div id="social_profiles">
              <label className='reg_f_label'>Social Profile</label> <input id="media" className="reg_f_input" type="text" name="media" placeholder="media"></input><input id="userhandle" className="reg_f_input" type="text" name="userhandle" placeholder="userhandle"></input><br/>
              <li id="social_list"></li>
              <button id="add_social" className="add_button" onClick={this.add_social}>Add Another Social</button>
            </div>    
            <input className="submit_button" type="submit" name="submit" value="Submit"></input>
          </form>
        </div>
      )
    }
  }

  //Registration page extension, for client
  class Register_client extends React.Component
  {
    render()
    {
      return (
        <div>
          <h1>Client</h1>
          <form id="reg_c_form">
            <label className="reg_c_label">Country</label><input id="country_c" className="reg_c_input" type="text" name="country_c"></input><br/>
            <label className="reg_c_label">Company</label><input id="company" className="reg_c_input" type="text" name="company"></input><br/>
            <input className="submit_button" type="submit" name="submit" value="Submit"></input>
          </form>
        </div>
      )
    }
  }

  //Main return which renders, calls and routes the components on running npm start
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home></Home>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route path="/reg_freelancer" element={<Register_freelancer></Register_freelancer>}></Route>
          <Route path="/reg_client" element={<Register_client></Register_client>}></Route>
        </Routes>
      </Router>
   </div>
  );
}

export default App;
