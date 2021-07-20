const router = require("express").Router();
const path = require("path")
const mongoose = require("mongoose")

const Admin = require("../models/admin.model")
const Request = require('../models/request.model')
const Student = require('../models/student.model')

let id;

router.route('/login').get((req, res) => {
        //res.sendFile(path.join(__dirname , '..' , 'views', 'LoginForms', 'AdminLogin.html'))
        res.render('LoginForms/AdminLogin')
})

router.route('/login/check').post((req, res) => {
        let username = req.body.username;
        let password = req.body.password;

        console.log(username, password);

        Admin.findOne({ username, password }, (err, doc) => {
                if (err) {
                        console.log(err);
                } else if (!doc) {
                        console.log("admin not found");
                        res.redirect('/admin/login')
                } else {
                        id=doc.id;
                        res.redirect('/admin/dashboard')
                }
        })

})

router.route('/dashboard').get((req, res) => {
        Admin.findById(id, (err, doc) =>{
                if(err) {
                        console.log(err);
                } else if(!doc) {
                        console.log("admin not found");
                }
                else {
                        res.render('Admin/dashboard', {data: doc})
                }
        })
})

router.route('/dashboard/editprofile').get((req, res) => {
        Admin.findById(id, (err, doc) =>{
                if(err) {
                        console.log(err);
                } else if(!doc) {
                        console.log("admin not found");
                }
                else {
                        res.render('Admin/profile', {data: doc})
                }
        })
})

router.route('/dashboard/editprofile/update').post((req, res) => {
        // make a difference between name and username
        let fullname = req.body.fullname;
        let mobile = req.body.mobile;
        let email = req.body.email;
        let password = req.body.password;
        let reTypePassword = req.body.reTypePassword;
        let address = req.body.address;
      
        console.log(fullname, mobile, email, password, address, id);
      
        if (!(password === reTypePassword)) {
          console.log("Passwords do not match");
          flag1 = 0;        // fill it with("Passwords does not match string")
          res.redirect('/admin/dashboard');
        } else {
          // Find id
          Student.findOneAndUpdate({
            "_id": id
          }, {
            "$set": {
              "fullname": fullname,
              "mobile": mobile,
              "email": email,
              "password": password,
              "address": address
            }
          }).exec(function(err, book) {
            if (err) {
              console.log(err);
              res.status(500).send(err);
            } else {
              flag1 = 1; // 28
              Admin.findById(id, (err, doc) =>{
                if(err) {
                        console.log(err);
                } else if(!doc) {
                        console.log("admin not found");
                }
                else {
                        res.render('Admin/dashboard', {data: doc})
                }
        })
            }
          });
        }
      
        // Add ejs as profile edited option
        // res.redirect('/student/dashboard');
      })

router.route('/dashboard/outing_requests').get((req, res) => {

        Request.find({}, (err, docs) => {
                if (err) {
                        console.log(err);
                } else if (!docs) {
                        console.log("doc not found");
                } else {
                        console.log(docs);
                        res.render('Admin/outing_requests', { requests: docs })
                }
        })
})

router.route('/dashboard/outing_requests/accepted/:id').get((req, res) => {
        Request.findByIdAndUpdate(req.params.id, { req_status: "accepted", outing_status: "In" }, (err, doc) => {
                if (err) {
                        console.log(err);
                } else {
                        console.log("updated succesfully : ");
                        console.log(doc);
                        res.redirect('/admin/dashboard/outing_requests')
                }
        })
})

router.route('/dashboard/create_student').get((req, res) => {
        res.render('Admin/create_student')
})

router.route('/dashboard/create_student/create').post((req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        console.log(username, password, email);
        const studentData = new Student({
                username: username,
                bloodgroup: '',
                phonenumber: '',
                password: password,
                email: email,
                gender: ''
        })
        studentData.save(function(err, book) {
                if (err) return console.error(err);
                console.log(`new student ${studentData.username} created`);
              });
        res.redirect('/admin/dashboard/create_student')
})

router.route('/dashboard/outer_status').get((req, res) => {
        Request.find({}, (err, docs) => {
                if (err) {
                        console.log(err);
                } else if (!docs) {
                        console.log("doc not found");
                } else {
                        console.log(docs);
                        req_ids = []
                        docs.forEach((doc) => {
                                req_ids.push(mongoose.Types.ObjectId(doc.request_id))
                        })
                        Request.find({ '_id': { $in: req_ids } }, (err, accepted_requests) => {
                                console.log("safasf",accepted_requests);
                                res.render("Admin/outer_status", { reqs: accepted_requests })
                        })

                        
                        /*res.render('path_to_ejs' , {
                                name : "aasrith",
                                username : "jdnkjvn",
                                ph : 'djsbkjs'
                        })

                        <%= name %>
                        <%= username %>
                        <%= name %>*/
                         
                }
        })
})

module.exports = router;