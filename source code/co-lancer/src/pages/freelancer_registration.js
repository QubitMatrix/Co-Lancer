import '../App.css';
import React, {useState, useEffect} from 'react'

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
                <option value="Basic" selected >Basic</option>
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
export default RegisterFreelancer;