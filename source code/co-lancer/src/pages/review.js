import '../App.css';
import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';

//Review page for individual freelancer
function Review()
{
    //React hook to store feedback retrieved from the backend
    const [feedback, setFeedback] = useState(null);
    const {state} = useLocation();
    console.log("state"+" : "+state["f_id"])
    
    //Create an useEffect hook to map a change in the username value to send a query to backend (call fetchData())
    useEffect(() => {
        async function fetchData()
        {
            try
            {
                const serverUrl = "http://localhost:3000/get_reviews";

                //send a request to backend and wait for a response before proceeding
                const response = await fetch(serverUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({"f_id": state["f_id"]}),
                });

                if(!response.ok)
                {
                    throw new Error("HTTP error, " + response.status);
                }
                else
                {
                    var data = await response.json();
                    setFeedback(data);
                }   
            }
            catch(err)
            {
                alert("Server unreachable, try later."+err);
            }   
        }
        fetchData();
    }, []);


    //format the JSON format into displayable content
    const format_reviews = () => {
        if(feedback !==null) 
        {
            var client_IDs = feedback.clients;
            var reviews = feedback.reviews;
            var ratings = feedback.ratings;
        }
        else
        {
            client_IDs = [];
            reviews = [];
            ratings = [];
        }

        for(let i=0;i<client_IDs.length;i++)
        {
            review_arr.push(<li> <div className='review_card'> <b>{client_IDs[i]} </b> <br/> {reviews[i]} <br/>Cookies: {ratings[i]} </div></li>)
        }
        console.log("no. of reviews"+review_arr.length)
    }

    var review_arr = [];
    format_reviews();

    return( 
        <div id="review">
            <h1 className='text-4xl pt-4 pl-5 font-semibold'>Reviews</h1>
            <ul className='review_box'>
                {review_arr}
            </ul>
        </div>
    );
}

export default Review;