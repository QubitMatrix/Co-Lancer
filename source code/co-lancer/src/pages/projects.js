import '../App.css';
import React, {useState, useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom';

//View projects page 
function ProjectPage() 
{
  const [domain, setDomain] = useState({domain_name:"all"}); //handle change of domain (for search bar)
  const [projects_arr, setProject_arr] = useState({ available_projects: [], completed_projects: []}); //handle project data recieved from backend

  //Render projects of all domain at initial loading
  useEffect(() => {
    handleSearch();
  }, []);

  //Access the states from previous location (in this case freelancer_id from profile page)
  const {state}= useLocation();
  const f_id = state["f_id"];

  //Handle change in searchbar
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setDomain({ ...domain, [name]: value });
  }

  //Handle final search
  const handleSearch = async (e) => {
    try
    {
      e.preventDefault();  //prevent page refreshing
    }
    catch
    {
    }
    finally 
    {
        //backend endpoint
        const serverUrl = "http://localhost:3000/projects";

        try 
        {
            console.log("Domain"+domain);
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(domain),
            });

            if (!response.ok) 
            {
              throw new Error("HTTP error, " + response.status);
            }

            else
            {
              const data = await response.json();
              if(data.Message !== undefined)
                alert(data.Message);
              aggregate_projects(data); //aggregate and process the project details
            }
        } 
        catch (err) 
        {
          alert("Server unreachable, try again later."+err);    
        }
    }
  }

  //Handle freelancer joining project
  const handleClick = async (e) => {
    e.preventDefault();
    
    const p_id = e.target.value; 
    console.log("Joining"+f_id+"-"+p_id);

    //backend endpoint
    const serverUrl = "http://localhost:3000/join_project";

    try 
    {
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({"p_id":p_id, "f_id":f_id}), //send the freelancer and project id to backend to insert
        });

        if (!response.ok) 
        {
            throw new Error("HTTP error, " + response.status);
        }

        else
        {
          const data = await response.json();
          alert(data["Message"]);
        }
    } 
    catch (err) 
    {
        alert("Server unreachable, try again."+err);
    }
  }

  //aggregate projects into respective lists and form project cards
  const aggregate_projects = (data) => {
    if (data && data.projects) 
    {
      const pro = data.projects;
      const arr1 = [];
      const arr2 = [];

      for (let i=0;i<pro.length;i++) 
      {
        var domain_tags = [];
        const domains = pro[i][6].split(",");

        //Retreive domain tags
        for(let j=0;j<domains.length;j++)
        {
            console.log("domains"+ domains[j]);
            domain_tags.push(<span className="tags">#{domains[j]}</span> )
        }
        if(pro[i][9] === 'YES')
            domain_tags.push(<span className="tags">#CollabNow</span>) //add CollabNow tag if needed

        //Extract available project and link to detailed project page
        if(pro[i][3] === 'Not Assigned' || (pro[i][3] === 'In Progress' && pro[i][9] === "YES"))
        {
            arr1.push(<div className="project_items">
                <li>
                    <Link to={`/project_details`} state={{"project": pro[i], "f_id": f_id}}><h4>{pro[i][1]}</h4></Link> 
                    <p>{pro[i][2]}</p>
                    <div>{domain_tags}</div>
                </li>
                <button value={pro[i][0]} id="join" onClick={handleClick}>Join Now</button>
            </div>);
        }

        //Extract completed project
        else
        {
            arr2.push(<div className="project_items">
                <li>
                    <Link to={`/project_details`} state={{"project": pro[i], "f_id": f_id}}><h4>{pro[i][1]}</h4></Link> 
                    <p>{pro[i][2]}</p>
                    <div>{domain_tags}</div>
                </li>
            </div>);
        }
      }
      setProject_arr({ available_projects: arr1, completed_projects: arr2 }); //use setstate and save the extracted projects
    }
  }

  //Page to be rendered for projects 
  return (
    <div id="project_page">
      <input type="text" name="domain_name" value={domain.domain_name} onChange={handleChange} required />
      <button id="searchbar" onClick={handleSearch}>Search</button>
      <h3>Available Projects</h3>
      <ul>
        {projects_arr.available_projects}
      </ul>
      <br/>
      <h3>Completed Projects</h3>
      <ul>
        {projects_arr.completed_projects}
      </ul>
    </div>
  )
}

export default ProjectPage;
