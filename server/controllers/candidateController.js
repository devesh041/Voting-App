// Add Candidate 
// Post Request : api/candidates/
// protected (only admin)
const addCandidate =(req,res,next)=>{
    res.json("Add Candidate");
}

// get Candidate 
// get Request : api/candidates/:id
// protected 
const getCandidate =(req,res,next)=>{
    res.json("Get Candidate");
}

// remove Candidate 
// delete Request : api/candidates/:id
// protected (only admin)
const removeCandidate =(req,res,next)=>{
    res.json("Remove Candidate");
}

// vote Candidate 
// patch Request : api/candidates/:id
// protected
const voteCandidate =(req,res,next)=>{
    res.json("Vote Candidate");
}

module.exports={addCandidate,getCandidate,removeCandidate,voteCandidate};
