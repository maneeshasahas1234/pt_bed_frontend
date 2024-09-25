import React, { useState } from 'react';
import axios from 'axios';
import './LatestPatientData.css'; // Import the CSS file

const LatestPatientData = () => {
    const [patientData, setPatientData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchLatestPatientData = async () => {
        setLoading(true);
        setError(null); // Reset error state before fetching data
        try {
            const response = await axios.get('/getnew');
            console.log(response); // Adjust the API endpoint accordingly
            setPatientData(response.data);
        } catch (err) {
            setError('Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Helper function to check if the current row should be highlighted
    const shouldHighlightRow = (currentPatient, index) => {
        return patientData.some((patient, i) =>
            i !== index && patient.bedNo === currentPatient.bedNo &&
            (patient.name !== currentPatient.name)
        );
    };

    return (
        <div className="container">
            <h2>Latest Patient Data</h2>
            <button onClick={fetchLatestPatientData}>Display Data</button>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {patientData.length > 0 && (
                <table>
                    <thead>
                    <tr>
                        <th>Bed No</th>
                        <th>Timestamp</th>
                        <th>Patient Name</th>
                        <th>Owner No</th>
                    </tr>
                    </thead>
                    <tbody>
                    {patientData.map((patient, index) => (
                        <tr
                            key={index}
                            style={{
                                backgroundColor: shouldHighlightRow(patient, index) ? 'red' : 'white'
                            }} // Conditional styling
                        >
                            <td>{patient.bedNo}</td>
                            <td>{new Date(patient.timestamp).toLocaleString()}</td>
                            <td>{patient.name}</td>
                            <td>{patient.bhtNo}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LatestPatientData;
