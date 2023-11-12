const bcrypt = require('bcryptjs');
const express = require('express');
const db = require("./config/db.js");
const multer = require('multer');
const cors = require('cors');
const validate = require("./validate.js");

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });
//let final_msg=null
const PORT = 3000;
app.use(cors());
app.use(express.json());

/*var http = require('http').Server(app);
const PORT_CHAT = 4000;
var socketIO = require('socket.io')(http, {
    cors:{
        origin: "http://localhost:3001"
    }
});


http.listen(PORT_CHAT, () => {
    console.log(`listening on *:${PORT_CHAT}`);
});

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('message',(data) => {
        final_msg=data
        console.log(final_msg);
    });
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
});*/


//Database users 
db_admin = db.db_admin;
db_client = db.db_client;
db_freelancer = db.db_freelancer;
db_user = db.db_user;

//Connecting to the database
db_client.connect(function(err) {
    if(err) throw err;
    console.log("connected to database");
});


//Route for /
app.get("/", (req,res) => {
    res.send(`server running on port ${PORT}`);
});

//Route for posting user registration 
app.post("/register_user", (req,res) => {
    const person_name = req.body.person_name;
    console.log(validate.validate_name(person_name));
    const email_id = req.body.email;
    console.log(validate.validate_email(email_id));
    const password = req.body.password;
    const username = req.body.username;
    console.log(validate.validate_username(username));
    const usertype = req.body.usertype;

    if(!validate.validate_name(person_name) || !validate.validate_email(email_id))
    {
        res.send({"Message":"Invalid inputs(Name should contain only letters (maxlength 80), Username should start with letter and have only letters,digits and _ (maxlength 30), Password can only contain letters, digits and @ # $ ! % & (8 to 30 length)"})
    }

    else
    {
        const split_name = person_name.split(" ");
        const first_name = split_name[0];
        const middle = split_name.slice(1,split_name.length-1);
        var last_name = 'NULL';
        var middle_name = 'NULL';
    
        if(split_name.length > 1)
            last_name = split_name[split_name.length-1];
        //handle absence of middle name
        if(middle.length != 0) 
            middle_name = middle.join(" ");

        //Running the insert query on the database
        //One query to handle all possible possibilities of first,middle and last name presence
        const insert_query = "INSERT INTO users(username, email_id, password, first_name, "+ (middle_name === 'NULL'? '':"middle_name, ") + (last_name === 'NULL'? '':"last_name, ") + "user_type) VALUE('" + username + "', '" + email_id + "', '" + password + "', '" + (middle_name === "NULL"? (last_name === "NULL" ? first_name: first_name + "', '" + last_name) : first_name + "', '" + middle_name + "', '" + last_name) + "', '"+ usertype + "');";
        console.log(insert_query); 
        db_user.query(insert_query, function(err, result) {
            if(err)
            {
                if(err.errno === 1062)
                {
                    res.send({"Message":"Username or email taken"});
                }
                else
                {
                    throw err
                }
            } 
            else
            {
                console.log(result);
                res.send({"Message":"Successfully registered"}); //without this no response sent to frontend
            }
        });
    }
});

//Route for posting freelancer registration 
app.post("/register_freelancer", (req, res) => {
    const dob = req.body.dob;
    const country = req.body.country;
    console.log(validate.validate_letters(country,30));
    const username=req.body.username;
    console.log(validate.validate_username(username));
    var educations = req.body.educations;
    var skills = req.body.skills;
    var socials = req.body.socials;
    educations=JSON.parse(educations);
    if(skills)
        skills=JSON.parse(skills);
    socials=JSON.parse(socials);
    
    if(validate.validate_letters(country,30) && validate.validate_username(username))
    {
        //Read freelancer_count from counter to fix a freelancer_id and increment freelancer_count
        var freelancer_count;
        db_freelancer.query("SELECT freelancer_count FROM counter", function(err, result) {
            if(err) throw err;
            const count = result.map(row => row.freelancer_count);
            freelancer_count = count[0];

            //Insert freelancer details into the freelancer table
            var insert_query = "INSERT INTO freelancer VALUE('FID" + freelancer_count + "', '" + dob + "', '" + country + "', 0, '" + username + "');";
            console.log(insert_query);
            db_freelancer.query(insert_query, function(err, result) {
                if(err) throw err;
                console.log(result);
            });

            //Group all the education details and form a query
            var temp = "";
            for (let i=0;i<educations.length;i++)
            {
                console.log(validate.validate_alphanumeric(educations[i]["degree"],30) +" " + validate.validate_year(educations[i]["year_of_grad"]));
                if(validate.validate_alphanumeric(educations[i]["degree"],30) && validate.validate_year(educations[i]["year_of_grad"]))
                {
                    temp += "('FID" + freelancer_count + "', '" + educations[i]["degree"] + "', " + educations[i]["year_of_grad"] + "),";     
                }
            }

            if(temp.length != 0)
            {
                insert_query = "INSERT INTO freelancer_educations VALUES " + temp.slice(0,temp.length-1) + ";";
            
                //Execute the query to insert education details
                db_freelancer.query(insert_query, function(err,result) {
                    if(err) throw err;
                    console.log(result);
                });
            }
            
            
            //Group all the skill details and form a query
            temp="";
            if(skills)
            {
                for (let i=0;i<skills.length;i++)
                {
                    console.log(validate.validate_alphanumeric(skills[i]["skill"],30));
                    if(validate.validate_alphanumeric(skills[i]["skill"],30))
                    {
                        temp += "('FID" + freelancer_count + "', '" + skills[i]["skill"] + "', '" + skills[i]["experience"] + "'),";
                    }
                }
                if(temp.length != 0)
                {
                    insert_query = "INSERT INTO freelancer_skills VALUES " + temp.slice(0,temp.length-1) + ";";
                    //Execute the query to insert skill details
                    db_freelancer.query(insert_query, function(err,result) {
                        if(err) throw err;
                        console.log(result);
                    });
                }
            }

        
            //Group all the social details and form a query
            temp="";
            for (let i=0;i<socials.length;i++)
            {
                console.log(validate.validate_letters(socials[i]["media"],30)+" "+validate.validate_username(socials[i]["userhandle"]));
                if(validate.validate_letters(socials[i]["media"],30) && validate.validate_username(socials[i]["userhandle"]))
                {
                    temp += "('FID" + freelancer_count + "', '" + socials[i]["media"] + "', '" + socials[i]["userhandle"] + "'),";
                }
            }
            insert_query = "INSERT INTO freelancer_socials VALUES " + temp.slice(0,temp.length-1) + ";";
            
            //Execute the query to insert social details
            db_freelancer.query(insert_query, function(err,result) {
                if(err) throw err;
                console.log(result);
            });     
        });
        res.send({"Message":"Registration successful, you will now be required to select a profile picture."});
    }
    else
    {
        res.send({"Message":"Invalid country or username"})
    }
});

//Route for posting client registration
app.post("/register_client", (req, res) => {
    const username = req.body.username;
    const country = req.body.country;
    const company = req.body.company;

    if(validate.validate_letters(country,30) && validate.validate_letters(company,30))
    {
        //Read client_count from counter to fix a client_id and increment client_count
        db_client.query("SELECT client_count FROM counter", function(err, result) {
            if(err) throw err;
            const count = result.map(row => row.client_count);
            var client_count = count[0];
            console.log(client_count);

            const insert_query = "INSERT INTO client VALUE('CID" + client_count + "', '" + country + "', '" + company + "', '" + username + "');";
            console.log(insert_query);

            //Insert client details into the client table
            db_client.query(insert_query, function(err, result) {
                if(err) throw err;
                console.log(result);
                res.send({"Message":"Registration successful,you will now be required to select a profile picture."});
            });
        });
    }
    else
    {
        res.send({"Message":"Invalid country or company name(max 30 letters or - only)"})
    }
});

//Route for authentication
app.post("/authenticate", (req, res) => {
    const password = req.body.password;
    const username = req.body.username;
    console.log(validate.validate_password(password)+" "+validate.validate_username(username,30))
    if(validate.validate_password(password) && validate.validate_username(username,30))
    {
        db_user.query("SELECT password, user_type FROM users WHERE username='"+username+"';", function(err, result) {
            if(err) throw err;
            console.log(result);
            const stored_password = result.map(row => row.password);
            const usertype = result.map(row => row.user_type);
            if(stored_password.length == 0)
                res.json({"Message":"Username not found"});
            else 
            {
                //compare if the password entered on hashing gives the hashed-password stored in the database 
                console.log(password +" " + stored_password[0] + " " + bcrypt.compare(password, stored_password[0]))
                bcrypt.compare(password, stored_password[0])
                .then( match => { 
                    if(! match) 
                        res.json({"Message": "Wrong Password"});
                    else
                    {
                        console.log(usertype[0])
                        if(usertype[0] === "Freelancer")
                            res.json({"Message": "Freelancer"}); 
                        else if(usertype[0] === "Client")
                            res.json({"Message":"Client"});
                    }
                });
            }
        });
    }
    else
    {
        res.send({"Message":"Invalid username or password(Username should start with letter and have only letters,digits and _ (maxlength 30), Password can only contain letters, digits and @ # $ ! % & (8 to 30 length))"})
    }
});

//Route for sending freelancer profile details
app.post("/freelancer_profile", (req, res) => {
    const username = req.body.username; 
    
    //Retrieve skills based on username (using procedure)
    var retrieve_query = "call makeFreelancerProfile('" + username + "');" 
    db_user.query(retrieve_query, function(err, result) {
        if(err) throw err;
        const cookie = result[0].map(row => row.cookie_value);
        const f_id = result[0].map(row => row.f_id);

        let experiences = result[0].map(row => row.experience);
        let skills = result[0].map(row => row.skill);
        experiences = experiences[0]? experiences[0].split(",") : []; //string to list
        skills = skills[0]? skills[0].split(",") : [];

        let socials = result[0].map(row => row.social_media);
        let userhandles = result[0].map(row => row.userhandle);
        socials = socials[0]? socials[0].split(",") : [];
        userhandles = userhandles[0]? userhandles[0].split(",") : [];

        let project_ids = result[0].map(row => row.p_id);
        let project_titles = result[0].map(row => row.p_title);
        let project_descs = result[0].map(row => row.p_desc);
        let project_statuses = result[0].map(row => row.p_status);
        project_ids = project_ids[0]? project_ids[0].split(",") : [];
        project_titles = project_titles[0]? project_titles[0].split(",") : [];
        project_descs = project_descs[0]? project_descs[0].split(",") : [];
        project_statuses = project_statuses[0]? project_statuses[0].split(",") : [];

        function zip(arrays) {
            return arrays[0].map(function(_,i) {
                return arrays.map(function(array){return array[i]})
            });
        }

        const skill_experience = zip([skills, experiences]) //zip skiils to corresponding experiences
        const social_userhandle = zip([socials, userhandles]);
        const project_details = zip([project_ids, project_titles, project_descs, project_statuses]);
        
        res.json({"freelancer_id": f_id, "skills": skill_experience, "socials": social_userhandle, "projects": project_details, "cookies": cookie}); //, "completed_projects": completed_projects, "current_projects": current_projects});
    });
});

//Route for sending client details to frontend
app.post("/client_profile", (req, res) => {
    const username = req.body.username;

    let retrieve_query="SELECT client_id, first_name, middle_name, last_name, company FROM client JOIN user_client USING(username) WHERE username='"+ username + "';";
    db_client.query(retrieve_query, function(err, result) {
        if(err) throw err;
        let f_name = result.map(row => row.first_name);
        let m_name = result.map(row => row.middle_name);
        let l_name = result.map(row => row.last_name);
        let company = result.map(row => row.company); 
        let client_id = result.map(row => row.client_id); 
        m_name = (m_name == "NULL") ? '':m_name;
        l_name = (l_name == "NULL") ? '':l_name;

        var name = f_name+" "+m_name+" "+l_name; 
        console.log(name, company);

        retrieve_query = "SELECT project_ID, title, description, status, url FROM client JOIN project ON client.username=project.client_username WHERE client_id='" + client_id + "';";
        db_client.query(retrieve_query, function(err, result) {
            if(err) throw err;
            let projects = result.map(row => [row.project_ID, row.title, row.description, row.status, row.url]);
            console.log(projects);
            res.json({"person_name": name, "company": company, "existing_projects": projects});
        });
    });
});

//Route to extract and send project details
app.post("/projects", (req, res) => {
    let domain = req.body.domain_name.trim();
    console.log("Domain"+domain);
    console.log(validate.validate_letters(domain,30))
    if(validate.validate_letters(domain,30))
    {
        //Uses procedure to extract all product details
        let query = "call getProjects('" + domain + "');"
        db_freelancer.query(query, function(err,result) {
            if(err) throw err;
            console.log(result);
            let id = result[0].map(row => row.p_id);
            let title = result[0].map(row => row.p_title);
            let desc = result[0].map(row => row.p_desc);
            let status = result[0].map(row => row.p_status);
            let budget = result[0].map(row => row.p_budget);
            let timeline = result[0].map(row => row.p_timeline);
            let domains = result[0].map(row => row.domains)
            let skills = result[0].map(row => row.skills)
            let freelancers = result[0].map(row => row.freelancers);
            let colab = result[0].map(row => row.p_colab);

            function zip(arrays) {
                return arrays[0].map(function(_,i) {
                    return arrays.map(function(array){return array[i]})
                });
            }

            //zip all project details together
            const project_details = zip([id, title, desc, status, budget, timeline, domains, skills, freelancers, colab]);
            console.log("Project details"+project_details);
            res.send({"projects": project_details});
        });
    }
    else
    {
        res.send({"Message":"Domain name should be only letters(max length 30)"});
    }
});

//Endpoint to handle freelancer joining a project
app.post("/join_project", (req, res) => {
    const f_id = req.body.f_id;
    const p_id = req.body.p_id;

    const query = "INSERT INTO project_freelancers VALUE('" + p_id + "', '" + f_id +"');";
    db_freelancer.query(query, function(err,result) {
        if(err)
        {
            if(err.errno == 1062) //Duplicate entry if already joined
                res.json({"Message": "Already joined"});
            else
            {
                res.json({"Message": "Failed to join, " + err.code});
                throw err;
            }
        } 
        else
        {
            db_client.query("UPDATE project SET status='In Progress' WHERE project_ID='"+p_id+"';", function(err,result) {
                if(err) throw err;
                res.json({"Message": "Joined Successfully"});
            });
        }
    });
});


//Route to retrieve reviews for a given freelancer
app.post("/get_reviews", (req, res) => {
    db_user.query("SELECT freelancer_ID, client_username, review, rating FROM reviews WHERE freelancer_id='" + req.body.f_id + "';", (err, result) => {
        if(err) throw err;
        console.log(result);
        const client_IDs = result.map(row => row.client_username);
        const reviews = result.map(row => row.review);
        const ratings = result.map(row => row.rating);
        res.json({"clients":client_IDs, "reviews":reviews, "ratings":ratings});
    });
});

//Client can publish projects
app.post("/publish", (req, res) => {
    const username = req.body.username;
    const title = req.body.title;
    const description = req.body.description;
    const budget = req.body.budget;
    const timeline = req.body.timeline;

    console.log(validate.validate_alphanumeric(title, 30)+ " " + validate.validate_alphanumeric(description,60) + " " + validate.validate_digits(budget) + " " + validate.validate_digits(timeline));
    if(validate.validate_alphanumeric(title, 30) + " " + validate.validate_alphanumeric(description,60) + " " + validate.validate_digits(budget) + " " + validate.validate_digits(timeline))
    {
        const skills = req.body.skills.split(",");
        const domains = req.body.tags.split(",");
        
        //Read project_count to generate new p_id
        db_client.query("SELECT project_count FROM counter", function(err, result) {
            if(err) throw err;
            const count_p = result.map(row => row.project_count);
            var project_count = count_p[0];

            //insert new project details
            const query = "INSERT into project VALUE('PID" + project_count + "', '" + title + "', '" + description+ "', " + budget + ", 'Not Assigned', " + timeline + ", '" + username + "', '" + req.body.collab + "', null);";
            db_client.query(query, function(err, result) {
                if(err) throw err;
                console.log(result);

                //Convert domains string to a query for insertion
                let list1 = "";
                for(let i=0;i<domains.length;i++)
                {
                    if(validate.validate_alphanumeric(domains[i],30))
                    {
                        list1+="('PID" + count_p +"', '" + domains[i] + "'),";
                    }
                }
            

                //Convert skills string to a query for insertion
                let list2 = "";
                for(let i=0;i<skills.length;i++)
                {
                    if(validate.validate_alphanumeric(skills[i],30))
                    {
                        list2+="('PID" + count_p +"', '" + skills[i] + "'),";
                    }
                }

                if(list1.length != 0)
                {
                    list1 = list1.slice(0,list1.length-1);
                    db_client.query("INSERT INTO project_domains VALUES"+list1+";", function(err, result) {
                        if(err) throw err;
                        console.log(result);
                       
                        if(list2.length != 0)
                        {
                            list2 = list2.slice(0,list2.length-1);
                            db_client.query("INSERT INTO project_skills VALUES"+list2+";", function(err, result) {
                                if(err) throw err
                                console.log(result);
                            }); 
                        }
                    });
                }
            });
        });
        res.send({"Message":"Project published. You will now be required to upload the pdf"});
    }
    
    else
    {
        res.send({"Message":"Invalid title, description, budget or timeline (title should be alphanumeric(max 30), description should be alphanumeric(max 60), budget and timeline should be int)"})
    }
});


// Define a route for file upload
app.post('/upload_profile', upload.single('profile_pic'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    //Save image data with username acting as unique id
    const image = {
      username: req.body.username,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
 
    // Store the image in the MySQL database
    db_user.query('INSERT INTO image SET ?', image, (err, result) => {
      if (err) 
      {
        console.error('Error storing image in MySQL:', err);
        return res.status(500).json({ error: 'Image upload failed' });
      }
      res.json({ message: 'File uploaded successfully' });
    });
});
  
//Route which retrieves profile picture
app.get('/display_image/:id', (req, res) => {
  const imageId = req.params.id;

  db_user.query('SELECT data, contentType FROM image WHERE username = ?', [imageId], (err, result) => {
    if(err) 
    {
      console.error('Error retrieving image from MySQL:', err);
      return res.status(500).json({ error: 'Image retrieval failed' });
    }

    if (result.length === 0) 
    {
      return res.status(404).json({ error: 'Image not found' });
    }

    //Prepare a response with data along with the header having the content-type set
    const imageData = result[0];
    res.setHeader('Content-Type', imageData.contentType);
    res.end(imageData.data);
  });
});

//Route to upload project details pdf into database
app.post('/upload_pdf', upload.single('pdf'), (req, res) => {
  if (!req.file) 
  {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  //Save the pdf data along with title acting as a unique id
  const pdf = {
    title: req.body.project_title,
    data: req.file.buffer,
    contentType: req.file.mimetype,
  };

  db_client.query('INSERT INTO project_pdf SET ?', pdf, (err, result) => {
    if (err) 
    {
      console.error('Error storing PDF in MySQL:', err);
      return res.status(500).json({ error: 'PDF upload failed' });
    }
    res.json({ message: 'PDF uploaded successfully' });
  });
});

//Route to retrieve the pdf from database
app.get('/display_pdf/:id', (req, res) => {
  const pdfId = req.params.id;

  db_user.query('SELECT data, contentType FROM project_pdf WHERE title = ?', [pdfId], (err, result) => {
    if (err) 
    {
      console.error('Error retrieving PDF from MySQL:', err);
      return res.status(500).json({ error: 'PDF retrieval failed' });
    }

    if (result.length === 0) 
    {
      return res.status(404).json({ error: 'PDF not found' });
    }

    const pdfData = result[0];
    res.setHeader('Content-Type', pdfData.contentType);
    res.end(pdfData.data);
  });
});

//Route to handle project submission from freelancer
app.post('/submit_project', (req, res) => {
    const url = req.body.url;
    const project_id = req.body.project_id;

    if(validate.validate_url(url))
    {
        //Update the url field s tat client can access link
        const query = "UPDATE project SET url='" + url + "' WHERE project_ID='" + project_id + "';";
        db_client.query(query, (err, result) => {
            if(err) throw err;
            res.send({"Message":"Successfully handed off project, it will be reviewed by client"}); 
        });
    }
    else
    {
        res.send({"Message":"Error in handing off, ensure url follows the character constraints"});
    }
});

//Route to handle finalizing of project from client
app.post('/finalize_project', (req, res) => {
    const project_id = req.body.project_id;
    console.log("project"+project_id);
    
    //Update the status as completed
    const query = "UPDATE project SET status='Completed' WHERE project_ID='" + project_id + "';";
    db_client.query(query, (err, result) => {
        if(err) throw err;
        res.send({"Message":"Project Successfully finalized"});
    })
})

//Route to handle return of project for revision from client
app.post('/return_project', (req, res) => {
    const project_id = req.body.project_id;
    console.log("project"+project_id);

    //Remove the link from url field to let the freelancer know that revision is needed
    const query = "UPDATE project SET url="+null+" WHERE project_ID='" + project_id + "';";
    db_client.query(query, (err, result) => {
        if(err) throw err;
        res.send({"Message":"Project successfully returned"});
    })
})

//Route to handle feedback submission
app.post('/give_feedback', (req, res) => {
    console.log("feedback" + req.body.username + req.body.project_id);
    const username = req.body.username;
    const project_id = req.body.project_id;
    const review = req.body.review;
    const rating = req.body.rating;

    //Get all freelancers involved with the project
    let query = "SELECT freelancer_ID FROM project_freelancers WHERE project_ID='"+project_id+"';";
    db_client.query(query, (err, result) => {
        if(err) throw err;
        const freelancers = result.map(row => row.freelancer_ID);
        
        for(let i=0;i<freelancers.length;i++)
        {
            //Insert review into each freelancers reviews
            query = "INSERT INTO reviews VALUES('" + username+ "','" + freelancers[i] + "', '" + review + "', '"+ rating + "');";
            db_client.query(query, (err,result) => {
                if(err) throw err;
                console.log(result);

                //Update freelancer's cookie based on rating 
                query = "UPDATE freelancer SET cookies=cookies+" + rating + " WHERE freelancer_id='" + freelancers[i] + "';";
                db_freelancer.query(query, (err, result) => {
                    if(err) throw err;
                    console.log(result);
                })
            })
        }
        res.send({"Message":"Successfully saved review"});
    })
})

/*
app.post('/chat',(req,res) => {
    console.log("in chat get:"+req.body.username)
    const username=req.body.username
    db_freelancer.query("SELECT freelancer_ID,message FROM chat WHERE project_ID='PID5';",(err,result) =>{
        if (err) throw err;
        console.log('chat'+result);
        const f_ID = result.map(row => row.freelancer_ID);
        const chats_list = result.map(row => row.message);
        q="select distinct(project_id) from chat where freelancer_id=(select freelancer_id from freelancer where username='"+username+"');"
        console.log(q)
        db_freelancer.query(q,(err,result) =>
        {
            if(err) throw err;
            const project_id=result.map(row => row.project_id);
            res.json({"freelancer_id":f_ID, "chats":chats_list, "project_id":project_id});
        })
        
    })
});

app.post('/chat',(req,res) => {
    console.log("final:"+final_msg)
})
*/


//app listening on port 3000
app.listen(3000,() => {
    console.log(`Server is running on ${PORT}`);
});

