import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-black text-white p-4">
      <div className="flex items-center w-full">
        {/* Logo */}
        <span className="font-bold text-xl mr-6">REQUENDO</span>

        {/* Botón hamburguesa (solo móvil) */}
        <button
          id="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col space-y-1 ml-auto"
        >
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </button>

        {/* Menú */}
        <nav
          id="menu"
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute top-full left-0 w-full bg-black md:static md:flex md:flex-row md:items-center md:space-x-6 md:w-auto text-sm`}
        >
          {/* Inicio */}
          <Link to="/home" className="block px-4 py-2 md:px-0 hover:text-blue-400">
            Inicio
          </Link>

          {/* Submenú Usuarios */}
          <div className="relative group">
            <button className="w-full text-left md:w-auto flex items-center px-4 py-2 md:px-0 hover:text-blue-400">
              Usuarios ▼
            </button>
            <div className="hidden absolute left-0 top-full z-50 w-44 bg-white text-black rounded-md shadow-lg group-hover:block md:hover:block">
              <Link to="/nuevoUsuario" className="block px-4 py-2 hover:bg-gray-100">➕ Nuevo usuario</Link>
              <Link to="/lista" className="block px-4 py-2 hover:bg-gray-100">📋 Lista</Link>
              <Link to="/roles" className="block px-4 py-2 hover:bg-gray-100">🧩 Roles</Link>
            </div>
          </div>

          {/* Logs */}
          <Link to="/logs" className="block px-4 py-2 md:px-0 hover:text-blue-400">
            Logs
          </Link>

          {/* Dashboard */}
          <Link to="/dashboard" className="block px-4 py-2 md:px-0 hover:text-blue-400">
            Dashboard
          </Link>

          {/* Submenú Database */}
          <div className="relative group">
            <button className="w-full text-left md:w-auto flex items-center px-4 py-2 md:px-0 hover:text-blue-400">
              Database ▼
            </button>
            <div className="hidden absolute left-0 top-full z-50 w-56 bg-white text-black rounded-md shadow-lg group-hover:block md:hover:block">
              <Link to="/manageItems" className="block px-4 py-2 hover:bg-gray-100">♦ Manage Items</Link>
              <Link to="/managetour" className="block px-4 py-2 hover:bg-gray-100">🛩 Manage Tour</Link>
              <Link to="/manageproviders" className="block px-4 py-2 hover:bg-gray-100">🛒 Manage Providers</Link>
              <Link to="/manageclient" className="block px-4 py-2 hover:bg-gray-100">🤵 Manage Client</Link>
              <Link to="/managedestinations" className="block px-4 py-2 hover:bg-gray-100">🪂 Manage Destinations</Link>
            </div>
          </div>

          {/* Submenú Portfolio */}
          <div className="relative group">
            <button className="w-full text-left md:w-auto flex items-center px-4 py-2 md:px-0 hover:text-blue-400">
              Portfolio ▼
            </button>
            <div className="hidden absolute left-0 top-full z-50 w-44 bg-white text-black rounded-md shadow-lg group-hover:block md:hover:block">
              <Link to="/toi2026" className="block px-4 py-2 hover:bg-gray-100">♦ TOI 2026</Link>
              <Link to="/ton2026" className="block px-4 py-2 hover:bg-gray-100">🛩 TON 2026</Link>
            </div>
          </div>

          {/* Submenú Quotes */}
          <div className="relative group">
            <button className="w-full text-left md:w-auto flex items-center px-4 py-2 md:px-0 hover:text-blue-400">
              Quotes ▼
            </button>
            <div className="hidden absolute left-0 top-full z-50 w-56 bg-white text-black rounded-md shadow-lg group-hover:block md:hover:block">
              <Link to="/newBooking" className="block px-4 py-2 hover:bg-gray-100">➕ New Booking</Link>
              <Link to="/handleBooking" className="block px-4 py-2 hover:bg-gray-100">📋 Handle Booking</Link>
              <Link to="/rolesQuotes" className="block px-4 py-2 hover:bg-gray-100">🧩 Roles</Link>
            </div>
          </div>

          {/* Submenú Trips */}
          <div className="relative group">
            <button className="w-full text-left md:w-auto flex items-center px-4 py-2 md:px-0 hover:text-blue-400">
              Trips ▼
            </button>
            <div className="hidden absolute left-0 top-full z-50 w-56 bg-white text-black rounded-md shadow-lg group-hover:block md:hover:block">
              <Link to="/operateBooking" className="block px-4 py-2 hover:bg-gray-100">♦ Operate Booking</Link>
              <Link to="/feedback" className="block px-4 py-2 hover:bg-gray-100">🛩 Feedback</Link>
            </div>
          </div>

          {/* Submenú Financial */}
          <div className="relative group">
            <button className="w-full text-left md:w-auto flex items-center px-4 py-2 md:px-0 hover:text-blue-400">
              Financial ▼
            </button>
            <div className="hidden absolute left-0 top-full z-50 w-44 bg-white text-black rounded-md shadow-lg group-hover:block md:hover:block">
              <Link to="/financial" className="block px-4 py-2 hover:bg-gray-100">🛩 Consult</Link>
            </div>
          </div>
        </nav>

        {/* Derecha escritorio */}
        <div className="hidden md:flex items-center space-x-4 ml-auto">
          <span className="font-semibold">Impulse Travel</span>
          <button className="bg-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-700 transition">
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
