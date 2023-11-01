const bcrypt = require('bcryptjs');
const express = require('express');
const db = require("./config/db.js");
const PDFParser = require('pdf-parse');
const multer = require('multer');
const cors = require('cors');

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const PORT = 3000;
app.use(cors());
app.use(express.json());

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
    const email_id = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const usertype = req.body.usertype;


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
        if(err) throw err;
        console.log(result);
    });
    res.send({message:"hello"}); //without this no response sent to frontend
});

//Route for posting freelancer registration 
app.post("/register_freelancer", (req, res) => {
    const dob = req.body.dob;
    const country = req.body.country;
    const username=req.body.username;
    var educations = req.body.educations;
    var skills = req.body.skills;
    var socials = req.body.socials;
    educations=JSON.parse(educations);
    if(skills)
        skills=JSON.parse(skills);
    socials=JSON.parse(socials);
    
    //Read freelancer_count from counter to fix a freelancer_id and increment freelancer_count
    var freelancer_count;
    db_freelancer.query("SELECT freelancer_count FROM counter", function(err, result) {
        if(err) throw err;
        const count = result.map(row => row.freelancer_count);
        freelancer_count = count[0];

        //Insert freelancer details into the freelancer table
        var insert_query = "INSERT INTO freelancer VALUE('FID" + freelancer_count + "', '" + dob + "', '" + country + "', 0, '" + username + "');";
        db_freelancer.query(insert_query, function(err, result) {
            if(err) throw err;
            console.log(result);

            //Update the freelancer_count if successfully inserted
            db_freelancer.query("UPDATE counter SET freelancer_count = freelancer_count+1", function(err,result) {
                if(err) throw err;
                console.log(result);
            });
        });

        //Group all the education details and form a query
        var temp = "";
        for (let i=0;i<educations.length;i++)
        {
            temp += "('FID" + freelancer_count + "', '" + educations[i]["degree"] + "', " + educations[i]["year_of_grad"] + "),";
        }
        insert_query = "INSERT INTO freelancer_educations VALUES " + temp.slice(0,temp.length-1) + ";";
        
        //Execute the query to insert education details
        db_freelancer.query(insert_query, function(err,result) {
            if(err) throw err;
            console.log(result);
        });
        
        //Group all the skill details and form a query
        temp="";
        if(skills)
        {
            for (let i=0;i<skills.length;i++)
            {
                temp += "('FID" + freelancer_count + "', '" + skills[i]["skill"] + "', '" + skills[i]["experience"] + "'),";
            }
            insert_query = "INSERT INTO freelancer_skills VALUES " + temp.slice(0,temp.length-1) + ";";
        }

        //Execute the query to insert skill details
        db_freelancer.query(insert_query, function(err,result) {
            if(err) throw err;
            console.log(result);
        });

        //Group all the social details and form a query
        temp="";
        for (let i=0;i<socials.length;i++)
        {
            temp += "('FID" + freelancer_count + "', '" + socials[i]["media"] + "', '" + socials[i]["userhandle"] + "'),";
        }
        insert_query = "INSERT INTO freelancer_socials VALUES " + temp.slice(0,temp.length-1) + ";";
        
        //Execute the query to insert social details
        db_freelancer.query(insert_query, function(err,result) {
            if(err) throw err;
            console.log(result);
        });     
    });
    res.send();
});

//Route for posting client registration
app.post("/register_client", (req, res) => {
    const username = req.body.username;
    const country = req.body.country;
    const company = req.body.company;

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

            //Update the client_count if successfully inserted
            db_client.query("UPDATE counter SET client_count=client_count+1", function(err,result) {
                if(err) throw err;
                console.log(result);
            });
        });
    });
    res.send({"message":"hello"});
});

//Route for authentication
app.post("/authenticate", (req, res) => {
    const password = req.body.password;
    const username = req.body.username;
    db_user.query("SELECT password, user_type FROM users WHERE username='"+username+"';", function(err, result) {
        if(err) throw err;
        console.log(result);
        const stored_password = result.map(row => row.password);
        const usertype = result.map(row => row.user_type);
        if(stored_password.length == 0)
            res.json({"message":"Username not found"});
        else 
        {
            //compare if the password entered on hashing gives the hashed-password stored in the database 
            console.log(password +" " + stored_password[0] + " " + bcrypt.compare(password, stored_password[0]))
            bcrypt.compare(password, stored_password[0])
            .then( match => { 
                if(! match) 
                    res.json({"message": "Wrong Password"});
                else
                {
                    console.log(usertype[0])
                    if(usertype[0] === "Freelancer")
                        res.json({"message": "Freelancer"}); 
                    if(usertype[0] === "Client")
                        res.json({"message":"Client"});
                }
            });
        }
    });
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

    let retrieve_query="SELECT client_id, first_name, middle_name, last_name, company FROM client JOIN users USING(username) WHERE username='"+ username + "';";
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

        retrieve_query = "SELECT project_ID, title, description FROM client JOIN project USING(client_id) WHERE client_id='" + client_id + "';";
        db_client.query(retrieve_query, function(err, result) {
            if(err) throw err;
            let projects = result.map(row => [row.project_ID, row.title, row.description]);
            console.log(projects);
            res.json({"person_name": name, "company": company, "existing_projects": projects});
        });
    });
});

//Route to extract and send project details
app.post("/projects", (req, res) => {
    let domain = req.body.domain_name.trim();
    console.log(domain);

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
        let req = result[0].map(row => row.p_req);
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
        const project_details = zip([id, title, desc, status, budget, timeline, req, domains, skills, freelancers, colab]);
        console.log(project_details);
        res.send({"projects": project_details});
    });
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
            res.json({"Message": "Joined Successfully"});
        }
    });
});



app.post("/get_reviews", (req, res) => {
    db_user.query("SELECT freelancer_ID, client_ID, review, rating FROM reviews WHERE freelancer_id='" + req.body.f_id + "';", (err, result) => {
        if(err) throw err;
        console.log(result);
        const client_IDs = result.map(row => row.client_ID);
        const reviews = result.map(row => row.review);
        const ratings = result.map(row => row.rating);
        res.json({"clients":client_IDs, "reviews":reviews, "ratings":ratings});
    });
});

//Client can publish projects
app.post("/publish", (req, res) => {
    console.log("publish"+req.body.title);
    res.send();
});

//Uploading requirement pdf
app.post("/upload_file", upload.single('pdfFile'), (req, res) => {
    const pdfBuffer = req.file.buffer;
    console.log(pdfBuffer.length)
    const pdfData = new Uint8Array(pdfBuffer);
  const pdfParser = new PDFParser(pdfData);

  pdfParser.on("pdfParser_dataReady", (pdfData) => {
    const textContent = pdfData.text;
    // Handle the extracted text content as needed
    console.log(textContent);
    res.status(200).json({ textContent });
  });

  pdfParser.parseBuffer(pdfBuffer);
});

//app listening on port 3000
app.listen(3000,() => {
    console.log(`Server is running on ${PORT}`);
});