import fs from 'fs';
import path from 'path';

const loadPatientsData = () => {
    const filePath = path.join(process.cwd(), 'data', 'seedData.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData);
};

const savePatientsData = (data) => {
    const filePath = path.join(process.cwd(), 'data', 'seedData.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); 
};

export default function handler(req, res) {
    const data = loadPatientsData(); 

    if (req.method === 'GET') {
        res.status(200).json(data.users);
    } else if (req.method === 'POST') {
        const newPatient = {...req.body, id: data.users.length + 1};
        data.users.push(newPatient);
        savePatientsData(data);
        res.status(201).json(newPatient);
    } else if (req.method === 'PUT') {
        const updatedPatient = req.body;
        const patientIndex = data.users.findIndex(patient => patient.id === updatedPatient.id);
        
        if (patientIndex > -1) {
            data.users[patientIndex] = updatedPatient;
            savePatientsData(data);
            res.status(200).json(updatedPatient);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.body; 
        const patientIndex = data.users.findIndex((patient) => patient.id === id);

        if (patientIndex > -1) {
            data.users.splice(patientIndex, 1);
            savePatientsData(data);
            res.status(204).end(); 
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
