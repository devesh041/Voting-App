const express = require('express');
const cors = require('cors');
const {connect} = require('mongoose');

require('dotenv').config();

const Routes = require('./routes/Routes');

const app = express();
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(cors({extended: true,origin:["http://localhost:3000",]}));

app.use('/api',Routes)


const PORT = process.env.PORT || 5001;


connect(process.env.MONGO_URL).then(app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
})).catch((err)=>console.log(err));