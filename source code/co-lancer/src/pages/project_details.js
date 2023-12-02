import '../App.css';
import { useLocation, useNavigate } from 'react-router-dom';


//Detailed project view
function ProjectDetails()
{
    //Set up a navigate object for safer routing
    const navigate = useNavigate();

    //Access the states from previous location (in this case project details and freelancer_id from projects page)
    const {state} = useLocation();

    const project_state = state["project"];

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

    //call the aggregate function for forming each list
    aggregate(project_state[6]? project_state[6].split(",") : [],domains_arr);
    aggregate(project_state[7]? project_state[7].split(",") : [],skills_arr);
    aggregate(project_state[8]? project_state[8].split(",") : [],freelancers_arr);
    
    //Page rendered for project_details
    return(<div>
        <div className='project-dets'>
        <h2>{project_state[1]}</h2>
        <button id="view_pdf" onClick={()=>{navigate("/project_pdf", {state:{title:project_state[1]}})}}>View PDF</button><br/>
        <h3>Description</h3>
        <p>{project_state[2]}</p>
        <p><b>Budget</b><br/>{project_state[4]}</p>
        <p><b>Timeline</b><br/>{project_state[5]}</p>
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
    </div>
    <section id="footer">&copy;2023 Colancer <br/><img id="github-img" src="https://img.icons8.com/material-outlined/48/null/github.png" alt="github icon"/><a href="https://github.com/QubitMatrix/Co-Lancer">Source code</a></section>
    </div>)
}

export default ProjectDetails;