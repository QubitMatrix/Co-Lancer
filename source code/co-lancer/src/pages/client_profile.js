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
    
    //state variable to store inputs
    const [inputs, setInputs] = useState([]);
    
    //Handle finalizing of project from client
    const handleFinalizeClick = async (project_id) => {
      console.log("abc"+project_id);

      const serverUrl = "http://localhost:3000/finalize_project";
      try 
      {
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"project_id":project_id}),
        });

        if(response.ok)
        {
          console.log("successfully reviewed");
        }
        else
        {
          console.log("didn't submit");
        }
      }
      catch(err)
      { 
        console.error(err);
      }
    }

    //Handle return of project ffrom client
    const handleReturnClick = async (project_id) => {
      console.log("abc"+project_id);

      const serverUrl = "http://localhost:3000/return_project";
      try 
      {
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"project_id":project_id}),
        });

        if(response.ok)
        {
          console.log("successfully returned");
        }
        else
        {
          console.log("didn't submit");
        }
      }
      catch(err)
      { 
        console.error(err);
      }
    }

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

          else
          {
            //Wait till the server gives the reply and then use that data
            const data = await response.json();
            setProfile(data);
            console.log(JSON.stringify(data));
          }
        } 
        catch(err)
        {
          console.error(err);
        }
      }
      fetchData();
    }, [username]);

    //Handle when feedback is submitted
    const handleFeedbackSubmit = async (e,project_id,index) => {
      e.preventDefault();
      console.log(index);
      console.log("Feedback"+project_id+inputs.review+inputs.rating+username);
      const serverUrl = "http://localhost:3000/give_feedback";

      try
      {
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "username": username, "project_id": project_id, "review": inputs.review, "rating": inputs.rating }),
          });

          if(!response.ok)
          {
            throw new Error("HTTP error, " + response.status);
          }
          else
          {
            console.log(response.json());
          }
      }
      catch(err)
      {
        console.error(err);
      }
      document.getElementsByClassName("feedback_div")[index].style.display="none";
    }

    //Handle change of value in inputs
    const handleChange = (e) => {
      e.preventDefault();
      const {name, value}=e.target;
      setInputs({...inputs,[name]:value});
    }


    //Handle click to give feedback, makes feedback form visible
    const handleFeedbackClick = (count) => {
      console.log("count"+count);
      document.getElementsByClassName("feedback_div")[count].style.display="block";
    }

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
      for(let i=0,j=-1;i<projects.length;i++)
      {
        if(projects[i][4] !== null && projects[i][3] === 'In Progress') //If url field is not null and the project status is in progress, then client has to review the submission and decide
        {
          j+=1;
          review_projects_arr.push(
          <li>
            <h5>{projects[i][1]}</h5> 
            <p>{projects[i][2]}</p> 
            <p>{projects[i][4]}</p> 
            <button id="finalize_project" className="button" onClick={()=>handleFinalizeClick(projects[i][0])}>Finalize</button> 
            <button id="return_project" className="button" onClick={()=>handleReturnClick(projects[i][0])}>Return For revision</button>
            <button className="button" onClick={()=>{handleFeedbackClick(j)}}>Feedback</button>
            <div className="feedback_div">
              <form onSubmit={(e) => handleFeedbackSubmit(e,projects[i][0],j)}>
                <input type="textarea" placeholder="Provide your feedback" onChange={handleChange} name="review" value={inputs.review} required/>
                <input type="number" min="1" max="10" defaultValue="1" name="rating" value={inputs.rating} onChange={handleChange}/> 
                <button className="button" type="submit">Submit Feedback</button>
              </form>
            </div>
          </li>);
        }
        else
        {
          existing_projects_arr.push(<li><h5>{projects[i][1]}</h5> <p>{projects[i][2]}</p> <p>{projects[i][4]}</p> </li>);
        }
      }
    }
    var existing_projects_arr=[];
    var review_projects_arr=[];
    aggregate_existing_projects();

    //Page rendered for client profile
    return (
        <div id="client_profile">
            <div id="details">
                <ImageDisplay imageId={username}/>
                <h3>Name: {profile?profile.person_name:''}</h3>
                <h4>Username: {username}</h4>
                <h4>Organization: {profile?profile.company:''} </h4>
                <h4>Existing projects</h4>
                <ul>
                    {existing_projects_arr}
                </ul>
                <h4>Review projects</h4>
                <ul>
                    {review_projects_arr}
                </ul>
                <br/>
                <button className="button" onClick={()=>navigate("/create_project", {state:{username:username}})}>Create New Project</button>
            </div>
        </div>
    )
}

export default ClientProfile;