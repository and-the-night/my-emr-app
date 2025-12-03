import fs from 'fs';
import path from 'path';
import clientPromise from '../../lib/mongodb'; 

const loadPatientsData = () => {
    const filePath = path.join(process.cwd(), 'data', 'seedData.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData); 
};

const savePatientsData = (data) => {
    const filePath = path.join(process.cwd(), 'data', 'seedData.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); 
};

export default async function handler(req, res) {
    try {
        const client = await clientPromise; 
        const db = client.db('Zealthy'); 

        if (req.method === 'GET') {
            const patients = await db.collection('patients').find({}).toArray(); 
            res.status(200).json(patients); 
        } 
        else if (req.method === 'POST') {
            const newPatient = { ...req.body, id: (await db.collection('patients').countDocuments()) + 1 }; 
            await db.collection('patients').insertOne(newPatient);
            res.status(201).json(newPatient);
        } 
        else if (req.method === 'PUT') {
            const { id, ...updatedPatient } = req.body;
            delete updatedPatient._id;
            
            const result = await db.collection('patients').updateOne(
                { id: parseInt(id) }, 
                { $set: updatedPatient }
            );

            if (result.matchedCount > 0) {
                res.status(200).json(updatedPatient);
            } else {
                res.status(404).json({ message: 'Patient not found' });
            }
        } 
        else if (req.method === 'DELETE') {
            const { id } = req.body; 
            const result = await db.collection('patients').deleteOne({ id: parseInt(id) });

            if (result.deletedCount > 0) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: 'Patient not found' });
            }
        } 
        else {
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error handling API request:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
