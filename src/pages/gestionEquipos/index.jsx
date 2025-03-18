import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Gestión de Equipos</h1>
      <div className="row justify-content-center">
        {/* Card Equipos */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Equipos</h5>
              <p className="card-text">Administra y gestiona los equipos registrados en el sistema.</p>
              <Link to="/equipos" className="btn btn-primary">Ir a Equipos</Link>
            </div>
          </div>
        </div>

        {/* Card Contratos */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Contratos</h5>
              <p className="card-text">Consulta y administra los contratos de los equipos.</p>
              <Link to="/contratos" className="btn btn-primary">Ir a Contratos</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
