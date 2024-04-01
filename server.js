const express = require('express');
const bodyParser = require('body-parser');
const { storeData, getLastTenRequests } = require('./database');

const app = express();
const PORT = 7667;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to handle POST requests
app.post('/store_data', (req, res) => {
  const data = JSON.stringify(req.body);
  storeData(data, (err) => {
    if (err) {
      res.status(500).send('Error saving data');
    } else {
      res.status(200).send('Data saved successfully');
    }
  });
});

// Route to serve the HTML page with the last 10 requests
// app.get('/', (req, res) => {
//   getLastTenRequests((err, rows) => {
//     if (err) {
//       res.status(500).send('Error retrieving data');
//     } else {
//       let html = '<html><body><h1>Last 10 Requests</h1><ul>';
//       rows.forEach((row) => {
//         html += `<li>${row.data}</li>`;
//       });
//       html += '</ul></body></html>';
//       res.send(html);
//     }
//   });
// });

// Route to serve the HTML page with the last 10 requests
app.get('/', (req, res) => {
  getLastTenRequests((err, rows) => {
    if (err) {
      res.status(500).send('Error retrieving data');
    } else {
      let html = `
        <html>
          <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/dracula.min.css">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/javascript/javascript.min.js"></script>
            <style>
              .CodeMirror {
                height: auto;
                border: 1px solid #ddd;
                margin-bottom: 10px;
                max-height: 200px;
              }
            </style>
          </head>
          <body>
            <h1>store_requests</h1>
            ${rows.map((row, index) => `
              <textarea id="code${index}">${row.data}</textarea>
            `).join('')}
            <script>
              document.addEventListener('DOMContentLoaded', function() {
                ${rows.map((_, index) => `
                  CodeMirror.fromTextArea(document.getElementById('code${index}'), {
                    mode: {name: "markdown", json: true},
                    theme: 'dracula',
                    lineNumbers: true,
                    readOnly: true,
                    lineWrapping: true
                  });
                `).join('')}
              });
            </script>
          </body>
        </html>
      `;
      res.send(html);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
