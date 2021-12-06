const jwt = require('jsonwebtoken');
const secret = 'supersecretstuff';

const withAuth = function(req, res, next) {
  console.log("called withAuth middleware");
  let token = req.headers.authorization;

  if (!token) {
    console.log("No Token Recieved");
    res.status(401).send('Unauthorized: No token provided');
  } else {
    token = token.slice(7, token.length);
    console.log("Recieved Token: ", token);
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        res.locals.username = decoded.username;
        next();
      }
    });
  }
}

module.exports = withAuth;
