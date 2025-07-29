
    // Defines the structure for a Doctor
export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  email: string;
  bio?: string;
}

// Defines the structure for a Patient
export interface Patient {
    id: number;
    name: string;
    email: string;
}

// A generic User type that can be either a Patient or a Doctor
export interface User extends Patient, Doctor {
    role: 'patient' | 'doctor';
}

// Defines the structure for a patient's booking (used in patient view)
export interface Booking {
  id: number;
  doctor: Doctor;
  date: Date;
  time: string;
}

// Defines the structure for an appointment (used in doctor view)
export interface Appointment {
    id: number;
    doctorId: number;
    patientName: string;
    date: string; // Format: YYYY-MM-DD
    time: string;
    reason: string;
    status: 'Upcoming' | 'Completed' | 'Cancelled';
}
