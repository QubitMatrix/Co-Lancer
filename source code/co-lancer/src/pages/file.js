import React, {useState} from 'react';
import server_url from './endpoint'

function FileUpload(props) 
{ 
    const [file, setFile] = useState(null);
    
    //Handle adding new file
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        console.log(selectedFile); 
        setFile(selectedFile);
    }

    //Handle uploading of file
    const handleUpload = (e) => {
        e.preventDefault();

        if(file)
        {
            //FormData object to store file details
            const formData = new FormData();
            console.log("Filesize"+file.type)
            if(file.size > 3145728)
            {
                alert("Max size is 3MB");
                return;
            }
            if(file.type !== "application/pdf")
            {
                alert("Only pdf allowed");
                return;
            }
            formData.append('pdf', file);
            formData.append('project_title', props.project_title)

            //Post the file to backend to save into database
            fetch(server_url+'/upload_pdf', {
            method: 'POST',
            body: formData,
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                alert('PDF uploaded successfully.');
            })
            .catch((error) => {
                console.error(error);
                alert('PDF upload failed.');
            });
        }

        else
        {
            alert("Choose a file");
        }

    }

    //Render file upload
    return (
        <div>
            <input type="file" accept="application/pdf" name="requirements" onChange={handleFileChange} />
            <button className='b_upload' onClick={handleUpload}>Upload</button>
        </div>
    );
}

export default FileUpload;