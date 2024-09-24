const { PatientOld } = require('../models/models');

const addPatients = async (req, res) => {
    try {
        const patientData = req.body;

        console.log('Incoming Patient Data:', patientData); // Debug log

        // Prepare the data to match the schema fields (name and bhtNo can be empty)
        const formattedPatients = patientData.map(patient => ({
            bedNo: patient.bedno,
            name: patient.ptName || '',  // Default to empty string if no name is provided
            bhtNo: patient.bhtNo || '',  // Default to empty string if no BHT number is provided
        }));

        console.log('Formatted Patients:', formattedPatients); // Debug log

        // Insert the data into the database
        const insertedPatients = await PatientOld.insertMany(formattedPatients, { ordered: false });

        console.log('Inserted Patients:', insertedPatients); // Debug log

        // Respond with the inserted data
        res.status(201).json({
            message: 'Patients added successfully',
            data: insertedPatients,
        });
    } catch (error) {
        console.error('Error adding patients:', error); // Error log
        if (error.code === 11000) {
            res.status(409).json({ message: 'Duplicate bed number found' });
        } else {
            res.status(500).json({ message: 'Error adding patients', error });
        }
    }
};

const getLatestPatients = async (req, res) => {
    try {
        // Fetch patients sorted by timestamp (latest first)
        const patients = await PatientOld.find().sort({ timestamp: -1 });

        // Respond with the patient data
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving patient data', error });
    }
};
const getNewPatients = async (req, res) => {
    try {
        // Fetch the two latest timestamps by sorting the patients based on 'timestamp', ignoring empty `ptName` and `bhtNo`
        const latestPatients = await PatientOld.find({
            ptName: { $ne: '' }, // Exclude empty `ptName`
            bhtNo: { $ne: '' },  // Exclude empty `bhtNo`
        }).sort({ timestamp: -1 }).limit(2);

        // Ensure we have at least two timestamps for comparison
        if (latestPatients.length < 2) {
            return res.status(200).json({ message: 'Not enough records for comparison', patients: [] });
        }

        // Extract the two latest timestamps
        const latestTimestamp = latestPatients[0].timestamp;
        const previousTimestamp = latestPatients[1].timestamp;

        // Get all patients with the most recent timestamp, excluding empty fields
        const newPatients = await PatientOld.find({
            timestamp: latestTimestamp,
            ptName: { $ne: '' }, // Exclude empty `ptName`
            bhtNo: { $ne: '' },  // Exclude empty `bhtNo`
        });

        // Get patients with the previous timestamp, excluding empty fields
        const previousPatients = await PatientOld.find({
            timestamp: previousTimestamp,
            ptName: { $ne: '' }, // Exclude empty `ptName`
            bhtNo: { $ne: '' },  // Exclude empty `bhtNo`
        });

        // Get a list of `bedNo` for patients from the previous timestamp
        const previousBedNos = previousPatients.map(patient => patient.bedNo);

        // Filter out the patients who don't exist in the previous timestamp data (newly added patients)
        const newAddedPatients = newPatients.filter(patient => !previousBedNos.includes(patient.bedNo));

        // If no new patients, return an appropriate message
        if (newAddedPatients.length === 0) {
            return res.status(200).json({ message: 'No new patients found', patients: [] });
        }

        // Return new patients
        res.status(200).json({ message: 'New patients retrieved', patients: newAddedPatients });
    } catch (error) {
        console.error('Error fetching new patients:', error);
        res.status(500).json({ message: 'Error fetching new patients', error });
    }
};


const latestPatentData = async (req, res) => {
    try {
        // Step 1: Retrieve all distinct bedNo values
        const distinctBedNos = await PatientOld.distinct('bedNo');

        // Step 2: Prepare to collect the latest data
        const latestPatients = [];

        // Step 3: Loop through each bedNo and get the latest 2 timestamps
        for (const bedNo of distinctBedNos) {
            const latestData = await PatientOld.find({ bedNo })
                .sort({ timestamp: -1 }) // Sort by timestamp descending
                .limit(2); // Limit to the latest 2 records

            if (latestData.length) {
                latestPatients.push(...latestData);
            }
        }

        // Step 4: Send the response
        res.status(200).json(latestPatients);
    } catch (error) {
        console.error('Error retrieving patient data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

};










module.exports = {
    addPatients,
    getLatestPatients,
    getNewPatients,
    latestPatentData,
};
