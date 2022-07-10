const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cors());

const tbl_accounts = require("./models/tbl_accounts");
const createUser = require("./services/createUser");

const tbl_projects = require("./models/tbl_projects");
const createProject = require("./services/createProject");

//Local host configuration
const database = "db_mern";
const db_config = "mongodb://localhost:27017";

mongoose.connect(
  `${db_config}/${database}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) =>
    err
      ? console.log("Database : Failed to connect")
      : console.log("Database : Successfully Connected")
);

//Register
app.post("/api/register", async (req, res) => {
  const { fname, lname, email } = req.body;

  //Encrypted password using brcyptjs
  const enc_password = await bcrypt.hash(req.body.password, 10);

  const results = await createUser(fname, lname, email, enc_password);
  if (results) {
    res.json({ status: "success" });
    console.log("Successfully registered");
  } else {
    res.json({ status: "Email is already taken!" });
  }
});

//Login
app.post("/api/login", async (req, res) => {
  const user = await tbl_accounts.findOne({
    email: req.body.email,
  });

  if (!user) {
    res.json({ status: "Invalid email address or password", user: false });
  } else {
    const password_verify = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (password_verify) { 
      const token = jwt.sign(
        {
          userId: user._id,
          fname: user.fname,
          lname: user.lname,
          email: user.email,
        },
        "secretkey123",
        {
          expiresIn: '1d'
        }
      );
      res.json({ status: "success", user: token });
      console.log("Successfully Login");
    } else {
      res.json({ status: "Incorrect email or password", user: false });
    }
  }
});

//Create
app.post("/api/create", async (req, res) => {
  const { user_id, title, description } = req.body;

  const results = await createProject(user_id, title, description);

  if (results) {
    console.error("Successfully Created");
    res.json({ status: "success"});
  } else {
    console.error("Something went wrong");
  }
});

//Read
app.post("/api/auth", async (req, res) => {
  const token = req.headers.access_token;

  try {
    const decoded = jwt.verify(token, "secretkey123");
    const email = decoded.email;
    const userId = decoded.userId;
    const user = await tbl_accounts.findOne({ email: email });
    const projectsRecord = await tbl_projects.find({
      user_id: userId
    })
    res.json({ status: "user authorized", userData: user, projectData: projectsRecord});
  } catch (error) {
    res.json({ status: "invalid token" });
  }
});

//Update
app.post("/api/update", async (req, res) =>{
  const {userId, projectId, title, description} = req.body;

  try {
    await tbl_projects.updateOne(
      {
        _id: projectId,
        user_id: userId
      },
      {
        title: title,
        description: description,
    })

    console.log("Updated Successfully");
    res.json({status: "success"});
  } catch (error) {
    console.log(error);
  }

  console.log()

});

//Delete
app.delete("/api/delete/:id", async (req, res) =>{
  const projectId = req.params.id;
  
  try {
    await tbl_projects.deleteOne({
      _id: projectId
    });
    console.log("Deleted Successfully");
  } catch (error) {
    console.log(error);
  }
});

//Get user record
app.get("/api/record/:id", async (req, res) =>{
  const recordId = req.params.id;
  try {
    const record = await tbl_projects.findOne({
      _id: recordId,
    })
    res.json({ status: "success", record})
  } catch (error) {
    console.log(error);
  }
})

const port = 3001;
app.listen(port, () => {
  console.log("Server Port : ", port);
});
