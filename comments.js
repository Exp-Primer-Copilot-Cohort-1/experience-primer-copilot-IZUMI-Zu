// Create web server
// Create a web server that listens on port 3000 and serves the comments.html file.
// The comments.html file should include a form that allows users to submit comments.
// When the form is submitted, the server should store the submitted comment in a comments.json file.
// The server should also display all comments from the comments.json file on the comments.html page.
// The comments should be displayed in reverse chronological order (i.e. the newest comments should be displayed first).
// The server should only store the last 20 comments in the comments.json file.
// If there are more than 20 comments, the server should remove older comments.
// The comments should persist even after the server is restarted.
// Use the comments.js file to implement the server.
// You can use the fs module to read and write to the comments.json file.
// The comments.json file should be an array of comment objects, where each comment object has the following structure:
// {
//   "name": "John Doe",
//   "comment": "Hello, world!",
//   "date": "2021-01-01T00:00:00.000Z"
// }

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const COMMENTS_FILE = path.join(__dirname, 'comments.json');
const COMMENTS_LIMIT = 20;

const server = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url);

    if (pathname === '/comments' && req.method === 'GET') {
        fs.readFile(COMMENTS_FILE, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Internal Server Error');
                return;
            }

            const comments = JSON.parse(data);
            const commentsHTML = comments
                .slice()
                .reverse()
                .map(comment => `<p>${comment.name}: ${comment.comment}</p>`)
                .join('');

            res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Comments</title>
          </head>
          <body>
            <h1>Comments</h1>
            <form action="/comments" method="post">
              <label for="name">Name:</label>
              <input type="text" id="name" name="name" required>
              <br>
              <label for="comment">Comment:</label>
                <textarea id="comment" name="comment" required></textarea>  
                <br>
                <button type="submit">Submit</button>
            </form>
            <div>${commentsHTML}</div>
            </body>
        </html>
            `);
        });
    }
})