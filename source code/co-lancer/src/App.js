import './App.css';
import React, {useState, useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import RegistrationForm from './pages/user_register';
import RegisterFreelancer from './pages/freelancer_registration';
import RegisterClient from './pages/client_registration';
import Login from './pages/login';
import FreelancerProfile from './pages/freelancer_profile';
import ClientProfile from './pages/client_profile';
import Review from './pages/review';
import ProjectPage from './pages/projects';
import ProjectDetails from './pages/project_details';

//main function called at runtime
function App() 
{
  //Home page
  class Home extends React.Component
  {
    render()
    {
      return (
        <div id="home">
          <h1>Colancer</h1>
          <p>Elevate Your Freelance Game With <b>CO-LANCER</b><br/><i>Collaborate To Thrive!!!</i></p>
          <button id="reg_button" onClick={()=>document.location="/register"}>Register</button>
          <button id="login_button" onClick={()=>document.location="/login"}>Login</button>
        </div>
      )
    }
  }


  
  //Main return which renders, calls and routes the components on running npm start
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home></Home>}></Route>
          <Route path="/register" element={<RegistrationForm></RegistrationForm>}></Route>
          <Route path="/register_freelancer" element={<RegisterFreelancer></RegisterFreelancer>}></Route>
          <Route path="/register_client" element={<RegisterClient></RegisterClient>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/freelancer_profile" element={<FreelancerProfile></FreelancerProfile>}></Route>
          <Route path="/client_profile" element={<ClientProfile></ClientProfile>}></Route>
          <Route path="/monthly_recap" element={<FreelancerProfile></FreelancerProfile>}></Route>
          <Route path="/reviews" element={<Review></Review>}></Route>
          <Route path="/projects" element={<ProjectPage></ProjectPage>}></Route>
          <Route path="/project_details" element={<ProjectDetails></ProjectDetails>}></Route>
        </Routes>
      </Router>
   </div>
  );
}


export default App;
