const express = require('express')
const session = require('express-session');
const bcrypt = require('bcrypt')
const { default: mongoose } = require('mongoose')
const app = express()
const Note = require('./models/Note')
const User = require('./models/user')
app.use(express.json({extended : true}))
app.use(express.urlencoded())
// app.use(express.static(__dirname + '/public'))

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 } // session timeout of 60 seconds
}));

app.use(express.static(__dirname, { 
  setHeaders: (res, path, stat) => {
    res.set('Content-Type', 'text/css');
  },
}));
const port = 3000
const uri = 
  "mongodb+srv://preethishsg:Pree2ign4730@notesapp.ohyvyda.mongodb.net/?retryWrites=true&w=majority";

// // include crypto module
// const crypto = require("crypto");

// // set encryption algorithm
// const algorithm = 'aes-256-cbc'

// // private key
// const key = "adnan-tech-programming-computers";

// // random 16 digit initialization vector
// const iv = crypto.randomBytes (16);

mongoose.connect(uri).
  catch(error => console.log("Unable to connect to DB!", error));

app.get('/', (req, res) => {
  // const sessionData = req.session;

  // const isLoggedIn = req.session.isLoggedIn;
  // const username = req.session.username;

  // if (isLoggedIn) {
  //   res.render('/', { username });
  // } else {
  //   res.redirect('/login');
  // }

  //  try {
  //       res.status(200).json({
  //           status: "success",
  //           data: [],
  //           message: "Welcome to our API homepage!",
  //       });
  //   } catch (err) {
  //       res.status(500).json({
  //           status: "error",
  //           message: "Internal Server Error",
  //       });
  //   }
  res.sendFile("pages/index.html", {root : __dirname})
})

app.get('/login', (req, res) => {
  res.sendFile("/pages/login.html", {root : __dirname})
})
app.get('/signup', (req, res) => {
  res.sendFile("/pages/signup.html", {root : __dirname})
})

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
});

// Endpoints for APIS 
app.post('/getnotes', async(req, res) => {
    let notes = await Note.find({email: req.body.email})
    res.status(200).json({success: true, notes})
    })

app.post('/login', async(req, res) => {
    const {userToken} = req.body

    const { email, password } = req.body;
    // console.log("HERE")
    // console.log(req.body)
    let user = await User.findOne({email})

    console.log(user)
    const isMatch = await user.validPassword(password);
    console.log(isMatch)
    if (user) {
      if (isMatch) {
        req.session.isLoggedIn = true;
        req.session.username = user.email;
        res.status(200).json ({success: true, message: "User found"})
        // res.redirect('/');
      } else {
        res.status(200).json ({success: true, message: "Invlaid credentials"})
        // res.redirect('/login');
      }
    } else {
      res.status(400).json ({success: false, user : {email : user.email}, message: "No User found"})
      // res.redirect('/login');
    }
  })

    // let user = await User.findOne(req.body)
    // if(!user) {
    //     res.status(200).json ({success: false, message: "No user found"})
    // }
    // else{
    //     res.status(200).json ({success: true, user : {email : user.email}, message: "User found"})
    // }
    // })

app.post('/signup', async(req, res) => {
    // const {userToken} = req.body     
    console.log("Creating user!!!")
    // console.log(req.body)
    const {name, email, password } = req.body;
    let user = await User.findOne({email})
    console.log(user)
    if(user) {
      console.log("user exists")
      res.status(200).json({success: true, user : {email : user.email}, message: "User already exists!"})
    }
    else {
      if (!email) res.status(400).json({success: false, message: "Please enter a valid email!"})
      if (!password) res.status(400).json({success: false, message: "Please enter a valid password!"})
      console.log("user does not exists")
      user =  await User.create({name, email})
      await user.setPassword(password)
      console.log(user)
      res.status(200).json({success : true, user : user, message: "User created successfully.You can now login!"})
    }
  })

app.post('/addnote', async(req, res) => {
    // const {userToken} = req.body
    let note = await Note.create(req.body)
    res.status(200).json({success : true, note})
    })

app.post('/deletenote', (req, res) => {
    // const {userToken} = req.body
    res. sendFile("pages/signup.html", {root: _dirname})
    })

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
