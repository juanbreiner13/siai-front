import React, { useEffect, useState } from "react";
import axios from "axios";

const ServiceTable = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchService, setSearchService] = useState("");

  // Estados para modales
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState(null);

  // Estado del nuevo servicio
  const [newService, setNewService] = useState({
    code: "",
    name: "",
    city: "",
    type: "",
    type_charge: "",
    name_shown: "",
    name_shown_ES: "",
    name_shown_GE: "",
    name_shown_FR: "",
    provider: "",
  });

  const itemsPerPage = 25;

  // Cargar servicios
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/service`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        });
        setServices(response.data);
      } catch (err) {
        setError("Error al cargar los servicios: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Crear servicio
  const createService = async (service) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/service`,
        service,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      );
      setServices((prev) => [...prev, response.data]);
      setShowModal(false);
      setNewService({
        code: "",
        name: "",
        city: "",
        type: "",
        type_charge: "",
        name_shown: "",
        name_shown_ES: "",
        name_shown_GE: "",
        name_shown_FR: "",
        provider: "",
      });
    } catch (err) {
      console.error("Error al crear el servicio:", err.response?.data || err);
      alert("Error al crear el servicio: " + JSON.stringify(err.response?.data));
    }
  };

  // Editar servicio
  const updateService = async (service) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/service/${service.id}`,
        service,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      );
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? response.data : s))
      );
      setEditService(null);
    } catch (err) {
      console.error("Error al actualizar el servicio:", err.response?.data || err);
      alert("Error al actualizar el servicio: " + JSON.stringify(err.response?.data));
    }
  };

  // Eliminar servicio
  const deleteService = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este servicio?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/service/${id}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error al eliminar el servicio:", err);
      alert("Error al eliminar el servicio: " + err.message);
    }
  };

  if (loading) return <p className="text-center text-gray-600 py-10">Cargando servicios...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  // Filtro global
  const filteredServices = services.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(searchService.toLowerCase())
  );

  // Paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredServices.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Servicios</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          + Nuevo Servicio
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar servicio:</label>
        <input
          type="text"
          placeholder="Escribe lo que quieras buscar..."
          value={searchService}
          onChange={(e) => {
            setSearchService(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {Object.keys(services[0] || {}).map((key) => (
                <th key={key} className="px-4 py-2 border text-sm font-semibold">
                  {key}
                </th>
              ))}
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 text-center">
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="px-4 py-2 border text-sm">
                      {String(value)}
                    </td>
                  ))}
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => setEditService(row)}
                      className="mr-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteService(row.id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={Object.keys(services[0] || {}).length + 1}
                  className="text-center py-4 text-gray-500"
                >
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center mt-4 gap-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          ⬅ Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente ➡
        </button>
      </div>

      {/* Modal Crear/Editar */}
      {(showModal || editService) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editService ? "Editar Servicio" : "Nuevo Servicio"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editService) updateService(editService);
                else createService(newService);
              }}
            >
              {Object.keys(newService).map((key) => (
                <div className="mb-3" key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key}:
                  </label>
                  <input
                    type="text"
                    value={editService ? editService[key] || "" : newService[key]}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (editService)
                        setEditService((prev) => ({ ...prev, [key]: value }));
                      else
                        setNewService((prev) => ({ ...prev, [key]: value }));
                    }}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditService(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {editService ? "Guardar Cambios" : "Crear Servicio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTable;
