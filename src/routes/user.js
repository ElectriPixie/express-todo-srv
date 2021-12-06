const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const withAuth = require("../withAuth");
const router = express.Router();

const secret = "supersecretstuff";


router.post('/register', function(req, res) {
  const { username, password, confirmPassword } = req.body;
  if(password === confirmPassword)
  {
    const user = new User({ username, password });
    user.save(function(err) {
      if(err) {
        console.log("Error registering new user please try again.");
        res.status(500)
          .send("Error registering new user please try again.");
      }else{
        console.log("Creating JWT Token");
        const payload = { username };
        const token = jwt.sign(payload, secret, {
          expiresIn: '1h'
        });
        console.log("Token: ", token);
        res.status(200)
          .json({
            user: username,
            token: token
          });
      }
    });
  }else{
    res.status(500)
      .send("Error passwords didn't match");
  }
});

router.post('/authenticate', function(req, res) {
  const { username, password } = req.body;
  User.findOne({ username }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({ error: 'Internal error please try again' });
    } else if(!user) {
      res.status(401)
        .json({ error: 'Incorrect username or password' });
    } else {
      user.isCorrectPassword(password, function(err, same) {
        if (err) {
          res.status(500)
            .json({ error: 'Internal error please try again' });
        } else if (!same) {
          res.status(401)
            .json({ error: 'Incorrect username or password' });
        } else {
          const payload = { username };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h' 
          });
          res.status(200)
            .json({
              user: user,
              token: token
            });
        }
      });
    }
  });
});

router.get('/checkToken', withAuth, function(req, res) {
  res.sendStatus(200);
});

module.exports = router;
