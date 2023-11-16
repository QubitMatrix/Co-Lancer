import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import server_url from './endpoint'

const MonthlyRecap = () =>{
    const {state} = useLocation();
    const [result, setResult] = useState([]);
    const f_id=state["f_id"];
    const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#AF19FF"];
    const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December']
    let monthIndex=(new Date().getMonth())
    const month=monthNames[monthIndex]
    console.log("recap:"+f_id)
    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
           return (
           <div
              className="custom-tooltip"
              style={{
                 backgroundColor: "#ffff",
                 padding: "5px",
                 border: "1px solid #cccc"
              }}
           >
              <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
           </div>
        );
     }
    }
    useEffect(() => {
        const getRecords = async () => {
          try {
            const response = await fetch(server_url+"/monthly_recap", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({'fid':f_id}),
            });
    
            if (!response.ok) {
              throw new Error("HTTP error:"+response.status);
            }
    
            const data = await response.json();
            setResult(data);
            console.log("monthly_recap:"+JSON.stringify(data))
          } catch (err) {
            console.error(err);
          }
        };
        getRecords();
      }, []);
      
      const pie_data=[{name:"completed",value:result.completed},
    {name:"in-progress",value:result.in_progress}]

    return(
    <div className='recap-div'>
            <h2>Monthly Recap</h2>
            <br/>
            <div className='recap-details'>
        <div className='pie-div'>
            <h3 className='pl-20 pt-4'>Projects Completed</h3>
        <PieChart width={630} height={450}>
        <Pie
         data={pie_data}
         color="#000000"
         dataKey="value"
         nameKey="name"
         cx="50%"
         cy="50%"
         outerRadius={120}
         fill="#8884d8"
      >
         {pie_data.map((entry, index) => (
            <Cell
               key={`cell-${index}`}
               fill={COLORS[index % COLORS.length]}
            />
         ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      </PieChart>
      </div>
      <div className='pie-div'>
        <h3 className='pl-20 pt-4'>Monthly Review {month}</h3>
        <br/><br/>
        <p className='pl-10 text-xl'>No. of projects: {result.month_proj}</p>
        <br/>
        <p className='pl-10 text-xl'>Monthly Earnings: {result.amount}</p>
      </div>
      </div>
    </div>
    );

}

export default MonthlyRecap;