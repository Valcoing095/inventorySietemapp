import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Equipos from "./pages/Equipolist";
import Usuarios from "./pages/Usuariolist";
// import Impresoras from "./Impresoras";

function App() {
  return (
    <Router>
      <div className="d-flex">
        {/* Sidebar */}
        <div className="bg-dark text-white vh-100 p-3" style={{ width: "250px" }}>
          <h4 className="text-center">Menú</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/equipos">Equipos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/usuarios">Usuarios</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/impresoras">Impresoras</Link>
            </li>
          </ul>
        </div>

        {/* Contenido principal */}
        <div className="flex-grow-1 p-3">
          <Routes>
            <Route path="/equipos" element={<Equipos />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/impresoras"  />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
