import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Header from "./components/Header";

// Páginas de prueba
import Dashboard from "./pages/Dashboard";
import DataBase from "./pages/DataBase";
import Financial from "./pages/Financial";
import Home from "./pages/Home";
import Logs from "./pages/Logs";
import Portfolio from "./pages/Portfolio";
import Quotes from "./pages/Quotes";
import Trips from "./pages/Trips";
import Usuarios from "./pages/Usuarios";
import Test from "./pages/Test";



// Páginas de administración SUBMENUS
import Consult from "./pages/Consult";
import Feedback from "./pages/Feedback";
import HandleBooking from "./pages/HandleBooking";
import Lista from "./pages/Lista";
import ManageClient from "./pages/ManageClient";
import ManageDestinations from "./pages/ManageDestinations";
import Manageitems from "./pages/ManageItems";
import ManageProviders from "./pages/ManageProviders";
import ManageTour from "./pages/ManageTour";
import NewBooking from "./pages/NewBooking";
import NuevoUsuario from "./pages/NuevoUsuario";
import OperateBooking from "./pages/OperateBooking";
import Roles from "./pages/Roles";
import RolesQuotes from "./pages/RolesQuotes";
import Toi2026 from "./pages/Toi2026";
import Ton2026 from "./pages/Ton2026";
import QuotesComponent from "./pages/QuotesComponent";





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
            <Route path="/test" element={<Test />} />
            
           

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
            <Route path="/QuotesComponent" element={<QuotesComponent />} />
            

            {/* Ruta comodín para 404 */}
            <Route path="*" element={<div className="p-6">Página no encontrada</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
