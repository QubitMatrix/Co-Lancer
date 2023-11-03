import '../App.css';
import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import ImageDisplay from './image_display';

//Profile page view of client
function ClientProfile()
{
    
    const {state} = useLocation();
    const username=state.username;

    const navigate = useNavigate();    

    //set profile page values
    const [profile, setProfile] = useState(null);
    
    //Get the client details from backend
    useEffect(() => {
      async function fetchData() 
      {
        try 
        {
          const response = await fetch("http://localhost:3000/client_profile", {
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

    //Extract project details and format it into a list
    const aggregate_existing_projects = () => {
      if(profile !== null)
      {
        var projects = profile.existing_projects;
        console.log(projects);
      } 
      else
      {
        projects = [];
      }
      for(let i=0;i<projects.length;i++)
      {
        existing_projects_arr.push(<li>{projects[i][0]} - {projects[i][1]} - {projects[i][2]}</li>);
      }
    }
    var existing_projects_arr=[];
    aggregate_existing_projects();

    //Page rendered for client profile
    return (
        <div id="client_profile">
            <div id="details">
                <ImageDisplay imageId={username}/>
                <h2>Name: {profile?profile.person_name:''}</h2>
                <h3>Username: {username}</h3>
                <h3>Organization: {profile?profile.company:''} </h3>
                <h4>Existing projects</h4>
                <ul>
                    {existing_projects_arr}
                </ul>
                <button onClick={()=>navigate("/create_project", {state:{username:username}})}>Create New Project</button>
            </div>
        </div>
    )
}

export default ClientProfile;