import './App.css';
import React from 'react'
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
import PdfDisplay from './pages/file_display';
import CreateProject from './pages/create_project';
import ChatPage from './pages/chat_page'
import MonthlyRecap from './pages/monthly_recap'
import Payment from './pages/payment'

//main function called at runtime
function App() 
{
  //Home page

  class Home extends React.Component
  {
    
    render()
    {
      return (
        <div>
          
        <section id="data_warning">
          <p>This website is currently a sample project undergoing testing. For your safety, please use fake data instead of real information while interacting with the platform. We cannot guarantee the security of personal information at this stage.</p>
        </section>
        <div className='grid grid-cols-1 gap-4 place-items-center pt-44' id="home">
          
          <h3 className='text-4xl font-bold place-self-center'>Colancer</h3>
          <p style={{'font-size':'larger'}}>Elevate Your Freelance Game With <b>CO-LANCER</b><br/><i>Collaborate To Thrive!!!</i></p>
          <div className='grid grid-cols-2 gap-4 place-items-center pt-10'>
            <button className='button' id="reg_button" onClick={()=>document.location="/register"}>Register</button>
            <button className='button' id="login_button" onClick={()=>document.location="/login"}>Login</button>
          </div>
        </div>
        <section id="footer">&copy;2023 Colancer <br/><img id="github-img" src="https://img.icons8.com/material-outlined/48/null/github.png" alt="github icon"/><a href="https://github.com/QubitMatrix/Co-Lancer">Source code</a></section>
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
          <Route path="/reviews" element={<Review></Review>}></Route>
          <Route path="/projects" element={<ProjectPage></ProjectPage>}></Route>
          <Route path="/project_details" element={<ProjectDetails></ProjectDetails>}></Route>
          <Route path="/project_pdf" element={<PdfDisplay></PdfDisplay>}></Route>
          <Route path="/create_project" element={<CreateProject></CreateProject>}></Route>
          <Route path="/chat" element={<ChatPage></ChatPage>}></Route>
          <Route path="/monthly_recap" element={<MonthlyRecap></MonthlyRecap>}></Route>
          <Route path="/payment" element={<Payment></Payment>}></Route>
        </Routes>
      </Router>
   </div>
  );
}


export default App;
