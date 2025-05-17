// src/app/dashboard/clients/page.tsx
import { Suspense } from 'react';
import ClientList from '@/components/dashboard/clients/ClientList'; // We'll create this next
import { Button } from '@/components/ui/button'; // Assuming Shadcn UI
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export const metadata = {
  title: 'Manage Clients | TherapistDB',
};

export default async function ManageClientsPage() {
  // This page could fetch initial data if needed server-side, but for a dynamic list
  // that might change frequently, fetching on the client-side in ClientList is common.
  // You could also implement server-side fetching with pagination here if preferred.

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Clients</h1>
        <Button asChild>
          <Link href="/dashboard/clients/new"> {/* Link to a page for adding a new client */}
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Client
          </Link>
        </Button>
      </div>

      {/* ClientList will be a client component to fetch and display data */}
      <Suspense fallback={<div className="text-center py-10">Loading clients...</div>}>
        <ClientList />
      </Suspense>
    </div>
  );
}