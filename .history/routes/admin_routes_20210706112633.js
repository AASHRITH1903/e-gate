const router = require("express").Router();
const path = require("path")
const mongoose = require("mongoose")

const Admin = require("../models/admin.model")
const Request = require('../models/request.model')
const Student = require('../models/student.model')

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
                        res.redirect('/admin/dashboard')
                }
        })

})

router.route('/dashboard').get((req, res) => {
        res.render('Admin/dashboard')
})

router.route('/dashboard/profile').get((req, res) => {
        res.render('Admin/profile')
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
        //console.log(username, password, email);
        const studentData = new Student({
                username: req.body.username,
                bloodgroup: '',
                phonenumber: '',
                password: req.body.password,
                email: req.body.email,
                gender: ''
        })
        //new Student(req.body);
        studentData.save()
                .then(item => {
                        res.send("Information saved to database");
                })
                .catch(err => {
                        res.status(400).send("Unable to save to database");
                });
        res.redirect('/admin/dashboard')
})

router.route('/dashboard/outer_status').get((req, res) => {
        OutingStatus.find({}, (err, docs) => {
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
                                console.log(accepted_requests);
                                res.render("Admin/outer_status", { reqs: accepted_requests })
                        })

                        /*
                        res.render('path_to_ejs' , {
                                name : "aasrith",
                                username : "jdnkjvn",
                                ph : 'djsbkjs'
                        })

                        <%= name %>
                        <%= username %>
                        <%= name %>
                         */
                }
        })
})

module.exports = router;