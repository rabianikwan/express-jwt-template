const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require("./routes/authRoutes");
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://rabian:rabian@cluster-net.d69djmj.mongodb.net/jwt-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(process.env.PORT_DB))
  .then(() => console.log("database has connected"))
  .catch((err) => console.log(err));


// routes
app.get("*", checkUser)
app.get('/', requireAuth, (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)



app.listen(port, () => console.log("get this http://localhost:" + port))