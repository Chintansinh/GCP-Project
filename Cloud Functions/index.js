
const mysql = require('mysql'); 
exports.crudFunction = (req, res) => {
res.set('Access-Control-Allow-Origin', "*");
res.set('Access-Control-Allow-Methods', 'GET, POST');
const Operations = {
      AddUser: 1,
      ViewUser: 2,
      AddTeam: 3,
      ViewTeam: 4,
      Login: 5,
      DeleteUser: 6,
      DeleteTeam: 7,
      RecordMessage: 8,
    }

const pool = mysql.createPool({
  connectionLimit : 1,
  host: '10.18.240.3',
  port: '3306',
  user: 'root',
  password: 'group1admin',
  database: 'group1db'
});
var body = JSON.parse(req.body);
if (body.operation){
  switch (body.operation) {
      case Operations.AddUser:
      AddUser(res, pool, body.name, body.password, body.team, body.role, body.email)
      break;
      case Operations.ViewUser:
      ViewUser(res, pool)
      break;
      case Operations.AddTeam:
      AddTeam(res, pool, body.name)
      break;
      case Operations.ViewTeam:
      ViewTeam(res, pool)
      break;
      case Operations.Login:
      Login(res, pool, body.email, body.password)
      break;
      case Operations.DeleteUser:
      DeleteUser(res, pool, body.id)
      break;
      case Operations.DeleteTeam:
      DeleteTeam(res, pool, body.id)
      break;
      case Operations.RecordMessage:
      RecordMessage(res, pool, body.userId, body.teamId, body.userName, body.userEmail, body.userRole, body.teamName, body.topic, body.message)
      break;
      default:
      DefaultResponse(res, "body")
    }
}
else {
  res.status(200).send("Invalid");
}
};

function AddUser(res, pool, name, password, team, role, email){
    var sql = "INSERT INTO group1db.Users (name, password, teamID, role, email) VALUES ('"+ name + "','" + password + "'," + team +",'" + role +"','" + email +"')";
    pool.query(sql, function (e, results) {
        res.status(200).send(sql);
    });
}

function AddTeam(res, pool, name){
    var sql = "INSERT INTO group1db.Teams (name, topic) VALUES ('"+ name + "','topic_" +name+"_group"+ "')";
    pool.query(sql, function (e, results) {
        res.status(200).send(results);
    });
}

function ViewUser(res, pool){
    pool.query(`SELECT u.UserID, u.Name, u.Role, u.Email, t.Name as TeamName, t.Topic as Topic  FROM group1db.Users u INNER JOIN group1db.Teams t WHERE u.TeamID = t.TeamID`, function (e, results) {
        res.status(200).send(results);
    });
}

function ViewTeam(res, pool){
    pool.query(`SELECT * FROM group1db.Teams`, function (e, results) {
        res.status(200).send(results);
    });
}

function Login(res, pool, email, password){
  var sql = "SELECT u.UserID, u.Name, u.Role, u.Email, t.Topic as Topic, t.TeamID, t.Name as TeamName FROM group1db.Users u INNER JOIN group1db.Teams t WHERE u.TeamID = t.TeamID AND Email = '"+ email + "' AND Password = '" + password + "' LIMIT 1";
  pool.query(sql, function (e, results) {
      res.status(200).send(results);
  });
}

function DeleteUser(res, pool, id){
    var sql = "DELETE FROM group1db.Users WHERE UserID = " + id +";";
    pool.query(sql, function (e, results) {
        res.status(200).send(results);
    });
}

  function DeleteTeam(res, pool, id){
    var sql = "DELETE FROM group1db.Teams WHERE TeamID = " + id +";";
    pool.query(sql, function (e, results) {
        res.status(200).send(results);
    });
  }

  function RecordMessage(res, pool, userId, teamId, userName, userEmail, userRole, teamName, topic, message){
    var sql = "INSERT INTO group1db.MessageInfo (userId, teamId, userName, userEmail, userRole, teamName, topic, message, createdDate) VALUES ("+ userId + "," + teamId + ",'" + userName +"','" + userEmail + "','" + userRole + "','" + teamName +"','" + topic+"','" + message + "'," +"NOW()"+")";
    pool.query(sql, function (e, results) {
        res.status(200).send(sql);
    });
  }

function DefaultResponse(res, body){
    res.status(200).send(body);
}