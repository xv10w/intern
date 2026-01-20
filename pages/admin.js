import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/authContext';
import Inventory from '../components/Inventory';

export default function Admin() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="max-w-fw flex flex-col">
        <div className="pt-10">
          <h1 className="text-5xl font-light">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Welcome, {user?.name}</p>
        </div>
        <Inventory />
      </div>
    </div>
  );
}