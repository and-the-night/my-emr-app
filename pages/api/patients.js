import { MongoClient } from 'mongodb'; // Import MongoDB client

const uri = process.env.MONGODB_URI; // Get the MongoDB URI from environment variables

// Load patients data from JSON file (for initial seeding if needed)
const loadPatientsData = () => {
    // Placeholder for loading logic if you need to seed
    // e.g. reading from a JSON file
};

export default async function handler(req, res) {
    const client = new MongoClient(uri); // Create a new MongoDB client

    try {
        await client.connect(); // Wait for the client connection
        const db = client.db('Zealthy'); // Use the actual database name

        if (req.method === 'GET') {
            // Fetch all patients data
            const patients = await db.collection('patients').find({}).toArray(); // Get patient data
            console.log('Fetched patients:', patients); // Log fetched patients for debugging
            return res.status(200).json(patients); // Return the list of patients
        } 
        else if (req.method === 'POST') {
            // Logic for creating a new patient
            const newPatient = { ...req.body, id: (await db.collection('patients').countDocuments()) + 1 }; // Assign ID
            await db.collection('patients').insertOne(newPatient); // Insert new patient into the collection
            return res.status(201).json(newPatient); // Send back the created patient
        } 
        else if (req.method === 'PUT') {
            // Logic for updating an existing patient
            const { id, ...updatedPatient } = req.body; // Get the patient ID and updated data
            const patientIndex = await db.collection('patients').findOne({ id: parseInt(id) });

            if (patientIndex) {
                await db.collection('patients').updateOne(
                    { id: parseInt(id) }, // Find the patient by ID
                    { $set: updatedPatient } // Update the patient fields
                );
                return res.status(200).json(updatedPatient); // Return the updated patient
            } else {
                return res.status(404).json({ message: 'Patient not found' }); // Handle not found
            }
        } 
        else if (req.method === 'DELETE') {
            // Logic for deleting a patient
            const { id } = req.body; // Get ID for deletion
            const result = await db.collection('patients').deleteOne({ id: parseInt(id) }); // Delete patient by ID

            if (result.deletedCount > 0) {
                return res.status(204).end(); // No content response
            } else {
                return res.status(404).json({ message: 'Patient not found' }); // Patient ID not found
            }
        } 
        else {
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            return res.status(405).end(`Method ${req.method} Not Allowed`); // Handle unsupported methods
        }
    } catch (error) {
        console.error('Error handling API request:', error); // Log any errors
        return res.status(500).json({ message: 'Internal Server Error' }); // Send back an error response
    } finally {
        await client.close(); // Ensure to close the client connection
    }
}
