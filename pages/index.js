import { useState, useEffect } from 'react';

import Login from '../components/Login';
import UserInterface from '../components/UserInterface';

export default function Home() {
    const [patients, setPatients] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            const response = await fetch('/api/patients');
            const data = await response.json();
            setPatients(data);
        };
        fetchPatients();
    }, []);

    const handleLogin = (email, password) => {
        const foundUser = patients.find((u) => u.email === email && u.password === password);
        if (foundUser) {
            setUser(foundUser);
        } else {
            alert('Invalid email or password');
        }
    };

    return (<>
                <h1>Welcome to the EMR System</h1>
                {user ? <UserInterface patient={user} /> : <Login onLogin={handleLogin} />}
        </>);
}