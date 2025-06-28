'use client'; // Error components must be Client Components
 
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
      <h2 className="text-2xl font-bold mb-4">Algo salió mal!</h2>
      <p className="text-lg text-center mb-6">Lo sentimos, ha ocurrido un error inesperado.</p>
      <button
        className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 transition-colors"
        onClick={() => reset()} // Attempt to recover by trying to re-render the segment
      >
        Intentar de nuevo
      </button>
      <p className="mt-4 text-sm text-gray-600">Si el problema persiste, por favor contacte a soporte.</p>
      {error.message && <p className="mt-2 text-xs text-red-500">Detalles del error: {error.message}</p>}
    </div>
  );
}
