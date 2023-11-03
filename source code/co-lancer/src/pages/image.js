import React, { useState } from 'react';


const ImageUpload = (props) => {
  const [file, setFile] = useState(null);
  console.log("fid"+props.f_id);

  const handleFileChange = (e) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    //FormData object to store picture details
    const formData = new FormData();
    formData.append('profile_pic', file);
    formData.append('username', props.username);

    //Connect to backend to store file in database
    fetch('http://localhost:3000/upload_profile', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert('File uploaded successfully. You will be now be redirected to home page!');
        document.location = "/";
      })
      .catch((error) => {
        console.error(error);
        alert('File upload failed.');
      });
  };

  //Render file upload 
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ImageUpload;
