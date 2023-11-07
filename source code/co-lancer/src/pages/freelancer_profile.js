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
    const navigate = useNavigate()

    //Access state details from previous component
    const {state} = useLocation();
    const username = state["username"];

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

          //Wait till the server gives the reply and then use that data
          const data = await response.json();
          setProfile(data);
          console.log(JSON.stringify(data));
        } 
        catch(err)
        {
          console.error(err);
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
        console.log(skills);
      } 
      else
      {
        skills = [];
      } 
      for(let i=0;i<skills.length;i++)
      {
        skills_arr.push(<li>{skills[i][0]} - {skills[i][1]}</li>);
      }
      console.log("abc"+skills_arr);
    }
    
    //Combine all the socials and insert into an unordered list
    const aggregate_socials = () => {
      if(profile !== null)
      {
        var socials = profile.socials;
        console.log(socials);
      } 
      else
      {
        socials = [];
      }
      for(let i=0;i<socials.length;i++)
      {
        socials_arr.push(<li>{socials[i][0]} - {socials[i][1]}</li>);
      }
      console.log("abc"+socials_arr);
    }

    //Combine all the current and completed projects and insert into unordered lists
    const aggregate_projects = () => {
      if(profile !== null)
      {
        var projects = profile.projects;
        console.log(projects);
      } 
      else
      {
        projects = [];
      }
      for(let i=0;i<projects.length;i++)
      {
        if(projects[i][3] === 'Completed')
          completed_projects_arr.push(<li>{projects[i][0]} - {projects[i][1]} - {projects[i][2]} - {projects[i][3]}</li>);
        else
          current_projects_arr.push(<li>{projects[i][0]} - {projects[i][1]} - {projects[i][2]} - {projects[i][3]}</li>);
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
          <br/>
        </div>
        <br/> <br/>
      </div>
    );
}

export default FreelancerProfile;

