import { useState } from "react";

export default function UserInterface({ patient }) {
    const [showFutureAppointments, setShowFutureAppointments] = useState(false);
    const [showFutureMeds, setShowFutureMeds] = useState(false);

    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const upcomingAppointments = patient.appointments.filter(appt => {
            const apptDate = new Date(appt.datetime);
            return apptDate >= now && apptDate <= oneWeekFromNow;
        });
    const futureAppointments = patient.appointments.filter(appt => {
            const apptDate = new Date(appt.datetime);
            return apptDate > oneWeekFromNow;
        });

    const upcomingMeds = patient.prescriptions.filter(prescription => {
            const refillDate = new Date(prescription.refill_on);
            return refillDate >= now && refillDate <= oneWeekFromNow;
        });
    const futureMeds = patient.prescriptions.filter(prescription => {
            const refillDate = new Date(prescription.refill_on);
            return refillDate > oneWeekFromNow;
        });


    return (
        <div>
            <h2>{patient.name} - Patient Details</h2>
            <h3>This Week's Appointments</h3>
            {upcomingAppointments.length === 0 ? (<p>No appointments in the next week.</p>) : (
                <ul>
                    {upcomingAppointments.map((appt) => (
                        <li key={appt.id}>
                            {appt.provider} - {new Date(appt.datetime).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </li>
                    ))}
                </ul>
        )}
            <button onClick={() => setShowFutureAppointments(!showFutureAppointments)}>{showFutureAppointments ? 'Hide' : 'See'} Future Appointments</button>
            {showFutureAppointments && (
                futureAppointments.length === 0 ? (<p>No future appointments scheduled.</p>) : (
                        <div>
                            <h4>Future Appointments</h4>
                            <ul>
                                {futureAppointments.map((appt) => (
                                    <li key={appt.id}>
                                        {appt.provider} - {new Date(appt.datetime).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </li>
                                ))}
                            </ul>
                        </div>
                    ))}

            <br/>

            <h3>This Week's Prescriptions Refill</h3>
            
                {upcomingMeds.length === 0 ? (<p>No medications to refill this week.</p>) : (
                    <ul>
                        {upcomingMeds.map((prescription) => (
                            <li key={prescription.id}>
                                {prescription.medication} - {prescription.dosage}
                            </li>
                        ))}
                    </ul>
                )}
            
            <button onClick={() => setShowFutureMeds(!showFutureMeds)}>{showFutureMeds ? 'Hide' : 'See'} Future Medications</button>

            {showFutureMeds && (
                futureMeds.length === 0 ? (<p>No future medications to refill.</p>) : (
                    <>
                        <h4>Future Prescriptions Refill</h4>
                        <div>
                            <ul>
                                {futureMeds.map((prescription) => (
                                    <li key={prescription.id}>
                                        {prescription.medication} - {prescription.dosage}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )
            )}
        </div>
)}