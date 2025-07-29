import type { NextApiRequest, NextApiResponse } from 'next';
import type { User, Doctor } from '@/utils/types';

// Mock data for doctors - in a real app, this would be a database call
const mockDoctors: Doctor[] = [
  { id: 1, name: 'Dr. Aisha Patel', specialty: 'Cardiologist', email: 'aisha@clinic.com', bio: 'Expert in heart conditions.' },
  { id: 2, name: 'Dr. Ben Carter', specialty: 'Dermatologist', email: 'ben@clinic.com', bio: 'Specializes in skin health.' },
  { id: 3, name: 'Dr. Chloe Davis', specialty: 'Pediatrician', email: 'chloe@clinic.com', bio: 'Cares for children\'s health.' },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | { message: string }>
) {
  if (req.method === 'POST') {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: 'Email and role are required' });
    }

    if (role === 'doctor') {
      const doctor = mockDoctors.find(d => d.email === email);
      if (doctor) {
        return res.status(200).json({ ...doctor, role: 'doctor' });
      } else {
        return res.status(401).json({ message: 'Doctor not found.' });
      }
    }

    if (role === 'patient') {
      const name = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
      const patientUser: User = { 
          id: Date.now(), 
          name: name.charAt(0).toUpperCase() + name.slice(1), 
          email: email, 
          role: 'patient',
          specialty: '', 
          bio: ''
      };
      return res.status(200).json(patientUser);
    }

    return res.status(400).json({ message: 'Invalid role specified' });
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
