const HttpError = require("../models/ErrorModel");
const {v4:uuid} = require("uuid");
const cloudinary = require("../utils/cloudinary")
const ElectionModel = require("../models/electionModel");
const CandidateModel = require("../models/candidateModel");
const VoterModel = require("../models/voterModel");
const path = require("path");
const mongoose = require("mongoose");

// Add Candidate 
// Post Request : api/candidates/
// protected (only admin)



const addCandidate =async (req,res,next)=>{
    try {
        if(!req.user.isAdmin){
            return next(new HttpError("Only admin can add election",403));
        }

        const {fullName , motto , currentElection} = req.body;
        if(!fullName || !motto) {
            return next(new HttpError("Fill in all fields", 422))
        }
        if(!req.files.image) {
            return next(new HttpError("Image is required" , 422))
        }

        const {image} = req.files;
        // image should be less than 1MB
        if(image .size > 1000000) {
            return next(new HttpError("image size should be less than 1MB",422))
        }
        // rename the image
        let fileName = image.name;
        fileName = fileName.split(".")
        fileName = fileName[0]+ uuid()+"."+fileName[fileName.length -1];
        // upload file to uploads folder 

        image.mv(path.join(__dirname, '..' , 'uploads' , fileName) , async (err) => {
            if(err) {
                return next(new HttpError(err))
            }
            // store image to cloudinary
            const result = await cloudinary.uploader.upload(path.join
                (__dirname, '..' , 'uploads' , fileName), {resource_type: "image"})
            if(!result.secure_url) {
                    return next (new HttpError("Could not upload image to cloudinary"))
            }
            const newCandidate = await CandidateModel.create({
                fullName,
                motto,
                image: result.secure_url,
                election: currentElection
            })

            // get election ans push candidate to election
            let election = await ElectionModel.findById(currentElection)

            const session = await mongoose.startSession()
            session.startTransaction()
            await newCandidate.save({session})
            election.candidates.push(newCandidate)

            await election.save({session})
            await session.commitTransaction()

            res.status(201).json("Candidate added succesfully")

        })

    } catch (error) {
        return next(new HttpError(error));
    }
}

// get Candidate 
// get Request : api/candidates/:id
// protected 
const getCandidate = async (req,res,next)=>{
    try {
        const {id} = req.params;
        const candidate = await CandidateModel.findById(id)
        if(!candidate){
            return next (new HttpError("Candidate not found",422))
        }
        res.json(candidate)
    } catch (error) {
        return next (new HttpError(error));
    }
}

// remove Candidate 
// delete Request : api/candidates/:id
// protected (only admin)
const removeCandidate = async (req,res,next)=>{
   try {
      if(!req.user.isAdmin){
            return next(new HttpError("Only admin can add election",403));
        }

        const {id} = req.params;
        const candidate = await CandidateModel.findById(id)
        .populate("election");
        if(!candidate) {
            return next (new HttpError("Candidate not found" , 422))
        }
        
        const session = await mongoose.startSession();
        session.startTransaction();
        await candidate.deleteOne({session})
        candidate.election.candidates.pull(candidate);
        await candidate.election.save({session});
        await session.commitTransaction();

        res.status(200).json("Candidate removed successfully");
   } catch (error) {
     return next (new HttpError(error));
   }
}

// vote Candidate 
// patch Request : api/candidates/:id
// protected
const voteCandidate = async (req,res,next)=>{
    try {
        const {id: candidateId} = req.params;
        const {currentVoterId , selectedElection}  = req.body; 
        const candidate = await CandidateModel.findById(candidateId);
        const newVoteCount = candidate.voteCount + 1;

        await CandidateModel.findByIdAndUpdate(candidateId , {voteCount: newVoteCount} , {new: true})

        const session = await mongoose.startSession();
        session.startTransaction();
        let voter = await VoterModel.findById(currentVoterId);
        await voter.save({session})

        let election = await ElectionModel.findById(selectedElection);
        election.voters.push(voter);
        voter.votedElections.push(election)
        await election.save({session})
        await voter.save({session})
        await session.commitTransaction();

        res.status(200).json("Voted Successfully");

    } catch (error) {
        return next( new HttpError(error));
    }
}

module.exports={addCandidate,getCandidate,removeCandidate,voteCandidate};
