import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';



const uri = 'mongodb+srv://NoamB:cosarian78@cluster0.uj93uey.mongodb.net/Zealthy?retryWrites=true&w=majority'; 

async function seedDatabase() {
    const filePath = path.join(process.cwd(), 'data', 'seedData.json');
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8')); 

    const client = new MongoClient(uri); 

    try {
        await client.connect();
        const db = client.db('Zealthy');

        const insertResult = await db.collection('patients').insertMany(jsonData.users);
        console.log('Data successfully inserted:', insertResult.insertedCount);
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        await client.close();
    }
}

seedDatabase();
