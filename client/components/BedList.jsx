import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RowComponent.css'; // Importing the CSS file

const RowComponent = ({ startIndex = 21 }) => {
    const fixedRows = 28; // Fixed number of rows
    const [data, setData] = useState(Array.from({ length: fixedRows }, () => ({ field1: '', field2: '' })));
    const [updateMessage, setUpdateMessage] = useState(''); // State for the update message
    const [selectedRows, setSelectedRows] = useState(Array(fixedRows).fill(false)); // State for tracking selected rows

    // Fetch the latest patient data from the backend
    const fetchLatestPatients = async () => {
        try {
            const response = await axios.get('/getlatest');
            const latestPatients = response.data;

            // Populate the data state with the latest patients
            const updatedData = data.map((row, index) => {
                const patient = latestPatients.find(p => p.bedNo === startIndex + index);
                return patient ? { field1: patient.name, field2: patient.bhtNo } : row;
            });

            setData(updatedData);
        } catch (error) {
            console.error('Error fetching latest patients:', error);
        }
    };

    // Use useEffect to fetch data when the component mounts
    useEffect(() => {
        fetchLatestPatients();
    }, []); // Empty dependency array means this runs once when component mounts

    const handleFieldChange = (index, field, value) => {
        const newData = [...data];
        newData[index][field] = value;
        setData(newData);
    };

    const handleCheckboxChange = (index) => {
        const newSelectedRows = [...selectedRows];
        newSelectedRows[index] = !newSelectedRows[index]; // Toggle selection
        setSelectedRows(newSelectedRows);
    };

    const handleUpdateAllRows = async () => {
        // Prepare the data to be sent to the backend for selected rows
        const updateData = data.reduce((acc, row, index) => {
            if (selectedRows[index]) {
                acc.push({
                    bedno: startIndex + index,
                    ptName: row.field1,
                    bhtNo: row.field2.replace(/\s+/g, '').toLowerCase(), // Remove spaces and convert to lowercase
                });
            }
            return acc;
        }, []);

        try {
            if (updateData.length > 0) { // Check if there's any data to send
                const response = await axios.post('/addpatient', updateData);
                console.log('Response from backend:', response.data);
                setUpdateMessage('Beds updated!'); // Set the update message

                // Clear the message after 3 seconds
                setTimeout(() => {
                    setUpdateMessage('');
                }, 3000);
            } else {
                setUpdateMessage('No rows selected!'); // Set message for no selection
            }
        } catch (error) {
            console.error('Error updating rows:', error);
            // Optionally, handle error response here (e.g., show an error message)
        }
    };

    return (
        <div className="row-container">
            {data.map((row, index) => (
                <div key={index} className="row">
                    {/* Checkbox for selecting the row */}
                    <input
                        type="checkbox"
                        checked={selectedRows[index]}
                        onChange={() => handleCheckboxChange(index)}
                        className="checkbox"
                    />
                    {/* Display "Bed No" label with custom index */}
                    <label className="row-label">Bed No {startIndex + index}:</label>
                    <input
                        type="text"
                        value={row.field1}
                        onChange={(e) => handleFieldChange(index, 'field1', e.target.value)}
                        placeholder="Patient Name"
                        className="input-field"
                    />
                    <input
                        type="text"
                        value={row.field2}
                        onChange={(e) => handleFieldChange(index, 'field2', e.target.value)}
                        placeholder="Bht Number"
                        className="input-field"
                    />
                </div>
            ))}
            <button className="update-button" onClick={handleUpdateAllRows}>Update Beds</button>
            {updateMessage && <p className="update-message">{updateMessage}</p>} {/* Display the message */}
        </div>
    );
};

export default RowComponent;
