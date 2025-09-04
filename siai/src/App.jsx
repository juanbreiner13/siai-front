import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";

// Páginas de prueba
import Home from "./pages/Home";
import Usuarios from "./pages/Usuarios";
import Logs from "./pages/Logs";
import Dashboard from "./pages/Dashboard";
import DataBase from "./pages/DataBase";
import Portfolio from "./pages/Portfolio";
import Quotes from "./pages/Quotes";
import Trips from "./pages/Trips";
import Financial from "./pages/Financial";


// Páginas de administración SUBMENUS
import NuevoUsuario from "./pages/NuevoUsuario";
import Lista from "./pages/Lista";
import Roles from "./pages/Roles";
import Manageitems from "./pages/ManageItems";
import ManageTour from "./pages/ManageTour";
import ManageProviders from "./pages/ManageProviders";
import ManageClient from "./pages/ManageClient";
import ManageDestinations from "./pages/ManageDestinations";
import Toi2026 from "./pages/Toi2026";
import Ton2026 from "./pages/Ton2026";
import NewBooking from "./pages/NewBooking";
import HandleBooking from "./pages/HandleBooking";
import RolesQuotes from "./pages/RolesQuotes";
import OperateBooking from "./pages/OperateBooking";
import Feedback from "./pages/Feedback";
import Consult from "./pages/Consult";



export default function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <div className="container mx-auto">
          <Routes>
            {/* Redirigir raíz a /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dataBase" element={<DataBase />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/financial" element={<Financial />} />

            {/* Ruta de administración SUBMENUS */}
            <Route path="/nuevoUsuario" element={<NuevoUsuario />} />
            <Route path="/lista" element={<Lista />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/manageitems" element={<Manageitems />} />
            <Route path="/managetour" element={<ManageTour />} />
            <Route path="/manageproviders" element={<ManageProviders />} />
            <Route path="/manageclient" element={<ManageClient />} />
            <Route path="/managedestinations" element={<ManageDestinations />} />
            <Route path="/toi2026" element={<Toi2026 />} />
            <Route path="/ton2026" element={<Ton2026 />} />
            <Route path="/newBooking" element={<NewBooking />} />
            <Route path="/handleBooking" element={<HandleBooking />} />
            <Route path="/rolesQuotes" element={<RolesQuotes />} />
            <Route path="/operateBooking" element={<OperateBooking />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/consult" element={<Consult />} />


            {/* Ruta comodín para 404 */}
            <Route path="*" element={<div className="p-6">Página no encontrada</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
