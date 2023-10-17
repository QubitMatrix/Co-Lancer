const express = require('express');
const db = require("./config/db.js");
const cors = require('cors');

const app = express();
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
    var last_name = 'NULL';
    var middle_name = 'NULL';
    if(split_name.length > 1)
        last_name = split_name[split_name.length-1];
    const middle = split_name.slice(1,split_name.length-2);
    if(middle.length != 0) 
        middle_name = middle.join(" ");

    var db_user;
    if(usertype === "Freelancer")
        db_user = db_freelancer;
    else
        db_user = db_client;
    console.log(person_name + " " + email_id + " " + password + " " + username + " " + usertype);

    //Running the insert query on the database
    const insert_query = "INSERT INTO users VALUE('" + username + "', '" + email_id + "', '" + password + "', '" + first_name + "', '" + middle_name + "', '" + last_name + "', '" + usertype + "');";
    db_user.query(insert_query, function(err, result) {
        if(err) throw err;
        console.log(result);
    });
    res.send({message:"hello"}); //without this no response sent to frontent
});

//Route for posting freelancer registration 
app.post("/register_freelancer", (req,res) => {
    const dob = req.body.dob;
    const country = req.body.country;
    const username=req.body.username;
    var educations = req.body.educations;
    var skills = req.body.skills;
    var socials = req.body.socials;
    educations=JSON.parse(educations);
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
        for (let i=0;i<skills.length;i++)
        {
            temp += "('FID" + freelancer_count + "', '" + skills[i]["skill"] + "', '" + skills[i]["experience"] + "'),";
        }
        insert_query = "INSERT INTO freelancer_skills VALUES " + temp.slice(0,temp.length-1) + ";";
        
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
app.post("/register_client", (req,res) => {
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
        else if(stored_password[0] != password)
            res.json({"message":"Wrong Password"});
        else
        {
            console.log(usertype[0])
            if(usertype[0] === "Freelancer")
                res.json({"message": "Freelancer"}); 
            if(usertype[0] === "Client")
                res.json({"message":"Client"});
        }
    });
});


//app listening on port 3000
app.listen(3000,() => {
    console.log(`Server is running on ${PORT}`);
});