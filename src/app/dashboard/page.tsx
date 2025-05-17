// src/app/dashboard/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  CalendarClock,
  Users,
  UserCircle as UserProfileIcon, // Renamed to avoid conflict
  FileTextIcon,
  Settings,
  PlusCircle,
  ArrowRight,
  LayoutDashboard as DashboardIcon, // For the main title
  DollarSign, // Example for a future billing card
} from 'lucide-react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard | TherapistDB',
  description: 'Your central hub for managing your therapy practice.',
};

interface UpcomingAppointment {
  id: string;
  startTime: Date;
  client: { id: string; firstName: string; lastName: string } | null;
  appointmentType?: string | null;
}

interface DashboardData {
  upcomingAppointments: UpcomingAppointment[];
  activeClientCount: number;
  // recentNotesCount?: number; // Example for future addition
  // unreadMessagesCount?: number; // Example for future addition
}

async function getDashboardDataForTherapist(therapistId: string): Promise<DashboardData> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // Start of today

  const sevenDaysFromNow = new Date(todayStart);
  sevenDaysFromNow.setDate(todayStart.getDate() + 7); // End of 7 days from today

  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      therapistId: therapistId,
      startTime: {
        gte: todayStart, // Appointments from today onwards
        lt: sevenDaysFromNow, // Up to the next 7 days
      },
      // Optionally filter by status, e.g., only 'Scheduled' or 'Confirmed'
      // status: { in: ['Scheduled', 'Confirmed'] }
    },
    orderBy: {
      startTime: 'asc',
    },
    take: 5, // Limit to showing the next 5
    select: {
      id: true,
      startTime: true,
      appointmentType: true,
      client: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const activeClientCount = await prisma.client.count({
    where: {
      therapistId: therapistId,
      // Add criteria for "active" if you have such a field on your Client model
    },
  });

  return {
    upcomingAppointments,
    activeClientCount,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const therapist = await prisma.therapist.findUnique({
    where: { userId: session.user.id },
    select: { id: true, name: true },
  });

  if (!therapist) {
    // If therapist profile doesn't exist, they should be guided to create one.
    // This might be handled by your main layout or middleware.
    // Or redirect them to the profile building flow.
    redirect('/build-profile?reason=no_profile');
  }

  const dashboardData = await getDashboardDataForTherapist(therapist.id);
  const therapistFirstName = therapist.name?.split(' ')[0] || 'Therapist';

  const formatAppointmentTime = (date: Date) =>
    new Date(date).toLocaleTimeString(undefined, {
      weekday: 'short', // e.g., Mon
      month: 'short',   // e.g., Jun
      day: 'numeric',   // e.g., 10
      hour: 'numeric',
      minute: '2-digit',
    });

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Welcome back, {therapistFirstName}!
        </h1>
        <p className="text-lg text-gray-600 mt-1">
          Here’s what’s happening with your practice.
        </p>
      </header>

      {/* Quick Stats & Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center text-teal-600 mb-2">
              <CalendarClock className="h-7 w-7 mr-3" />
              <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
            </div>
            <p className="text-4xl font-bold text-gray-800">
              {dashboardData.upcomingAppointments.length}
            </p>
            <p className="text-sm text-gray-500 mb-3">in the next 7 days (showing up to 5)</p>
          </div>
          <Button variant="ghost" asChild className="text-teal-600 hover:text-teal-700 p-0 justify-start self-start">
            <Link href="/dashboard/calendar">View Full Calendar <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>

        {/* Active Clients Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center text-sky-600 mb-2">
              <Users className="h-7 w-7 mr-3" />
              <h2 className="text-xl font-semibold">Active Clients</h2>
            </div>
            <p className="text-4xl font-bold text-gray-800">
              {dashboardData.activeClientCount}
            </p>
             <p className="text-sm text-gray-500 mb-3">total clients</p>
          </div>
          <Button variant="ghost" asChild className="text-sky-600 hover:text-sky-700 p-0 justify-start self-start">
            <Link href="/dashboard/clients">Manage Clients <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        
        {/* Quick Actions Card */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200 space-y-3">
             <h2 className="text-xl font-semibold text-gray-700 mb-3">Quick Actions</h2>
            <Button asChild className="w-full justify-start">
              <Link href="/dashboard/appointments/new">
                <PlusCircle className="mr-2 h-5 w-5" /> Schedule Appointment
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/clients/new">
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Client
              </Link>
            </Button>
        </div>
      </div>

      {/* Detailed Upcoming Appointments List */}
      {dashboardData.upcomingAppointments.length > 0 && (
        <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Your Next Few Appointments</h2>
          <ul className="space-y-4">
            {dashboardData.upcomingAppointments.map(appt => (
              <li key={appt.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <p className="font-medium text-teal-700 text-lg">
                    {appt.client ? `${appt.client.firstName} ${appt.client.lastName}` : 'Client Details Missing'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatAppointmentTime(appt.startTime)}
                  </p>
                  {appt.appointmentType && (
                    <span className="mt-1 inline-block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {appt.appointmentType}
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm" asChild className="mt-2 sm:mt-0">
                  <Link href={`/dashboard/appointments/${appt.id}`}>View/Edit Details</Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation Links Section (can be simplified if header covers these) */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Navigate Your Practice</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { href: '/dashboard/calendar', label: 'Full Calendar', icon: CalendarClock },
            { href: '/dashboard/clients', label: 'My Clients', icon: Users },
            { href: '/build-profile', label: 'Edit Public Profile', icon: UserProfileIcon },
            { href: '/account/settings', label: 'Account Settings', icon: Settings },
          ].map(link => (
            <Link key={link.href} href={link.href} className="block p-6 bg-white hover:bg-gray-50 rounded-lg shadow-md border border-gray-200 text-center transition-colors group">
              <link.icon className="h-10 w-10 mx-auto text-gray-400 group-hover:text-teal-600 mb-2 transition-colors" />
              <span className="text-sm font-medium text-gray-800 group-hover:text-teal-700">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}