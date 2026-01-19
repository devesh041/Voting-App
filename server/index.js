const express = require('express');
const cors = require('cors');
const {connect} = require('mongoose');
const upload = require('express-fileupload');

require('dotenv').config();

const Routes = require('./routes/Routes');
const {notFound, errorHandler} = require('./middleware/errorMiddleware');

const app = express();
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true, 
    optionsSuccessStatus: 200
}));
app.use(upload());

app.use('/api',Routes)

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;


connect(process.env.MONGO_URL).then(app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
})).catch((err)=>console.log(err));