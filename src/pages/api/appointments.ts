import type { NextApiRequest, NextApiResponse } from 'next';
import type { Appointment } from '@/utils/types';

// --- MOCK DATABASE ---
// Changed 'let' to 'const' to fix the ESLint error.
// We can still modify the contents of the array (push, update items).
const mockAppointments: Appointment[] = [
    { id: 1001, doctorId: 1, patientName: 'John Doe', date: '2025-07-29', time: '10:00 AM', reason: 'Annual Checkup', status: 'Upcoming' },
    { id: 1002, doctorId: 2, patientName: 'Jane Smith', date: '2025-07-29', time: '11:30 AM', reason: 'Follow-up Visit', status: 'Upcoming' },
    { id: 1003, doctorId: 1, patientName: 'Peter Jones', date: '2025-07-29', time: '02:00 PM', reason: 'Consultation', status: 'Upcoming' },
    { id: 1004, doctorId: 3, patientName: 'Emily White', date: '2025-07-30', time: '09:30 AM', reason: 'Vaccination', status: 'Upcoming' },
    { id: 1005, doctorId: 2, patientName: 'Michael Brown', date: '2025-07-30', time: '03:00 PM', reason: 'Skin Rash', status: 'Upcoming' },
    { id: 1006, doctorId: 1, patientName: 'Sarah Wilson', date: '2025-08-05', time: '10:30 AM', reason: 'Heart Palpitations', status: 'Upcoming' },
    { id: 2001, doctorId: 1, patientName: 'Alex Ray', date: '2025-07-28', time: '09:00 AM', reason: 'Initial Consultation', status: 'Completed' },
    { id: 2002, doctorId: 2, patientName: 'Brenda Lee', date: '2025-07-28', time: '10:30 AM', reason: 'Prescription Refill', status: 'Completed' },
    { id: 2003, doctorId: 1, patientName: 'Carl Sagan', date: '2025-07-22', time: '03:00 PM', reason: 'Follow-up', status: 'Cancelled' },
    { id: 2004, doctorId: 3, patientName: 'Diana Prince', date: '2025-07-22', time: '11:00 AM', reason: 'Well-child Visit', status: 'Completed' },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Appointment[] | Appointment | { message: string }>
) {
  // GET: Fetch appointments for a specific doctor
  if (req.method === 'GET') {
    const { doctorId } = req.query;
    if (doctorId) {
      const doctorAppointments = mockAppointments.filter(
        (apt) => apt.doctorId === parseInt(doctorId as string)
      );
      return res.status(200).json(doctorAppointments);
    }
    return res.status(400).json({ message: 'Doctor ID is required' });
  }

  // PATCH: Update an existing appointment's status
  if (req.method === 'PATCH') {
    const { id, status } = req.body;
    const appointmentIndex = mockAppointments.findIndex(apt => apt.id === id);

    if (appointmentIndex > -1) {
      mockAppointments[appointmentIndex].status = status;
      return res.status(200).json(mockAppointments[appointmentIndex]);
    }
    return res.status(404).json({ message: 'Appointment not found' });
  }

  // POST: Create a new appointment
  if (req.method === 'POST') {
    const { doctorId, patientName, date, time, reason } = req.body;
    if (!doctorId || !patientName || !date || !time || !reason) {
        return res.status(400).json({ message: 'Missing required fields for appointment booking.' });
    }
    const newAppointment: Appointment = {
        id: Date.now(), // Use timestamp for a unique ID
        doctorId,
        patientName,
        date,
        time,
        reason,
        status: 'Upcoming'
    };
    mockAppointments.push(newAppointment);
    return res.status(201).json(newAppointment);
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
