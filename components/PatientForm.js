import Modal from 'react-modal';

export default function PatientForm({ 
    isOpen, onRequestClose, onSubmit, isEditing, error, newPatient, handleInputChange, handleAppointmentDelete, handlePrescriptionDelete, setActiveModal }) {
    return  <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={{ content: { maxWidth: '800px', margin: 'auto' } }}>
                <h2>{isEditing ? "Edit Patient" : "Add New Patient"}</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={onSubmit} className='patient-form'>
                    <div className='input-wrapper'>
                        <label>Name:</label>
                        <input
                            name="name"
                            placeholder="Name"
                            value={newPatient.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className='input-wrapper'>
                        <label>Email:</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={newPatient.email}
                            onChange={handleInputChange}
                            required
                            disabled={isEditing}
                        />
                    </div>
                    {!isEditing && (
                        <div className='input-wrapper'>
                            <label>Password:</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={newPatient.password}
                                onChange={handleInputChange}
                                required
                                disabled={isEditing} />
                        </div>
                    )}
                <div>
                    <h3>Appointments</h3>
                    {newPatient.appointments && newPatient.appointments.length === 0 && <p>No appointments scheduled.</p>}
                    {newPatient.appointments && newPatient.appointments.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Appointment Provider</th>
                                    <th>Date & Time</th>
                                    <th>Repeat</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newPatient.appointments && newPatient.appointments.map(appointment => (
                                    <tr key={appointment.id}>
                                        <td>{appointment.provider}</td>
                                        <td>{new Date(appointment.datetime).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                        <td>{appointment.repeat}</td>
                                        <td><button onClick={() => handleAppointmentDelete(appointment.id)}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>)}
                    <button onClick={() => setActiveModal('appointments')}>Add New Appointment</button>
                </div>
                <div>
                    <h3>Prescriptions</h3>
                    {newPatient.prescriptions && newPatient.prescriptions.length === 0 && <p>No Prescriptions found.</p>}
                    {newPatient.prescriptions && newPatient.prescriptions.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Medication</th>
                                    <th>Dosage</th>
                                    <th>Quantity</th>
                                    <th>Refill On</th>
                                    <th>Refill Schedule</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newPatient.prescriptions && newPatient.prescriptions.map(prescription => (
                                    <tr key={prescription.id}>
                                        <td>{prescription.medication}</td>
                                        <td>{prescription.dosage}</td>
                                        <td>{prescription.quantity}</td>
                                        <td>{prescription.refill_on}</td>
                                        <td>{prescription.refill_schedule}</td>
                                        <td><button onClick={() => handlePrescriptionDelete(prescription.id)}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>)}
                    <button onClick={() => setActiveModal('prescriptions')}>Add New Prescription</button>
                </div>
                <div className='button-group'>
                    <button type="submit">{isEditing ? "Update Patient" : "Create Patient"}</button>
                    <button onClick={() => setActiveModal(null)}>Close</button>
                </div>
                </form>
            </Modal>
}