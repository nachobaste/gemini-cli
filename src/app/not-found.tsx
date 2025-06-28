import Link from 'next/link';
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
      <h2 className="text-4xl font-bold mb-4">404 - Página No Encontrada</h2>
      <p className="text-lg text-center mb-6">Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
      <Link href="/" className="px-6 py-3 bg-lime-500 text-white rounded-md hover:bg-lime-600 transition-colors text-lg font-medium">
        Volver al Inicio
      </Link>
    </div>
  );
}
