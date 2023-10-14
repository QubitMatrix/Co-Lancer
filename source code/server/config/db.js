const mysql = require('mysql')

const db_admin = mysql.createConnection({
    host: "localhost",
    user: "colancer_admin",
    password: "",
    database: "co_lancer"
})

const db_freelancer = mysql.createConnection({
    host: "localhost",
    user: "colancer_freelancer",
    password: "",
    database: "co_lancer"
})

const db_client = mysql.createConnection({
    host: "localhost",
    user: "colancer_client",
    password: "",
    database: "co_lancer"
})

module.exports = {db_admin,db_client,db_freelancer}