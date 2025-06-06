require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();
const cors = require('cors');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const session = require('express-session');

const authRoutes = require('./routes/auth.routes');
const modelRoutes = require('./routes/models.routes');
console.log('modelRoutes:', typeof modelRoutes);
const relationshipRoutes = require('./routes/relationship.routes');

// cors setup
const corsOption = {
    origin: ['http://localhost:5173'],
    methods: 'GET,PATCH,PUT,POST,HEAD,DELETE',
    credentials: true,
    AccessControlAllowOrigin: true,
    optionsSuccessStatus: 200
}

const port = process.env.PORT || 3000

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOption));
app.use(cookieparser());

// session setup
// app.use(session({
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24, 
//     httpOnly: true,
//     secure: false,
//   }
// }));


app.use('/api/auth', authRoutes);
app.use('/api/models', modelRoutes);app.use('/api/relationship', relationshipRoutes);

//listen to server
app.listen(port, ()=>{
    console.log(`App is listening to the port ${port} ✅`);
});
