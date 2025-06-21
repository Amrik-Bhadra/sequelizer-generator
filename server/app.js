require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieparser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const modelRoutes = require('./routes/models.routes');
const relationshipRoutes = require('./routes/relationship.routes');

let myOrigin = process.env.ENVIRONMENT === 'prod'
  ? 'https://sequelizer.netlify.app'
  : 'http://localhost:5173';

// cors setup
const corsOption = {
    origin: myOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
};

const port = process.env.PORT || 3000

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOption));
app.use(cookieparser());

app.use('/api/auth', authRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/relationship', relationshipRoutes);


app.get('/', (req, res)=>{
  res.send('welcome to sequelizer');
})

//listen to server
app.listen(port, ()=>{
    console.log(`App is listening at  ${port} ✅`);
});