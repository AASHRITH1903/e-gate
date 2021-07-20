const router = require('express').Router();
const path = require('path');
const Student = require('../models/student.model');
const Request = require('../models/request.model');
const bcrypt = require('bcrypt');

const saltRounds = 10;


let data;
let flag1 = -1;
let id;
let email

router.route('/login').get((req, res) => {
  data = 0;
  res.render('LoginForms/StudentLogin', {
    data
  });
})

router.route('/login/check').post((req, res) => {
  email = req.body.email;
  let password = req.body.password;

  console.log(email, password);

  Student.findOne({
    email
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
      bcrypt.compare(password, doc.password, function(error, result) {
        if(result === true) {
          id = doc.id;
          res.redirect('/student/dashboard');
        }
        if(error){
          console.log(err);
        }
      });
    }
  })
})

router.route('/dashboard').get((req, res) => {
  console.log(flag1);
  res.render('Student/index', {
    flag1
  });
})

router.route('/dashboard/editprofile').get((req, res) => {
  Student.findById(id, function(err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.render('Student/profile', {
        username: docs.username,
        phonenumber: docs.phonenumber
      });
    }
  });
})

router.route('/dashboard/editprofile/update').post((req, res) => {
  // make a difference between name and username
  let username = req.body.username;
  let bloodgroup = req.body.bloodgroup;
  let phonenumber = req.body.phonenumber;
  let password = req.body.password;
  let reTypePassword = req.body.reTypePassword;
  let gender = req.body.gender;

  console.log(username, bloodgroup, phonenumber, password, gender, id, email);

  if (!(password === reTypePassword)) {
    console.log("Passwords do not match");
    flag1 = 0; // fill it with("Passwords does not match string")
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

router.route('/dashboard/history').get((req, res) => {
  // Student.findOne({email},(err,docs)=>{
  //   res.render('Student/history',{prevRequests: docs.my_requests})
  // })
  const userId = id;
  console.log('kadsjcn', id);
  Request.find({
    id: userId
  }, (err, docs) => {
    if (err) {
      console.log(err);
    } else if (!docs) {
      console.log('Student details unavailable');
    } else {
      console.log('askjndkj', docs);
      res.render('Student/history', {
        prevRequests: docs
      })

    }
  })
})


router.route('/dashboard/requests/send').post((req, res) => {
  let name = req.body.name;
  let location = req.body.location;
  let reason = req.body.reason;
  let outtime = req.body.outtime;
  let intime = req.body.intime;

  console.log(name, location, reason, outtime, intime);

  Request.findOne({
    id
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
        actual_intime: 'null',
        id: id,
        outtime: outtime,
        intime: intime
      });

      request.save(function(err, book) {
        if (err) return console.error(err);
        console.log(book.name + " saved to requests collection.");
      });
      flag1 = 0;
      res.render('Student/index', {
        flag1
      });
    } else {

      Request.findOneAndUpdate({
        "id": id
      }, {
        "$set": {
          location: location,
          reason: reason,
          req_status: 'pending',
          outing_status: 'null',
          actual_intime: 'null',
          outtime: outtime,
          intime: intime
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
