import '../App.css';
import React, {useState, useEffect} from 'react'


//Freelancer profile page
function FreelancerProfile()
{
    //Extract username from the URL
    const searchParams = new URLSearchParams(window.location.search); //extract search parameters from URL
    const username = searchParams.get('username'); //extract username
    
    //set profile page values
    const [profile, setProfile] = useState(null);

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

    //Combine all the completed projects and insert into an unordered list
    const aggregate_completed_projects = () => {
      if(profile !== null)
      {
        var projects = profile.completed_projects;
        console.log(projects);
      } 
      else
      {
        projects = [];
      }
      for(let i=0;i<projects.length;i++)
      {
        completed_projects_arr.push(<li>{projects[i][0]} - {projects[i][1]} - {projects[i][2]} - {projects[i][3]}</li>);
      }
    }

    //Combine all the current projects and insert into an unordered list
    const aggregate_current_projects = () => {
      if(profile !== null)
      {
        var projects = profile.current_projects;
        console.log(projects);
      } 
      else
      {
        projects = [];
      }
      for(let i=0;i<projects.length;i++)
      {
        current_projects_arr.push(<li>{projects[i][0]} - {projects[i][1]} - {projects[i][2]} - {projects[i][3]}</li>);
      }
    }

    //call the functions to form the lists
    aggregate_skills();
    aggregate_socials();
    aggregate_completed_projects();
    aggregate_current_projects();

    //Page rendered on freelancer profile
    return (
      <div id="freelancer_profile">
        <h3>Username: {username}</h3>
        <h4>Skill Set</h4>
        <ul>
          {skills_arr}
        </ul>
        <h4>Social Accounts</h4>
        <ul>
          {socials_arr}
        </ul>
        <h4>Cookie Jar</h4>
        <p>{profile !== null ? profile.cookies : "Loading..."}</p>
        <button id="chat_button" onClick={() => document.location="/chat"}>Chat</button>
        <div id="project_gallery">
          <div id="completed_projects">
            <h3>Completed Projects</h3>
            {completed_projects_arr}
          </div>
          <div id="current_projects">
            <h3>Current Projects</h3>
            {current_projects_arr}
          </div>
        </div>
        <button id="monthly_recap" onClick={() => document.location="/monthly_recap?username="+username}>Monthly Projects Recap</button>
        <button id="reviews" onClick={() => document.location="/reviews?username="+username}>Reviews and Feedback</button>
      </div>
    );
}

export default FreelancerProfile;

