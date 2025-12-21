const HttpError = require("../models/ErrorModel");
const {v4:uuid} = require("uuid");
const cloudinary = require("../utils/cloudinary")
const ElectionModel = require("../models/electionModel");
const CandidateModel = require("../models/candidateModel");
const path = require("path");

// Add new election
// Post Request : api/elections/
// protected (only admin)
const addElection =async(req,res,next)=>{
    try {
        // only admin can add election
        if(!req.user.isAdmin){
            return next(new HttpError("Only admin can add election",403));
        }
    
        const {title,description} = req.body;
        if(!title || !description){
            return next(new HttpError("All fields are required",422));
        }
    
        if(!req.files.thumbnail){
            return next(new HttpError("Thumbnail is required",422));
        }
    
        const {thumbnail}= req.files;
        // image should be less than 1mb
        if(thumbnail.size > 1*1024*1024){
            return next(new HttpError("Thumbnail size should be less than 1MB",422));
        }
        // rename the image
        let fileName = thumbnail.name;
        fileName = fileName.split(".")
        fileName = fileName[0]+ uuid()+"."+fileName[fileName.length -1];
        // upload file to uploads folder 
        await thumbnail.mv(path.join(__dirname,"..","uploads",fileName),async(err)=>{
            if(err){
                return next(new HttpError(err));
            }
            // store image to cloudinary
            const result = await cloudinary.uploader.upload(path.join(__dirname,"..","uploads",fileName),{resource_type:"image"})
            if(!result.secure_url){
                return next(new HttpError("Could not upload image to cloudinary",422));
            }
            const newElection = await ElectionModel.create({
                title,
                description,
                thumbnail:result.secure_url,
            });
            res.json(newElection)
        });
    } catch (error) {
        return next(new HttpError(error));
    }
}

// get all elections
// get Request : api/elections/
// protected 
const getElections =async(req,res,next)=>{
    try {
        const elections = await ElectionModel.find();
        res.status(200).json(elections);
    } catch (error) {
        return next(new HttpError(error));
    }
}



// get single  election
// get Request : api/elections/:id
// protected 
const getElection =async(req,res,next)=>{
    try {
        const {id} = req.params;
        const election = await ElectionModel.findById(id);
        if(!election){
            return next(new HttpError("Election not found",422));
        }
        res.status(200).json(election);
    } catch (error) {
        return next(new HttpError(error));
    }
}

// get  election candidates
// get Request : api/elections/:id/candidates
// protected 
const getCandidatesOfElection =async(req,res,next)=>{
    try {
        const {id} = req.params;
        const candidates = await CandidateModel.find({election:id});
        res.status(200).json(candidates);
    } catch (error) {
        return next(new HttpError(error));
    }
}

// get voters of election
// get Request : api/elections/:id/voters
// protected
const getElectionVoters =async(req,res,next)=>{
    try {
        const {id} = req.params;
        const response = await ElectionModel.findById(id).populate("voters");
        if(!response){
            return next(new HttpError("Election not found",422));
        }
        res.status(200).json(response.voters);
    } catch (error) {
        return next(new HttpError(error));
    }
}


// update election
// patch Request : api/elections/:id
// protected (only admin)
const updateElection =async(req,res,next)=>{
    try {
        // only admin can add election
        if(!req.user.isAdmin){
            return next(new HttpError("Only admin can add election",403));
        }
        const {id} = req.params;
        const {title,description} = req.body;
        if(!title || !description){
            return next(new HttpError("All fields are required",422));
        }
        if(req.files && req.files.thumbnail){
            const {thumbnail}= req.files;
            // image should be less than 1mb
            if(thumbnail.size > 1*1024*1024){
                return next(new HttpError("Thumbnail size should be less than 1MB",422));
            }
            // rename the image
            let fileName = thumbnail.name;
            fileName = fileName.split(".")
            fileName = fileName[0]+ uuid()+"."+fileName[fileName.length -1];
            thumbnail.mv(path.join(__dirname,"..","uploads",fileName),async(err)=>{
                if(err){
                    return next(new HttpError(err));
                }
                // store image to cloudinary
                const result = await cloudinary.uploader.upload(path.join(__dirname,"..","uploads",fileName),{resource_type:"image"})
                // check if cloudinary upload was successful
                if(!result.secure_url){
                    return next(new HttpError("Could not upload image to cloudinary",422));
                }
                await ElectionModel.findByIdAndUpdate(id,{
                    title,
                    description,
                    thumbnail:result.secure_url,
                });
                res.json("Election updated successfully",200);
            });
        }
    } catch (error) {
        return next(new HttpError(error));
    }
}


// delete election
// delete Request : api/elections/:id
// protected (only admin)
const removeElection =async(req,res,next)=>{
    try {
        // only admin can add election
        if(!req.user.isAdmin){
            return next(new HttpError("Only admin can add election",403));
        }
        const {id} = req.params;
        await ElectionModel.findByIdAndDelete(id);
        // delete candidates of this election
        await CandidateModel.deleteMany({election:id});
        res.status(200).json("Election deleted successfully");
        
    } catch (error) {
        return next(new HttpError(error));
    }
}

module.exports={addElection,getElections,getElection,getCandidatesOfElection,getElectionVoters,updateElection,removeElection};