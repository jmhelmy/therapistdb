// src/app/dashboard/clients/new/page.tsx
import ClientForm from '@/components/dashboard/clients/ClientForm'; // We will create this component next
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming Shadcn UI

export const metadata = {
  title: 'Add New Client | TherapistDB',
};

export default function AddNewClientPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Client List
          </Link>
        </Button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 border-b pb-4">
          Add New Client
        </h1>
        {/* The ClientForm component will handle the form logic.
          For creating a new client, we don't pass any initialData.
          We'll also pass a mode or an onSubmit specific to creation.
        */}
        <ClientForm />
      </div>
    </div>
  );
}