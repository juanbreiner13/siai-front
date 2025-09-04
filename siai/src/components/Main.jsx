export default function Main() {
  return (
    <main className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
        <h2 className="text-lg font-semibold mb-3 flex items-center">📄 Informes</h2>
        <div className="space-y-2">
          <button className="bg-red-500 w-full text-white py-2 sm:py-3 px-3 rounded-md flex items-center justify-center hover:bg-yellow-600 transition">📋 Generales</button>
          <button className="bg-red-500 w-full text-white py-2 sm:py-3 px-3 rounded-md flex items-center justify-center hover:bg-yellow-600 transition">📅 Por fecha</button>
          <button className="bg-red-500 w-full text-white py-2 sm:py-3 px-3 rounded-md flex items-center justify-center hover:bg-yellow-600 transition">⬇️ Exportar</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
        <h2 className="text-lg font-semibold mb-3 flex items-center">⏰ Logs</h2>
        <div className="space-y-2">
          <button className="bg-yellow-400 w-full text-white py-2 sm:py-3 px-3 rounded-md flex items-center justify-center hover:bg-yellow-600 transition">📌 Actividad</button>
          <button className="bg-yellow-400 w-full text-white py-2 sm:py-3 px-3 rounded-md flex items-center justify-center hover:bg-yellow-600 transition">⚠️ Errores</button>
          <button className="bg-yellow-400 w-full text-white py-2 sm:py-3 px-3 rounded-md flex items-center justify-center hover:bg-yellow-600 transition">🔎 Auditoría</button>
        </div>
      </div>
    </main>
  );
}
