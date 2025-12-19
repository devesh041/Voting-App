const VoterModel = require("../models/voterModel");
const HttpError = require("../models/ErrorModel");
const bcrypt = require("bcryptjs");

// Register Voter
// Post Request : api/voters/register
// Unprotected 
const registerVoter = async (req,res,next)=>{
    try {
        const {fullName,email,password,password2} = req.body;

        // Check for missing fields
        if(!fullName || !email || !password || !password2){
            return next(new HttpError("Please fill all the fields",422));
        }

        // make all email to lowercase
        const newEmail = email.toLowerCase();
        // check if email already exists in db
        const emailExists = await VoterModel.findOne({email:newEmail});
        if(emailExists){
            return next(new HttpError("Email already exists",422));
        }
        // make sure password 6+ chars
        if((password.trim().length) < 6){
            return next(new HttpError("Password must be at least 6 characters",422));
        }
        // check if passwords match
        if(password !== password2){
            return next(new HttpError("Passwords do not match",422));
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        // no voter should be admin except for one with email achiever@gmail.com
        let isAdmin = false;
        if(newEmail === "achiever@gmail.com"){
            isAdmin = true;
        }
        // save new voter to db
        const newVoter = await VoterModel.create({
            fullName,
            email:newEmail,
            password:hashedPassword,
            isAdmin
        });
        res.status(201).json(`New Voter ${fullName} created successfully`);

    } catch (error) {
        return next(new HttpError("Voter Registration Failed",422));
    }
}


// Login Voter
// Post Request : api/voters/login
// Unprotected 
const loginVoter =async (req,res,next)=>{
    res.json("Login Voter");
}

// Get Voter
// Post Request : api/voters/:id
// protected 
const getVoter =async(req,res,next)=>{
    res.json("Get Voter");
}



module.exports={registerVoter,loginVoter,getVoter};
