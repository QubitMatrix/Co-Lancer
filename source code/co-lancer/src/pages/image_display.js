import React, { useEffect, useState } from 'react';

function ImageDisplay (props) 
{
  const [imageData, setImageData] = useState(null);

  //Executed when the page is rendered
  useEffect(() => {
    //Connect to backend to retrieve the profile picture
    fetch(`http://localhost:3000/display_image/${props.imageId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob(); //Return the picture as a BLOB
      })
      .then((blob) => {
        const imageUrl = URL.createObjectURL(blob); //creating a temporary image url to display the picture
        setImageData(imageUrl); //Store the url in state variable imageData
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //Sub component that renders the profile image part of profile
  return (
    <div>
      <h2>Profile Picture</h2>
      {imageData && <img width="100px" height="100px" src={imageData} alt="Uploaded Image" />}
    </div>
  );
};

export default ImageDisplay;
