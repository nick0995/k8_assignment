const mysql = require('mysql');

// Read configuration from environment variables
const dbHost = process.env.DB_HOST || 'mysql';  // default to 'mysql' (service name)
const dbPort = process.env.DB_PORT || '3306';
const dbName = process.env.DB_NAME || 'mydatabase';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || 'root';

let connection;
const initializeConnectionPool = async() => {
  connection = mysql.createPool({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    connectionLimit: 10
  });
  
  // Example query
  connection.on('connection', function (conn) {
    connCount++;
    console.log(`mysql connection event, connCount: ${connCount}`);
  });
  
  connection.on('acquire', function (conn) {
    console.log(`mysql acquire event, connCount: ${connCount}`);
  });
  
  connection.on('release', function (conn) {
    console.log(`mysql release event, connCount: ${connCount}`);
  });
  
  connection.on('error', function (err) {
    console.log(`mysql error event: ", err, " connCount: ${connCount}`);
  });
  
  connection.on('enqueue', function (err) {
    console.log(`mysql enqueue event : ", err, " connCount: ${connCount}`);
  });
  
  let createTableQuery = `CREATE TABLE IF NOT EXISTS story (
    id int not null auto_increment,
    text varchar(255) not null,
    primary key (id)
  );`;
  
  let tableRes = await connection.query(createTableQuery);
  console.log(tableRes);

  return connection;
}
// Create a connection to the database


const executeQuery = ({ queryString, params, event }) => {
    return new Promise((resolve, reject) => {
      let query = connection.query(queryString, params, function (err, res) {
        console.log(`executing mysql event: ${event} query: ${query.sql} err: ${JSON.stringify(err)} 
              res: ${JSON.stringify(res)} params: ${JSON.stringify(params)}`);
        if (err || !res) {
          console.log(`error executing mysql event  ${event} query  
                  ${query.sql} err: ${JSON.stringify(err)} res ${JSON.stringify(
            res
          )}`);
  
          if (
            err.code == 'ER_LOCK_DEADLOCK' ||
            err.code == 'ER_QUERY_INTERRUPTED'
          ) {
            setTimeout(
              executeQuery.bind(null, { queryString, params, event }),
              50
            );
          } else {
            return reject({ error: err, query: query.sql, event: event });
          }
        }
        return resolve(res);
      });
    });
  };

  // Close the connection
connection.end();

exports.initializeConnectionPool = initializeConnectionPool;
exports.executeQuery             = executeQuery;