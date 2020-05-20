var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "dbgearscore"
});

con.connect(function (err) {
  if (!!err) {
      console.log('Erro')
  } else {
      console.log('Conectado')
  }
})

module.exports = con;