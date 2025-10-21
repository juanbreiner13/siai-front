import React, { useEffect, useState } from "react";
import axios from "axios";

const TourTable = () => {
  const [tour, setTour] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // página actual
  const [searchTour, setSearchTour] = useState(""); // filtro global

  //Estados para modal
  const [showModal, setShowModal] = useState(false);
  const [newTour, setNewTour] = useState({
    variant: "",
    master_tour: "",
    description: "",
    inclusions: "",
    distribution: "",
  });

  const [editTour, setEditTour] = useState(null); 

  const itemsPerPage = 25; // registros por página

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/tour`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        setTour(response.data);
      } catch (err) {
        setError("Error al cargar los tours: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, []);

  // Crear tour
  const createTour = async (tourData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tour`,
        tourData,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      );
      setTour((prevTours) => [...prevTours, response.data]);
    } catch (err) {
      alert("Error al crear el tour: " + err);
    }
  };

  // editar tour
  const updateTour = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/tour/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      );
      setTour((prevTours) =>
        prevTours.map((tour) => (tour.id === id ? response.data : tour))
      );
    } catch (err) {
      alert("Error al actualizar el tour: " + err);
    }
  };
  
  // eliminar tour
  const deleteTour = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este tour?")) {
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tour/${id}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      });
      setTour((prevTours) => prevTours.filter((tour) => tour.id !== id));
    } catch (err) {
      alert("Error al eliminar el tour: " + err);
    }
  };


  // Mostrar estado de carga o error

  if (loading) {
    return <p className="text-center text-gray-600">Cargando tours...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // 🔎 Filtro global: busca en todos los campos
  const filteredTours = tour.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchTour.toLowerCase())
  );

  // Calcular registros de la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredTours.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold mb-4">Tours</h2>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {
          setNewTour({
            variant: "",
            master_tour: "",
            description: "",
            inclusions: "",
            distribution: "",
          });
          setEditTour(null);
          setShowModal(true);
        }}
      >
        + Nuevo Tour
      </button>
    </div>

      {/* Input de búsqueda */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Buscar tour:
        </label>
        <input
          type="text"
          placeholder="Escribe lo que quieras buscar..."
          value={searchTour}
          onChange={(e) => {
            setSearchTour(e.target.value);
            setCurrentPage(1); // reset a la página 1 al buscar
          }}
          className="w-full md:w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Tabla de clientes */}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow">
          <thead className="bg-gray-200">
            <tr>
              {tour.length > 0 &&
                Object.keys(tour[0]).map((key) => (
                  <th key={key} className="px-4 py-2 border">
                    {key}
                  </th>
                ))}
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="px-4 py-2 border">
                      {String(value)}
                    </td>
                  ))}
                  <td className="px-4 py-2 border">
                    <button
                      className="mr-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => {
                        setEditTour(row);
                        setShowModal(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => deleteTour(row.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tour.length > 0 ? Object.keys(tour[0]).length : 1}
                  className="text-center py-4 text-gray-500"
                >
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
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

      {/* Modal para crear/editar tour */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">
              {editTour ? "Editar Tour" : "Nuevo Tour"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editTour) {
                  updateTour(editTour.id, editTour);
                } else {
                  createTour(newTour);
                }
                setShowModal(false);
              }}
            >
              {["variant", "master_tour", "description", "inclusions", "distribution"].map((field) => (
                <div className="mb-4" key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace("_", " ")}:
                  </label>
                  <input
                    type="text"
                    value={editTour ? editTour[field] : newTour[field]}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (editTour) {
                        setEditTour((prev) => ({ ...prev, [field]: value }));
                      } else {
                        setNewTour((prev) => ({ ...prev, [field]: value }));
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-red-500"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editTour ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourTable;
