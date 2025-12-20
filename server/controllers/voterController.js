const VoterModel = require("../models/voterModel");
const HttpError = require("../models/ErrorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

// function to generate JWT Token
const generateToken = (payload)=>{
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1d"});
    return token;
}

// Login Voter
// Post Request : api/voters/login
// Unprotected 
const loginVoter =async (req,res,next)=>{
    try {
        const {email,password} = req.body;
        
        // Check for missing fields
        if(!email || !password){
            return next(new HttpError("Please fill all the fields",422));
        }
        const newEmail = email.toLowerCase();
        // check if email exists in db
        const voter = await VoterModel.findOne({email:newEmail});
        if(!voter){
            return next(new HttpError("Invalid Credentials",422));
        }
        // compare password
        const comparePass = await bcrypt.compare(password,voter.password);
        if(!comparePass){
            return next(new HttpError("Invalid Credentials",422));
        }

        // generate JWT Token
        const {_id:id,isAdmin,votedElections} = voter;
        const token = generateToken({id,isAdmin});

        res.json({token,id,votedElections,isAdmin})
    } catch (error) {
        return next(new HttpError("Voter Login Failed check credentials",422));
    }
}

// Get Voter
// Post Request : api/voters/:id
// protected 
const getVoter =async(req,res,next)=>{
    try {
        const {id} = req.params;
        const voter = await VoterModel.findById(id).select("-password");
        if(!voter){
            return next(new HttpError("Voter not found",422));
        }
        res.json(voter);
    } catch (error) {
        return next(new HttpError("Couldn't Fetch Voter",422));
    }
}



module.exports={registerVoter,loginVoter,getVoter};
