const {Router} = require('express');
const {registerVoter,loginVoter,getVoter} = require('../controllers/voterController');
const {addElection,getElections,getElection,getCandidatesOfElection,getElectionVoters,updateElection,removeElection} = require('../controllers/electionController');



const router = Router();

router.post('/voters/register',registerVoter);
router.post('/voters/login',loginVoter);
router.post('/voters/:id',getVoter);


router.post('/elections',addElection)
router.get('/elections',getElections)
router.get('/elections/:id',getElection)
router.delete('/elections/:id',removeElection)
router.patch('/elections/:id',updateElection)
router.get('/elections/:id/candidates',getCandidatesOfElection)
router.get('/elections/:id/voters',getElectionVoters)


module.exports = router;