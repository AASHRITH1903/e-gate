const router = require('express').Router();
const path = require('path');
const Student = require('../models/student.model');
const Request = require('../models/request.model');


let data;
let flag1 = -1;
let id;

router.route('/login').get((req, res) => {
  data = 0;
  res.render('LoginForms/StudentLogin', {
    data
  });
})

router.route('/login/check').post((req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  console.log(email, password);

  Student.findOne({
    email,
    password
  }, (err, doc) => {
    if (err) {
      console.log(err);
    } else if (!doc) {
      console.log('Student details unavailable');
      data = 1;
      res.render('LoginForms/StudentLogin', {
        data
      });
    } else {
      id = doc.id;
      res.redirect('/student/dashboard');
    }
  })
})

router.route('/dashboard').get((req, res) => {
  res.render('Student/index', {
    flag1
  });
})

router.route('/dashboard/editprofile').get((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'Student', 'profile.html'))
})

router.route('/dashboard/editprofile/update').post((req, res) => {
  // make a difference between name and username
  let username = req.body.username;
  let bloodgroup = req.body.bloodgroup;
  let phonenumber = req.body.phonenumber;
  let password = req.body.password;
  let reTypePassword = req.body.reTypePassword;
  let gender = req.body.gender;

  console.log(username, bloodgroup, phonenumber, password, gender, id);

  if (!(password === reTypePassword)) {
    console.log("Passwords do not match");
    flag1 = 0;        // fill it with("Passwords does not match string")
    res.redirect('/student/dashboard');
  } else {
    // Find id
    Student.findOneAndUpdate({
      "_id": id
    }, {
      "$set": {
        "username": username,
        "bloodgroup": bloodgroup,
        "phonenumber": phonenumber,
        "password": password,
        "gender": gender
      }
    }).exec(function(err, book) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        flag1 = 1; // 28
        res.redirect('/student/dashboard');
      }
    });
  }

  // Add ejs as profile edited option
  // res.redirect('/student/dashboard');
})

router.route('/dashboard/requests').get((req, res) => {
  data = 0;
  res.render('Student/requestForm', {
    data
  });
})

router.route('/dashboard/requests/send').post((req, res) => {
  let name = req.body.name;
  let location = req.body.location;
  let email = req.body.email;
  let reason = req.body.reason;

  let id;

  console.log(name, location, reason, email);

  Request.findOne({
    email
  }, (err, doc) => {
    if (err) {
      console.log(err);
    } else if (!doc) {

      console.log('Student first time requesting');
      var request = new Request({
        name: name,
        location: location,
        reason: reason,
        req_status: 'pending',
        outing_status: 'null',
        email: email
      });

      request.save(function(err, book) {
        if (err) return console.error(err);
        console.log(book.name + " saved to requests collection.");
      });
      flag1 = 0;
      res.render('Student/index', { flag1});
    } else {

      Request.findOneAndUpdate({
        "email": email
      }, {
        "$set": {
          location: location,
          reason: reason,
          status: 'pending',
        }
      }).exec(function(err, book) {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          flag1 = 2;
          res.redirect('/student/dashboard');
        }
      });
    }
  })
})

module.exports = router;
