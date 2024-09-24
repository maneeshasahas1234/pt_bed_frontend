const express = require('express');
const router = express.Router();
const cors = require('cors');
const {addPatients,getLatestPatients,latestPatentData} = require('../controllers/controllers');

router.use(cors(
    {
        origin: '*',
        credentials: true
    }
));


router.post('/addpatient',addPatients);
router.get('/getlatest',getLatestPatients);
router.get('/getnew',latestPatentData);


module.exports = router;