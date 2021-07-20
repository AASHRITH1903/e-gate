//jshint esversion:6
// library
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path")
const mongoose = require('mongoose')
const bcrypt = require("bcrypt");

// Routers
const AdminRouter = require("./routes/admin_routes")
const StudentRouter = require("./routes/student_routes")

//middleware
app.set(cors());
app.use(express.json());
app.use(express.urlencoded());

app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, '/public')));


// db connection

const URI = 'mongodb+srv://devuser:devuser@cluster0.frefb.mongodb.net/Egate?retryWrites=true&w=majority'
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
mongoose.connection.once('open', () => console.log("Database connection established"))
mongoose.set('useFindAndModify',false);

//routes

app.get("/", function(req, res){
  let data = 0;
  data = 0;
  res.render('Home/index', {
    data
  });
});

app.use("/admin", AdminRouter);
app.use("/student",StudentRouter);


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
