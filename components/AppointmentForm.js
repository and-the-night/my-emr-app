import { useState } from 'react';
import Modal from 'react-modal';

const AppointmentForm = ({ isOpen, onRequestClose, onSubmit }) => {
    const [newAppointment, setNewAppointment] = useState({
        provider: '',
        datetime: '',
        repeat: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAppointment((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newAppointment); 
        setNewAppointment({ provider: '', datetime: '', repeat: '' }); 
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={{ content: { maxWidth: '800px', margin: 'auto' } }}>
            <h2>Add New Appointment</h2>
            <form onSubmit={handleSubmit} className='appointment-form'>
                <div className="input-wrapper">
                    <label>Provider Name:</label>
                    <input
                        name="provider"
                        placeholder="Provider Name"
                        value={newAppointment.provider}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-wrapper">
                    <label>Date & Time:</label>
                    <input
                        name="datetime"
                        type="datetime-local"
                        value={newAppointment.datetime}
                        onChange={handleInputChange}
                        required
                    />
                    </div>
                <div className="input-wrapper">
                    <label>Repeat:</label>
                    <select
                        name="repeat"
                        value={newAppointment.repeat}
                        onChange={handleInputChange}
                        required
                    >
                    <option value="" disabled>Repeat</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
                </div>
                <div className='button-group'>
                    <button type="submit">Add Appointment</button>
                    <button onClick={onRequestClose}>Close</button>
                </div>
            </form>
        </Modal>
    );
};

export default AppointmentForm;

