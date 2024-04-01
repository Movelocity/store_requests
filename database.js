const sqlite3 = require('sqlite3').verbose();

// Connect to the database
// let db = new sqlite3.Database(':memory:', (err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Connected to the in-memory SQlite database.');
// });

let db = new sqlite3.Database('db.sqlite', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
  });

// Create table to store data
db.run('CREATE TABLE IF NOT EXISTS requests(data TEXT)', (err) => {
  if (err) {
    console.error(err.message);
  }
});

// Function to insert data into the table
function storeData(data, callback) {
  db.run('INSERT INTO requests(data) VALUES(?)', [data], function(err) {
    callback(err);
  });
}

// Function to get the last 10 requests
function getLastTenRequests(callback) {
  db.all('SELECT * FROM requests ORDER BY ROWID DESC LIMIT 10', [], (err, rows) => {
    callback(err, rows);
  });
}

module.exports = { storeData, getLastTenRequests };
