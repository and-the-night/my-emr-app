import { useState } from 'react';
import Modal from 'react-modal';
import { medications, dosages } from '../data/seedData.json';

const MedicationForm = ({ isOpen, onRequestClose, onSubmit }) => {
    const getOneMonthDate = () => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d.toISOString().slice(0, 10); 
    };

    const getOneWeekDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return d.toISOString().slice(0, 10); 
    };

    const [newMedication, setNewMedication] = useState({
        medication: '',
        dosage: '',
        quantity: '',
        refill_on: getOneMonthDate(),
        refill_schedule: 'monthly',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMedication((prev) => ({ ...prev, [name]: value }));

        if (name === 'refill_schedule') {
            setNewMedication((prev) => ({ 
                ...prev, 
                refill_on: value === 'weekly' ? getOneWeekDate() : getOneMonthDate()
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setNewMedication({
            medication: '',
            dosage: '',
            quantity: '',
            refill_on: getOneMonthDate(),
            refill_schedule: 'monthly',
        })
        onSubmit(newMedication);
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={{ content: { maxWidth: '800px', margin: 'auto' } }}>
            <h2>Add New Medication</h2>
            <form onSubmit={handleSubmit} className='medication-form'>
                <div className="input-wrapper">
                    <label>Medication Name:</label>
                    <select name="medication" value={newMedication.medication} onChange={handleInputChange} required>
                        <option value="">Select Medication</option>
                        {medications.map((med, i) => (
                            <option key={i} value={med}>
                                {med}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="input-wrapper">
                    <label>Dosage:</label>
                    <select name="dosage" value={newMedication.dosage} onChange={handleInputChange} required>
                        <option value="">Select Dosage</option>
                        {dosages.map((dose, i) => (
                            <option key={i} value={dose}>
                                {dose}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="input-wrapper">
                    <label>Quantity:</label>
                    <input type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={newMedication.quantity}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-wrapper">
                    <label>Refill Date:</label>
                    <input
                        name="refill_on"
                        placeholder="Refill Date"
                        type="date"
                        value={newMedication.refill_on}
                    onChange={handleInputChange}
                    required
                />
                </div>
                <div className="input-wrapper">
                    <label>Refill Schedule:</label>
                    <select name="refill_schedule" value={newMedication.refill_schedule} onChange={handleInputChange} required>
                        <option value="">Select Refill Schedule</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>
                <div className='button-group'>
                    <button type="submit">Add Medication</button>
                    <button onClick={onRequestClose}>Close</button>
                </div>
            </form>

        </Modal>
    );
};

export default MedicationForm;
