import '../App.css';
import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ImageDisplay from './image_display';
import { useNavigate } from 'react-router-dom';

//Freelancer profile page
function FreelancerProfile()
{
    //set profile page values
    const [profile, setProfile] = useState(null);
    
    //set state variable for inputs
    const [inputs, setInputs] = useState([]);

    const navigate = useNavigate()

    //Access state details from previous component
    const {state} = useLocation();
    const username = state["username"];

    //Handle change of value in textarea
    const handleChange = (e,pro_id) => {
      e.preventDefault(); //prevents page refreshing after form submission
      const { name, value } = e.target; // Destructuring assignment to extract name and value from target DOM element

      //Update the state only once with both new values
      setInputs(prevInputs => ({
        ...prevInputs,
        "url": value,
        "project_id": pro_id
      }));
    }

    //Handle submission of project
    const handleSubmit = async (e,count) => {
      e.preventDefault();
      console.log("count_submit"+count);

      const serverUrl = "http://localhost:3000/submit_project";
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
          const data = await response.json();
          alert(data.Message);
          if(data.Message.includes("Successfully"))
            document.getElementsByClassName("handoff_div")[count].style.display="none"; // Remove textarea and submit once it is submitted
        }
        else
        {
          alert("Couldn't handoff the project");
        }
      }
      catch(err)
      { 
        alert("Server unreachable, try agian later."+err);
      }
    }

    //Show textarea and submit button when freelancer wants to handoff project
    const handleHandoff = (count) => {
      console.log("count"+count);
      document.getElementsByClassName("handoff_div")[count].style.display = "block";
    }

    //Get the freelancer details from backend
    useEffect(() => {
      async function fetchData() 
      {
        try 
        {
          const response = await fetch("http://localhost:3000/freelancer_profile", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "username": username }),
          });

          if(!response.ok)
          {
            throw new Error("HTTP error, " + response.status);
          }

          else
          {
            //Wait till the server gives the reply and then use that data
            const data = await response.json();
            setProfile(data);
            console.log("Freelancer profile data"+JSON.stringify(data));
          }
        } 
        catch(err)
        {
          alert("Server unreachable, try again later")
        }
      }
      fetchData();
    }, [username]);


    var skills_arr = [];
    var socials_arr = [];
    var completed_projects_arr = [];
    var current_projects_arr = [];
    
    //Combine all the skills and insert into an unordered list
    const aggregate_skills = () => {
      if(profile !== null)
      {
        var skills = profile.skills;
      } 
      else
      {
        skills = [];
      } 
      for(let i=0;i<skills.length;i++)
      {
        skills_arr.push(<li>{skills[i][0]} - {skills[i][1]}</li>);
      }
      console.log("Skills div"+skills_arr);
    }
    
    //Combine all the socials and insert into an unordered list
    const aggregate_socials = () => {
      if(profile !== null)
      {
        var socials = profile.socials;
      } 
      else
      {
        socials = [];
      }
      for(let i=0;i<socials.length;i++)
      {
        socials_arr.push(<li>{socials[i][0]} - {socials[i][1]}</li>);
      }
      console.log("Socials div"+socials_arr);
    }

    //Combine all the current and completed projects and insert into unordered lists
    const aggregate_projects = () => {
      if(profile !== null)
      {
        var projects = profile.projects;
      } 
      else
      {
        projects = [];
      }
      for(let i=0,j=-1;i<projects.length;i++)
      {
        if(projects[i][3] === 'Completed')
        {  
          completed_projects_arr.push(<div>
            <li>
              <h4>{projects[i][1]}</h4> 
              <p>{projects[i][2]}</p>
            </li>
            </div>);
        }
        else
        { 
          j+=1;
          current_projects_arr.push(<div>
            <li>
              <h4>{projects[i][1]}</h4> 
              <p>{projects[i][2]}</p>
              <button className="handoff button" onClick={()=>handleHandoff(j)}>Handoff Project</button><br/>
              <div className="handoff_div">
                <input type='textarea' value={inputs.project_url} placeholder="Project link on github" onChange={(e) => handleChange(e,projects[i][0])} required /> 
                <button className="project_handoff button" onClick={(e)=>handleSubmit(e,j)}>Submit</button>
              </div>
            </li>
          </div>);
        }
      }
    }

    //call the functions to form the lists
    aggregate_skills();
    aggregate_socials();
    aggregate_projects();

    //Page rendered on freelancer profile
    return (
      <div id="freelancer_profile">
        <div className='f_details'>
          <div className='f_personal'>
            <ImageDisplay imageId={username}/>
            <h3>{username}</h3>
            <h4>Skill Set</h4>
            <ul>
              {skills_arr}
            </ul>
            <h4>Social Accounts</h4>
            <ul>
              {socials_arr}
            </ul>
          </div>
          <div>        
            <h4>Cookie Jar</h4>
            <p>{profile !== null ? profile.cookies : "Loading..."}</p>
            <button id="chat_button" onClick={() => navigate("/chat",{state:{username:username}})}>Chat</button>
          </div>
          <br/>
        </div>

        <div id="project_gallery">
          <div id="completed_projects">
            <h3>Completed Projects</h3>
            {completed_projects_arr}
          </div>
          <div id="current_projects">
            <h3>Current Projects</h3>
            {current_projects_arr}
          </div>
          <br/>
          <Link className="Link" id="monthly_recap" to={`/monthly_recap`} state={{"f_id":profile !==null? profile.freelancer_id : ""}}>Monthly Projects Recap</Link>
          <Link className="Link" id="reviews" to={`/reviews`} state={{"f_id":profile !== null? profile.freelancer_id : ""}}>Reviews and Feedback</Link> 
          <Link className="Link" id="view_projects" to ={`/projects`} state={{"f_id":profile !== null? profile.freelancer_id : ""}}>Explore Projects</Link>
          <br/><br/>
        </div>
        <br/> <br/>
      </div>
    );
}

export default FreelancerProfile;

