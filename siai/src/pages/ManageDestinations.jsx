import axios from "axios";
import { use, useEffect, useState } from "react";

const DestinosTable = () => {
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchDestino, setSearchDestino] = useState(""); // filtro manual

  // 👇 Para el modal
  const [showModal, setShowModal] = useState(false);
  const [newDestino, setNewDestino] = useState({
    destino: "",
    tipo: "",
  });

  const [editDestino, setEditDestino] = useState(null);

  const itemsPerPage = 25;

  // Cargar destinos
  
    const fetchDestinos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/destinations`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        setDestinos(response.data);
      } catch (err) {
        setError("Error al cargar los destinos: " + err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
    fetchDestinos();
  }, []);

   // Crear destino
  const handleCreateDestino = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/destinations`,
        newDestino,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      );
      setShowModal(false);
      setNewDestino({ destino: "", tipo: "" }); // limpiar formulario
      fetchDestinos(); // refrescar lista
    } catch (err) {
      alert("Error al crear el destino: " + err);
    }
  };

  //editar destino
  const handleEditDestino = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/destinations/${editDestino.id}`,
        editDestino,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      );
      setShowModal(false);
      setEditDestino(null); // limpiar formulario
      fetchDestinos(); // refrescar lista
    } catch (err) {
      alert("Error al editar el destino: " + err);
    }
  };

  // Eliminar destino
  const handleDeleteDestino = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este destino?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/destinations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      );
      fetchDestinos(); // refrescar lista
    } catch (err) {
      alert("Error al eliminar el destino: " + err);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Cargando destinos...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // 🔎 Filtro global: busca en cualquier campo del objeto
  const filteredDestinos = destinos.filter((item) =>
    Object.values(item)
      .join(" ") // convertimos todos los valores a un string
      .toLowerCase()
      .includes(searchDestino.toLowerCase())
  );

  // Paginación sobre los datos filtrados
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredDestinos.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(filteredDestinos.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold mb-4">Destinos</h2>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        + Nuevo Destino
      </button>
    </div>

      {/* Input de filtro */}


        {/* Buscador */}
        <input
          type="text"
          placeholder="Escribe el destino que quieras buscar..."
          value={searchDestino}
          onChange={(e) => {
            setSearchDestino(e.target.value);
            setCurrentPage(1); // reinicia a la primera página al buscar
          }}
          className="w-full md:w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow">
          <thead className="bg-gray-200">
            <tr>
              {destinos.length > 0 &&
                Object.keys(destinos[0]).map((key) => (
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
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => {
                        setEditDestino(row);
                        setShowModal(true);
                      }}
                      className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteDestino(row.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={destinos.length > 0 ? Object.keys(destinos[0]).length : 1}
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

    {/* Modal  crear/editar*/}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editDestino ? "Editar Destino" : "Nuevo Destino"}
            </h3>
            <form onSubmit={editDestino ? handleEditDestino : handleCreateDestino}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Destino</label>
                <input
                  type="text"
                  value={editDestino ? editDestino.destino : newDestino.destino}
                  onChange={(e) =>
                    editDestino
                      ? setEditDestino({ ...editDestino, destino: e.target.value })
                      : setNewDestino({ ...newDestino, destino: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Tipo</label>
                <input
                  type="text"
                  value={editDestino ? editDestino.tipo : newDestino.tipo}
                  onChange={(e) =>
                    editDestino
                      ? setEditDestino({ ...editDestino, tipo: e.target.value })
                      : setNewDestino({ ...newDestino, tipo: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditDestino(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                >
      
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default DestinosTable;
