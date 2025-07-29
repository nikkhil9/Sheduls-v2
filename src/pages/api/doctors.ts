import type { NextApiRequest, NextApiResponse } from 'next';
import type { Doctor } from '@/utils/types';

const mockDoctors: Doctor[] = [
  { id: 1, name: 'Dr. Aisha Patel', specialty: 'Cardiologist', email: 'aisha@clinic.com', bio: 'Expert in heart conditions.' },
  { id: 2, name: 'Dr. Ben Carter', specialty: 'Dermatologist', email: 'ben@clinic.com', bio: 'Specializes in skin health.' },
  { id: 3, name: 'Dr. Chloe Davis', specialty: 'Pediatrician', email: 'chloe@clinic.com', bio: 'Cares for children\'s health.' },
  { id: 4, name: 'Dr. David Rodriguez', specialty: 'Orthopedic Surgeon', email: 'david@clinic.com', bio: 'Expert in sports medicine.' },
  { id: 5, name: 'Dr. Evelyn Reed', specialty: 'Neurologist', email: 'evelyn@clinic.com', bio: 'Disorders of the nervous system.' },
  { id: 6, name: 'Dr. Frank Miller', specialty: 'Psychiatrist', email: 'frank@clinic.com', bio: 'Provides mental health care.' }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Doctor[]>
) {
  if (req.method === 'GET') {
    res.status(200).json(mockDoctors);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
