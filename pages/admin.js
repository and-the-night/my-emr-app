import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import MedicationForm from '../components/MedicationForm';
import AppointmentForm from '../components/AppointmentForm';
import PatientForm from '../components/PatientForm';

Modal.setAppElement('#__next');

export default function Admin() {
    const [patients, setPatients] = useState([]);
    const [newPatient, setNewPatient] = useState({ name: '', email: '', password: '', appointments: [], prescriptions: [] }); 
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            const response = await fetch('/api/patients');
            const data = await response.json();
            setPatients(data);
        };
        fetchPatients();
    }, []);

    const openPatientDetails = (id) => {
        const patient = patients.find(p => p.id === id);
        setNewPatient(patient);
        setIsEditing(true);
        setActiveModal('patient');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPatient((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const url = `/api/patients`;

        const response = await fetch(url, {
            method: isEditing ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPatient),
        });

    if (response.ok) {
        const patientData = await response.json();
        if (isEditing) {
            setPatients((prev) => prev.map(p => (p.id === patientData.id ? patientData : p)));
        } else {
            setPatients((prev) => [...prev, patientData]);
        }
        resetModal();
    } else {
        setError('Failed to save patient.');
    }
};

// Function to reset modal data
    const resetModal = () => {
        setNewPatient({ name: '', email: '', password: '', appointments: [], prescriptions: [] });
        setActiveModal(null);
        setIsEditing(false);
        setError('');
    };

    const handleMedSubmit = (medication) => {
        const updatedPrescriptions = [...(newPatient.prescriptions || []), { ...medication, id: (newPatient.prescriptions?.length || 0) + 1 }];
        setNewPatient((prev) => ({
            ...prev,
            prescriptions: updatedPrescriptions,
        }));
        setActiveModal('patient'); 
    };

    const handleAppSubmit = async (appointment) => {
        const updatedAppointments = [...(newPatient.appointments || []), { ...appointment, id: (newPatient.appointments?.length || 0) + 1 }];
        setNewPatient((prev) => ({
            ...prev,
            appointments: updatedAppointments,
        }));
        setActiveModal('patient');
    };

    const handlePatientDelete = async (e, id) => {
        e.stopPropagation(); 
        const response = await fetch(`/api/patients`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });

        if (response.ok) {
            setPatients((prev) => prev.filter((patient) => patient.id !== id));
        } else {
            console.error('Failed to delete patient.');
        }
    };

    const handleAppointmentDelete = (appointmentId) => {
        const updatedAppointments = newPatient.appointments.filter(app => app.id !== appointmentId);
        setNewPatient((prev) => ({
            ...prev,
            appointments: updatedAppointments,
        }));
    };

    const handlePrescriptionDelete = (prescriptionId) => {
        const updatedPrescriptions = newPatient.prescriptions.filter(pres => pres.id !== prescriptionId);
        setNewPatient((prev) => ({
            ...prev,
            prescriptions: updatedPrescriptions,
        }));
    }

    return (
        <div>
            <MedicationForm 
                isOpen={activeModal === 'prescriptions'} 
                onRequestClose={() => setActiveModal('patient')} 
                onSubmit={handleMedSubmit} 
            />

            <AppointmentForm 
                isOpen={activeModal === 'appointments'} 
                onRequestClose={() => setActiveModal('patient')} 
                onSubmit={handleAppSubmit} 
            />

            <PatientForm
                isOpen={activeModal === 'patient'}
                onRequestClose={() => setActiveModal(null)}
                onSubmit={handleSubmit}
                isEditing={isEditing}
                error={error}
                newPatient={newPatient}
                handleInputChange={handleInputChange}
                handleAppointmentDelete={handleAppointmentDelete}
                handlePrescriptionDelete={handlePrescriptionDelete}
                setActiveModal={setActiveModal}
            />

            <h1>Admin Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Appointments</th>
                        <th>Prescriptions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient => (
                        <React.Fragment key={patient.id}>
                            <tr>
                                <td>{patient.name}</td>
                                <td>{patient.appointments?.length} upcoming</td>
                                <td>{patient.prescriptions?.length} prescriptions</td>
                                <td>
                                    <button onClick={() => openPatientDetails(patient.id)}>Edit</button>
                                    <button onClick={(e) => handlePatientDelete(e, patient.id)}>Delete</button>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <button onClick={() => {
                resetModal();
                setActiveModal('patient');
                setIsEditing(false);
            }}>Add New Patient</button>
        </div>
    );
}
