import React, { useState, useMemo, useEffect } from 'react';
import { LogOut, Users, Calendar, Check, X, Clock, History } from 'lucide-react';
import type { User, Appointment } from '@/utils/types';

interface DoctorDashboardProps {
  user: User;
  onLogout: () => void;
}

// Helper to format dates for display
const formatDateHeading = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

export const DoctorDashboard = ({ user, onLogout }: DoctorDashboardProps) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        const fetchAppointments = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/appointments?doctorId=${user.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch appointments');
                }
                const data = await response.json();
                setAppointments(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, [user.id]);

    const handleStatusChange = async (appointmentId: number, status: 'Completed' | 'Cancelled') => {
        const originalAppointments = [...appointments];
        
        // Optimistic UI update
        setAppointments(prev => 
            prev.map(apt => 
                apt.id === appointmentId ? { ...apt, status } : apt
            )
        );

        // API call to persist the change
        try {
            const response = await fetch('/api/appointments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: appointmentId, status }),
            });

            if (!response.ok) {
                // If the API call fails, revert the UI to the original state
                setAppointments(originalAppointments);
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            setAppointments(originalAppointments);
        }
    };

    const groupedUpcomingAppointments = useMemo(() => {
        const upcoming = appointments.filter(apt => apt.status === 'Upcoming');
        return upcoming.reduce((acc, apt) => {
            const dateKey = apt.date;
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(apt);
            return acc;
        }, {} as Record<string, Appointment[]>);
    }, [appointments]);
    
    const sortedGroupKeys = Object.keys(groupedUpcomingAppointments).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    const historyAppointments = useMemo(() => {
        return appointments
            .filter(apt => apt.status === 'Completed' || apt.status === 'Cancelled')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [appointments]);

    const today = new Date().toISOString().split('T')[0];
    const appointmentsToday = appointments.filter(apt => apt.date === today && apt.status === 'Upcoming').length;
    const appointmentsThisWeek = appointments.filter(apt => apt.status === 'Upcoming').length;

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-800">My Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm text-slate-600">Welcome,</p>
                            <p className="font-medium text-indigo-600">{user.name}</p>
                        </div>
                        <button onClick={onLogout} title="Logout" className="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors">
                            <LogOut className="h-5 w-5"/>
                        </button>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto p-4 sm:p-8">
                {isLoading ? (
                    <div className="text-center py-20">
                        <p className="text-slate-500">Loading appointments...</p>
                    </div>
                ) : (
                    <>
                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4">
                                <div className="bg-indigo-100 p-3 rounded-full"><Calendar className="h-6 w-6 text-indigo-600" /></div>
                                <div>
                                    <p className="text-slate-500 text-sm font-medium">Appointments Today</p>
                                    <p className="text-3xl font-bold text-slate-800">{appointmentsToday}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4">
                                <div className="bg-green-100 p-3 rounded-full"><Users className="h-6 w-6 text-green-600" /></div>
                                <div>
                                    <p className="text-slate-500 text-sm font-medium">Upcoming This Week</p>
                                    <p className="text-3xl font-bold text-slate-800">{appointmentsThisWeek}</p>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Appointments List */}
                        <div className="space-y-8">
                            {sortedGroupKeys.length > 0 ? sortedGroupKeys.map(dateKey => (
                                <div key={dateKey}>
                                    <h2 className="text-lg font-bold text-slate-600 mb-4 pb-2 border-b-2 border-slate-200">{formatDateHeading(dateKey)}</h2>
                                    <div className="space-y-4">
                                        {groupedUpcomingAppointments[dateKey].map(apt => (
                                            <div key={apt.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                                                <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center"><Users className="w-6 h-6 text-indigo-600"/></div>
                                                        <div>
                                                            <p className="text-md font-semibold text-slate-800">{apt.patientName}</p>
                                                            <p className="text-sm text-slate-500">{apt.reason}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between w-full sm:w-auto">
                                                        <div className="flex items-center space-x-2 text-slate-600 mr-6">
                                                            <Clock className="h-4 w-4" />
                                                            <span className="font-semibold">{apt.time}</span>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <button onClick={() => handleStatusChange(apt.id, 'Cancelled')} title="Cancel Appointment" className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors">
                                                                <X className="h-5 w-5"/>
                                                            </button>
                                                            <button onClick={() => handleStatusChange(apt.id, 'Completed')} title="Mark as Complete" className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-600 transition-colors">
                                                                <Check className="h-5 w-5"/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-md">
                                    <Calendar className="mx-auto h-16 w-16 text-slate-300"/>
                                    <h2 className="mt-4 text-xl font-semibold text-slate-800">No Upcoming Appointments</h2>
                                    <p className="mt-2 text-slate-500">Your schedule is clear.</p>
                                </div>
                            )}
                        </div>

                        {/* Appointment History */}
                        <div className="mt-12">
                            <h2 className="text-xl font-bold text-slate-700 mb-6">Appointment History</h2>
                            {historyAppointments.length > 0 ? (
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                    <ul className="divide-y divide-slate-200">
                                        {historyAppointments.map(apt => (
                                            <li key={apt.id} className={`p-4 sm:p-6 flex items-center justify-between transition-colors ${apt.status === 'Cancelled' ? 'bg-red-50/50' : 'bg-slate-50/50'}`}>
                                                <div className="flex items-center space-x-4">
                                                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${apt.status === 'Cancelled' ? 'bg-red-100' : 'bg-slate-200'}`}>
                                                        {apt.status === 'Completed' ? <Check className="w-6 h-6 text-slate-500"/> : <X className="w-6 h-6 text-red-500"/>}
                                                    </div>
                                                    <div>
                                                        <p className="text-md font-semibold text-slate-800">{apt.patientName}</p>
                                                        <p className="text-sm text-slate-500">{apt.reason}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-md font-medium text-slate-700">{new Date(apt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                                    <p className={`text-sm font-semibold ${apt.status === 'Cancelled' ? 'text-red-600' : 'text-slate-500'}`}>{apt.status}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-md">
                                    <History className="mx-auto h-16 w-16 text-slate-300"/>
                                    <h2 className="mt-4 text-xl font-semibold text-slate-800">No Appointment History</h2>
                                    <p className="mt-2 text-slate-500">Completed and cancelled appointments will appear here.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};
