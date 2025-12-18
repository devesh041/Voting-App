
// Register Voter
// Post Request : api/voters/register
// Unprotected 
const registerVoter =(req,res,next)=>{
    res.json("Register Voter");
}


// Login Voter
// Post Request : api/voters/login
// Unprotected 
const loginVoter =(req,res,next)=>{
    res.json("Login Voter");
}

// Get Voter
// Post Request : api/voters/:id
// protected 
const getVoter =(req,res,next)=>{
    res.json("Get Voter");
}



module.exports={registerVoter,loginVoter,getVoter};
