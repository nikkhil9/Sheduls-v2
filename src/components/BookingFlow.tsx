import React, { useState, useEffect } from 'react';
import { 
    ChevronLeft, Calendar, Clock, Stethoscope, CheckCircle, List, LogOut,
    HeartPulse, Sun, Baby, Bone, Brain, ShieldCheck 
} from 'lucide-react';
import type { Doctor, Booking, User } from '../utils/types';

// --- HELPER FUNCTIONS ---
const getNext7Days = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }
  return days;
};

const availableTimeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM'
];

const getSpecialtyIcon = (specialty: string) => {
  switch (specialty) {
    case 'Cardiologist': return <HeartPulse className="w-10 h-10 text-red-500" />;
    case 'Dermatologist': return <Sun className="w-10 h-10 text-yellow-500" />;
    case 'Pediatrician': return <Baby className="w-10 h-10 text-pink-500" />;
    case 'Orthopedic Surgeon': return <Bone className="w-10 h-10 text-amber-600" />;
    case 'Neurologist': return <Brain className="w-10 h-10 text-purple-600" />;
    case 'Psychiatrist': return <ShieldCheck className="w-10 h-10 text-green-600" />;
    default: return <Stethoscope className="w-10 h-10 text-slate-500" />;
  }
};

const formatDateForAPI = (date: Date) => date.toISOString().split('T')[0];

// --- SUB-COMPONENTS ---

interface AppHeaderProps {
    title: string;
    user: User;
    bookingCount?: number;
    page: 'select-doctor' | 'my-appointments';
    onViewAppointments?: () => void;
    onNewBooking?: () => void;
    onLogout: () => void;
}

const AppHeader = ({ title, user, bookingCount, onViewAppointments, onLogout, onNewBooking, page }: AppHeaderProps) => (
    <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            <div className="flex items-center space-x-4">
                {page === 'my-appointments' ? (
                    <button onClick={onNewBooking} className="flex items-center space-x-2 text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 px-3 py-2 rounded-full transition-colors">
                        <Stethoscope className="h-5 w-5"/><span>Book Appointment</span>
                    </button>
                ) : (
                    bookingCount && bookingCount > 0 && (
                        <button onClick={onViewAppointments} className="flex items-center space-x-2 text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 px-3 py-2 rounded-full transition-colors">
                            <List className="h-5 w-5"/><span>My Appointments</span>
                        </button>
                    )
                )}
                <div className="text-right">
                    <p className="text-sm text-slate-600">Welcome,</p><p className="font-medium text-indigo-600">{user.name}</p>
                </div>
                <button onClick={onLogout} title="Logout" className="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors"><LogOut className="h-5 w-5"/></button>
            </div>
        </div>
    </header>
);

const DoctorCard = ({ doctor, onSelect }: { doctor: Doctor, onSelect: (doctor: Doctor) => void }) => (
    <div onClick={() => onSelect(doctor)} className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:scale-[1.01] border border-slate-100 p-5">
        <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center shadow-md">
                {getSpecialtyIcon(doctor.specialty)}
            </div>
            <h3 className="text-lg font-bold text-slate-800">{doctor.name}</h3>
            <span className="text-xs font-medium bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full">
                {doctor.specialty}
            </span>
            <p className="text-sm text-slate-600 line-clamp-3 h-12">{doctor.bio}</p>
            <button onClick={(e) => { e.stopPropagation(); onSelect(doctor); }} className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-full hover:bg-indigo-700 transition">
                Book Now
            </button>
        </div>
    </div>
);

const TimeSelection = ({ doctor, onBook, onBack }: { doctor: Doctor, onBook: (booking: Omit<Booking, 'id'>) => void, onBack: () => void }) => {
    const [selectedDate, setSelectedDate] = useState(getNext7Days()[0]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-slate-50">
           <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 mr-4"><ChevronLeft className="h-6 w-6 text-slate-600" /></button>
                    <h1 className="text-2xl font-bold text-slate-800">Book Appointment</h1>
                </div>
            </header>
          <main className="max-w-4xl mx-auto p-4 sm:p-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:space-x-6">
                  <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-indigo-200 shadow-md">
                    {getSpecialtyIcon(doctor.specialty)}
                  </div>
                  <div className="mt-4 md:mt-0 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-slate-900">{doctor.name}</h2>
                    <p className="text-xl text-indigo-600 font-semibold">{doctor.specialty}</p>
                  </div>
              </div>
              <div className="p-6 md:p-8 bg-slate-50/70 border-t border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center"><Calendar className="h-6 w-6 mr-3 text-indigo-500"/>Select a Date</h3>
                <div className="flex space-x-2 overflow-x-auto pb-4 -mx-1 px-1">
                  {getNext7Days().map(day => {
                    const isSelected = selectedDate.toDateString() === day.toDateString();
                    return (
                      <button key={day.toISOString()} onClick={() => setSelectedDate(day)} className={`flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all duration-200 ${isSelected ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-white text-slate-700 hover:bg-indigo-50'}`}>
                        <p className="font-semibold text-sm">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                        <p className="font-bold text-2xl">{day.getDate()}</p>
                        <p className="text-xs opacity-80">{day.toLocaleDateString('en-US', { month: 'short' })}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="p-6 md:p-8 bg-slate-50/70 border-t border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center"><Clock className="h-6 w-6 mr-3 text-indigo-500"/>Select a Time</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {availableTimeSlots.map(time => {
                    const isSelected = selectedTime === time;
                    return (
                      <button key={time} onClick={() => setSelectedTime(time)} className={`p-3 rounded-lg font-semibold transition-colors duration-200 ${isSelected ? 'bg-indigo-600 text-white ring-2 ring-offset-2 ring-indigo-500' : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-slate-200'}`}>
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="p-6 md:p-8">
                <button onClick={() => onBook({ doctor, date: selectedDate, time: selectedTime! })} disabled={!selectedTime} className="w-full py-4 px-6 bg-indigo-600 text-white font-bold text-lg rounded-xl hover:bg-indigo-700 transition-transform duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:scale-105 disabled:hover:scale-100">
                  <CheckCircle className="mr-3 h-6 w-6" /> Confirm Appointment
                </button>
              </div>
            </div>
          </main>
        </div>
    );
};

const AppointmentDetailCard = ({ booking, isLatest }: { booking: Booking, isLatest: boolean }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-lg border-2 ${isLatest ? 'border-green-500' : 'border-transparent'}`}>
        {isLatest && (
            <div className="flex items-center text-green-600 mb-4 animate-pulse">
                <CheckCircle className="h-5 w-5 mr-2" /><span className="font-semibold text-sm">Appointment Confirmed!</span>
            </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center self-center sm:self-start shadow">
                {getSpecialtyIcon(booking.doctor.specialty)}
            </div>
            <div className="mt-4 sm:mt-0 flex-1 text-center sm:text-left">
                <h4 className="text-xl font-bold text-slate-800">{booking.doctor.name}</h4>
                <p className="text-md text-indigo-600 font-medium">{booking.doctor.specialty}</p>
                <div className="mt-4 flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0 text-sm">
                    <div className="flex items-center justify-center sm:justify-start"><Calendar className="h-4 w-4 mr-2 text-slate-500"/><span className="text-slate-700 font-medium">{booking.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
                    <div className="flex items-center justify-center sm:justify-start"><Clock className="h-4 w-4 mr-2 text-slate-500"/><span className="text-slate-700 font-medium">{booking.time}</span></div>
                </div>
            </div>
        </div>
    </div>
);


// --- MAIN BOOKING FLOW COMPONENT ---
export const BookingFlow = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
    const [page, setPage] = useState<'select-doctor' | 'select-time' | 'my-appointments'>('select-doctor'); 
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/doctors');
                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                console.error("Failed to fetch doctors:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const handleSelectDoctor = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setPage('select-time');
    };

    const handleBooking = async (booking: Omit<Booking, 'id'>) => {
        // Prepare the data for the API
        const appointmentData = {
            doctorId: booking.doctor.id,
            patientName: user.name,
            date: formatDateForAPI(booking.date),
            time: booking.time,
            reason: "Consultation" // Using a default reason for now
        };

        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentData),
            });

            if (!response.ok) {
                throw new Error('Failed to book appointment');
            }

            // If API call is successful, update the local state for the confirmation page
            const newBooking = { ...booking, id: Date.now() };
            setConfirmedBookings(prev => [...prev, newBooking]);
            setSelectedDoctor(null);
            setShowConfirmation(true);
            setPage('my-appointments');

        } catch (error) {
            console.error(error);
            alert('There was an error booking your appointment. Please try again.');
        }
    };

    const handleViewAppointments = () => {
        setShowConfirmation(false);
        setPage('my-appointments');
    }

    const handleNewBooking = () => {
        setShowConfirmation(false);
        setPage('select-doctor');
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><p>Loading doctors...</p></div>;
    }

    if (page === 'select-time' && selectedDoctor) {
        return <TimeSelection doctor={selectedDoctor} onBook={handleBooking} onBack={() => setPage('select-doctor')} />
    }

    if (page === 'my-appointments') {
        return (
            <div className="min-h-screen bg-slate-50">
                <AppHeader title="My Appointments" user={user} onNewBooking={handleNewBooking} onLogout={onLogout} page="my-appointments" />
                <main className="max-w-4xl mx-auto p-4 sm:p-8">
                    {confirmedBookings.length > 0 ? (
                        <div className="space-y-6">
                            {[...confirmedBookings].reverse().map((booking, index) => (
                                <AppointmentDetailCard key={booking.id} booking={booking} isLatest={showConfirmation && index === 0} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-md">
                            <List className="mx-auto h-16 w-16 text-slate-300"/>
                            <h2 className="mt-4 text-xl font-semibold text-slate-800">No Appointments Yet</h2>
                            <p className="mt-2 text-slate-500">Your scheduled appointments will appear here.</p>
                        </div>
                    )}
                </main>
            </div>
        );
    }
    
    // Default to 'select-doctor' page
    return (
        <div className="min-h-screen bg-slate-50">
            <AppHeader title="Select a Doctor" user={user} bookingCount={confirmedBookings.length} onViewAppointments={handleViewAppointments} onLogout={onLogout} page="select-doctor" />
            <main className="max-w-5xl mx-auto p-4 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} onSelect={handleSelectDoctor} />
                    ))}
                </div>
            </main>
        </div>
    );
};
