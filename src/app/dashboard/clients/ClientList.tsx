// src/components/dashboard/clients/ClientList.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Loader2, AlertTriangle } from 'lucide-react';
// Assuming your Client type from Prisma/Zod. You might want a specific ClientListItem type.
// For now, let's assume you have a type like this (can be imported from ehrSchemas.ts or similar)
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  // Add any other fields you want to display in the list
}

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/clients'); // GET request by default
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch clients: ${response.statusText}`);
      }
      const data: Client[] = await response.json();
      setClients(data);
    } catch (err: any) {
      console.error("Error fetching clients:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      return;
    }
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete client: ${response.statusText}`);
      }
      // Re-fetch clients to update the list
      fetchClients();
      alert('Client deleted successfully.'); // Or use a toast notification
    } catch (err: any) {
      console.error("Error deleting client:", err);
      setError(err.message || "Failed to delete client.");
      alert(`Error: ${err.message || "Failed to delete client."}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <p className="ml-3 text-gray-600">Loading clients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 mr-3" />
          <div>
            <p className="font-bold">Error</p>
            <p>{error} <Button variant="link" size="sm" onClick={fetchClients} className="p-0 h-auto text-red-700 hover:text-red-900">Try again</Button></p>
          </div>
        </div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-10 bg-white shadow rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No clients yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding your first client.</p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/dashboard/clients/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Client
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <ul role="list" className="divide-y divide-gray-200">
        {clients.map((client) => (
          <li key={client.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <Link href={`/dashboard/clients/${client.id}`} className="text-lg font-medium text-teal-600 hover:text-teal-700 hover:underline truncate">
                  {client.firstName} {client.lastName}
                </Link>
                <p className="text-sm text-gray-500 truncate">{client.email || 'No email provided'}</p>
                <p className="text-sm text-gray-500 truncate">{client.phone || 'No phone provided'}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex space-x-2">
                <Button variant="outline" size="sm" asChild title="View/Edit Client">
                  <Link href={`/dashboard/clients/${client.id}`}> {/* Link to view/edit client page */}
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <Button
                  variant="destructiveOutline" // Assuming you have or can create this variant
                  size="sm"
                  onClick={() => handleDeleteClient(client.id)}
                  title="Delete Client"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {/* Optional: Add pagination controls here if your API supports it */}
    </div>
  );
}