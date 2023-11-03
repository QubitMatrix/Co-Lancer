import '../App.css';
import React, {useState, useEffect} from 'react'
import FileUpload from './file';
import { useLocation } from 'react-router-dom';

function CreateProject()
{
    //handle inputs
    const [inputs, setInputs] = useState({});

    //use state from previous component
    const {state} = useLocation();
    inputs["username"] = state.username;

    const handleChange = (e) => {
      e.preventDefault();
      const {name, value}=e.target;
      setInputs({...inputs,[name]:value});
    }

    const handleSubmit = async(e) => {
      e.preventDefault();
      console.log("Form submitted");
      console.log("inputs"+JSON.stringify(inputs));

      const serverUrl = "http://localhost:3000/publish"; //url to hit backend and get a response
      try
      {
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputs),
        });

        if(!response.ok)
        {
          throw new Error("HTTP error, " + response.status);
        }
        else
        {
          console.log("Project published");
          alert("Project published. You will now be required to upload the pdf");
          
          //Display upload option
          const div1 = document.getElementById("upload_project_pdf")
          div1.style.display="block";
        }
      }

      catch(err)
      {
        console.error(err);
      }
    }

    //Page rendered for creating a new project
    return(<div>
            <form id="create_new_project" onSubmit={handleSubmit}>
                <label>Title</label> <input type="text" name="title" value={inputs.title} placeholder="Project Title" onChange={handleChange} required /> <br/>
                <label>Description</label> <input type="textarea" name="description" value={inputs.description} placeholder="Project Description" onChange={handleChange} required /> <br/>
                <label>Domains</label> <input type="textarea" name="tags" value={inputs.tags} placeholder="Project Domains" onChange={handleChange} required /> <br/>
                <label>Skills</label> <input type="textarea" name="skills" value={inputs.skills} placeholder="Project Skills" onChange={handleChange} required /> <br/>
                <label>Budget(Rs.)</label> <input type="number" name="budget" value={inputs.budget} placeholder="Project Budget" onChange={handleChange} required /> <br/>
                <label>Timeline(Days)</label> <input type="number" name="timeline" value={inputs.timeline} placeholder="Project Timeline" onChange={handleChange} required /> <br/>
                <label>Collaboration?</label><br/>
                <input id="collab_yes" type="radio" name="collab" value="YES" checked={inputs.collab==="YES"} onClick={handleChange} />
                <label className='collab_label' htmlFor="collab_yes">YES</label> <br/>
                <input id="collab_no" type="radio" name="collab" value="NO" checked={inputs.collab==="NO"} onClick={handleChange} />
                <label className='collab_label' htmlFor="collab_no">NO</label> <br/> <br/>
                <button type="submit">Publish</button>
            </form> 
            <div id="upload_project_pdf">
                <FileUpload project_title={inputs.title} />
            </div>
        </div>
    )
}

export default CreateProject;