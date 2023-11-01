import '../App.css';
import { useLocation } from 'react-router-dom';

//Detailed project view
function ProjectDetails()
{
    //Access the states from previous location (in this case project details and freelancer_id from projects page)
    const {state} = useLocation();
    const project_state = state["project"];
    const f_id = state["f_id"];
    const p_id = project_state[0]

    var domains_arr = [];
    var skills_arr = [];
    var freelancers_arr = [];

    //Extract skills, domains and freelancers as lists from string format
    function aggregate (arr,field)
    {
        for(let i=0;i<arr.length;i++)
        {
            field.push(<li>{arr[i]}</li>)
        }
    }

    //Handle freelancer joining the project 
    const handleClick = async (e) => {
        e.preventDefault();
        
        //backend endpoint
        const serverUrl = "http://localhost:3000/join_project";

        try 
        {
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({"p_id":p_id, "f_id":f_id}),
            });

            if (!response.ok) 
            {
                throw new Error("HTTP error, " + response.status);
            }

            const data = await response.json();
            alert(data["Message"]);
        } 
        catch (err) 
        {
            console.error(err);
        }
    }


    //call the aggregate function for forming each list
    aggregate(project_state[7]? project_state[7].split(",") : [],domains_arr);
    aggregate(project_state[8]? project_state[8].split(",") : [],skills_arr);
    aggregate(project_state[9]? project_state[9].split(",") : [],freelancers_arr);


    console.log(domains_arr);

    //Page rendered for project_details
    return(<div>
        <h2>{project_state[1]}</h2>
        <h3>Description</h3>
        <p>{project_state[2]}</p>
        <p><b>Budget</b><br/>{project_state[4]}</p>
        <p><b>Timeline</b><br/>{project_state[5]}</p>
        <p><b>Requirements</b><br/>{project_state[6]}</p>
        <p><b>Domains</b></p>
        <ul>
            <li>{domains_arr}</li>
        </ul>
        <p><b>Skills</b></p>
        <ul>
            <li>{skills_arr}</li>
        </ul>
        <p><b>Freelancers</b></p>
        <ul>
            <li>{freelancers_arr}</li>
        </ul>
        <button id="join" onClick={handleClick}>Join Now</button>
    </div>)
}

export default ProjectDetails;