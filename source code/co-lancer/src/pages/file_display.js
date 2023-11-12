import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PdfDisplay = () => {
  //State variable for pdf data
  const [pdfData, setPdfData] = useState(null);

  //use states from previous component
  const {state} = useLocation();
  console.log("state"+state.title)

  useEffect(() => {
    // Replace 'pdfId' with the ID of the PDF you want to display
    const pdfId = state["title"]; // Change this to the desired PDF ID

    //Hit backend to retrieve file data
    fetch(`http://localhost:3000/display_pdf/${pdfId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        const pdfUrl = URL.createObjectURL(blob);
        setPdfData(pdfUrl);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  //Render the pdf in a iframe
  return (
    <div>
      <h2>PDF Display</h2>
      {pdfData && (
        <iframe
          src={pdfData}
          title="Uploaded PDF"
          width="100%"
          height="500px"
        />
      )}
    </div>
  );
};

export default PdfDisplay;
