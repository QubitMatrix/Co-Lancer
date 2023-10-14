const express = require('express')
const db = require("./config/db.js")
const cors = require('cors')

const app = express()
const PORT = 3000
app.use(cors())
app.use(express.json())

db_admin = db.db_admin
db_client = db.db_client
db_freelancer = db.db_freelancer

//Connecting to the database
db_client.connect(function(err) {
    if(err) throw err;
    console.log("connected to database")
});

//Route for /
app.get("/", (req,res) => {
    res.send(`server running on port ${PORT}`)
})

//Route for posting user registration 
app.post("/register_user", (req,res) => {
    const person_name = req.body.person_name

    const split_name = person_name.split(" ")
    const first_name = split_name[0]
    var last_name = 'NULL'
    var middle_name = 'NULL'
    if(split_name.length > 1)
        last_name = split_name[split_name.length-1]
    const middle = split_name.slice(1,split_name.length-2)
    if(middle.length != 0) 
        middle_name = middle.join(" ")

    const email_id = req.body.email
    const password = req.body.password
    const username = req.body.username
    const usertype = req.body.usertype
    var db_user
    
    if(usertype==="Freelancer")
        db_user=db_freelancer
    else
        db_user=db_client
    console.log(person_name + " " + email_id + " " + password + " " + username + " " + usertype)

    const insert_query = "INSERT INTO users VALUE('" + username + "', '" + email_id + "', '" + password + "', '" + first_name + "', '" + middle_name + "', '" + last_name + "', '" + usertype + "');"
    console.log(insert_query)

    //Running the insert query on the database
    db_user.query(insert_query, function(err, result) {
        if(err) throw err;
        console.log(result);
    });
    res.send({message:"hello"}) //without this no response sent to frontent
})

//Route for posting client registration
app.post("/register_client", (req,res) => {
    const username = req.body.username
    const country = req.body.country
    const company = req.body.company

    //Read client_count from counter to fix a client_id and increment client_count
    db_client.query("SELECT client_count FROM counter", function(err, result) {
        if(err) throw err
        const count = result.map(row => row.client_count)
        var client_count = count[0]
        console.log(client_count)

        const insert_query = "INSERT INTO client VALUE('CID" + client_count + "', '" + country + "', '" + company + "', '" + username + "');"
        console.log(insert_query)

        //Insert client details into the client table
        db_client.query(insert_query, function(err, result) {
            if(err) throw err;
            console.log(result);

            //Update the client_count if successfully inserted
            db_client.query("UPDATE counter SET client_count=client_count+1", function(err,result) {
                if(err) throw err;
                console.log(result)
            })
        })
    })
    res.send({"message":"hello"})
})

//app listening on port 3000
app.listen(3000,() => {
    console.log(`Server is running on ${PORT}`)
})