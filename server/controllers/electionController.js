// Add new election
// Post Request : api/elections/
// protected (only admin)
const addElection =(req,res,next)=>{
    res.json("Add Election");
}

// get all elections
// get Request : api/elections/
// protected 
const getElections =(req,res,next)=>{
    res.json("Get all Elections");
}



// get single  election
// get Request : api/elections/:id
// protected 
const getElection =(req,res,next)=>{
    res.json("Get single Election");
}

// get  election candidates
// get Request : api/elections/:id/candidates
// protected 
const getCandidatesOfElection =(req,res,next)=>{
    res.json("Get candidates of Election");
}

// get voters of election
// get Request : api/elections/:id/voters
// protected
const getElectionVoters =(req,res,next)=>{
    res.json("Get voters of Election");
}


// update election
// patch Request : api/elections/:id
// protected (only admin)
const updateElection =(req,res,next)=>{
    res.json("Update Election");
}


// delete election
// delete Request : api/elections/:id
// protected (only admin)
const removeElection =(req,res,next)=>{
    res.json("Delete Election");
}

module.exports={addElection,getElections,getElection,getCandidatesOfElection,getElectionVoters,updateElection,removeElection};