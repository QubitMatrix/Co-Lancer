import React, { useEffect, useState } from 'react';
import server_url from './endpoint'

function ImageDisplay (props) 
{
  const [imageData, setImageData] = useState(null);

  //Executed when the page is rendered
  useEffect(() => {
    //Connect to backend to retrieve the profile picture
    fetch(`${server_url}/display_image/${props.imageId}`)
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
        alert(error);
      });
  }, []);

  //Sub component that renders the profile image part of profile
  return (
    <div>
      {imageData && <img className='rounded-full' width="100px" height="100px" src={imageData} alt="Uploaded Image" />}
    </div>
  );
};

export default ImageDisplay;
