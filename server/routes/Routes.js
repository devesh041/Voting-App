const {Router} = require('express');
const {registerVoter} = require('../controllers/voterController');


const router = Router();

router.post('/voters/register',registerVoter);

module.exports = router;