import '../App.css';
import React, {useState, useEffect} from 'react'
import FileUpload from './file';
import { useLocation } from 'react-router-dom';
import server_url from './endpoint'

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
      //Highlight radiobutton
      if(name === "collab" && value === "NO")
        document.getElementById("collab_n").innerHTML=`<input id="collab_no" type="radio" name="collab" value="NO" checked onClick={handleChange} />`;
      if(name === "collab" && value === "YES")
        document.getElementById("collab_y").innerHTML=`<input id="collab_yes" type="radio" name="collab" value="YES" checked onClick={handleChange} required/>`;
    }

    const handleSubmit = async(e) => {
      e.preventDefault();
      console.log("Form submitted");
      console.log("inputs"+JSON.stringify(inputs));

      const serverUrl = server_url+"/publish"; //url to hit backend and get a response
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
          const data = await response.json();
          alert(data.Message);
          
          //Display upload option
          const div1 = document.getElementById("upload_project_pdf")
          div1.style.display="block";
        }
      }

      catch(err)
      {
        alert("Server unreachable, try again later."+err);
      }
    }

    //Page rendered for creating a new project
    return(<div id="project_page">
            <form id="create_new_project" onSubmit={handleSubmit}>
                <label>Title</label> <br/><input className='reg_input' type="text" name="title" value={inputs.title} placeholder="Project Title" onChange={handleChange} required /> <br/>
                <label>Description</label> <br/> <input className='reg_input' type="textarea" name="description" value={inputs.description} placeholder="Project Description" onChange={handleChange} required /> <br/>
                <label>Domains</label> <br/> <input className='reg_input' type="textarea" name="tags" value={inputs.tags} placeholder="Project Domains" onChange={handleChange} required /> <br/>
                <label>Skills</label> <br/> <input className='reg_input' type="textarea" name="skills" value={inputs.skills} placeholder="Project Skills" onChange={handleChange} required /> <br/>
                <label>Budget(Rs.)</label> <br/> <input className='reg_input' type="number" name="budget" value={inputs.budget} placeholder="Project Budget" onChange={handleChange} required /> <br/>
                <label>Timeline(Days)</label> <br/> <input className='reg_input' type="number" name="timeline" value={inputs.timeline} placeholder="Project Timeline" onChange={handleChange} required /> <br/>
                <label>Collaboration?</label><br/>
                <div id="collab_y">
                  <input id="collab_yes" type="radio" name="collab" value="YES" onClick={handleChange} required />
                </div>
                <label className='collab_label' htmlFor="collab_yes">YES</label> <br/>
                <div id="collab_n">
                  <input id="collab_no" type="radio" name="collab" value="NO" onClick={handleChange} />
                </div>
                <label className='collab_label' htmlFor="collab_no">NO</label> <br/> <br/>
                <button className='button' type="submit">Publish</button>
            </form> 
            <br/>
            <div id="upload_project_pdf">
                <FileUpload project_title={inputs.title} />
                <br/><br/><br/>
            </div>
        </div>
    )
}

export default CreateProject;