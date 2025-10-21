import React, { useEffect, useState } from "react";
import axios from "axios";

const ProviderTable = () => {
  const [provider, setProvider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // página actual
  const [searchProvider, setSearchProvider] = useState(""); // filtro global

  //estados para modal
  const [showModal, setShowModal] = useState(false);
  const [newProvider, setNewProvider] = useState({
    name: "",
    legal_name: "",
    codigo: "",
    cellphone: "",
    email: "",
    type: "",
    city: "",
    comments: "",
    nit: "",
    banco: "",
    link: "",
    tags: "",
  });

  const [editProvider, setEditProvider] = useState(null);

  const itemsPerPage = 25; // registros por página

  // Cargar proveedores
  const fetchProvider = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/provider`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      );
      setProvider(response.data);
    } catch (err) {
      setError("Error al cargar los proveedores: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvider();
  }, []);

  // Crear proveedor
  const handleCreateProvider = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/provider`, newProvider, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      });
      setShowModal(false);
      setNewProvider({
        name: "",
        legal_name: "",
        codigo: "",
        cellphone: "",
        email: "",
        type: "",
        city: "",
        comments: "",
        nit: "",
        banco: "",
        link: "",
        tags: "",
      });
      fetchProvider();
    } catch (err) {
      alert("Error al crear proveedor: " + err);
    }
  };

  // Editar proveedor
  const handleEditClick = (provider) => {
    setEditProvider(provider);
    setShowModal(true);
  };

  const handleUpdateProvider = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/provider/${editProvider.id}`,
        editProvider,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      );
      setShowModal(false);
      setEditProvider(null);
      fetchProvider();
    } catch (err) {
      alert("Error al actualizar proveedor: " + err);
    }
  };

  // Eliminar proveedor
  const handleDeleteProvider = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este proveedor?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/provider/${id}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      });
      fetchProvider();
    } catch (err) {
      alert("Error al eliminar proveedor: " + err);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Cargando proveedores...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // 🔎 Filtro global: busca en todos los campos
  const filteredProviders = provider.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchProvider.toLowerCase())
  );

  // Calcular registros de la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProviders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Proveedores</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setEditProvider(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          + Nuevo Proveedor
        </button>
      </div>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar proveedor..."
        value={searchProvider}
        onChange={(e) => {
          setSearchProvider(e.target.value);
          setCurrentPage(1);
        }}
        className="mb-4 w-full md:w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Tabla de proveedores */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow">
          <thead className="bg-gray-200">
            <tr>
              {provider.length > 0 &&
                Object.keys(provider[0])
                  .map((key) => (
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
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleEditClick(row)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProvider(row.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={provider.length > 0 ? Object.keys(provider[0]).length + 1 : 1}
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
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editProvider ? "Editar Proveedor" : "Agregar Proveedor"}
            </h3>

            <form
              onSubmit={editProvider ? handleUpdateProvider : handleCreateProvider}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Nombre"
                value={editProvider ? editProvider.name : newProvider.name}
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({ ...editProvider, name: e.target.value })
                    : setNewProvider({ ...newProvider, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Legal Name"
                value={editProvider ? editProvider.legal_name : newProvider.legal_name}
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({ ...editProvider, legal_name: e.target.value })
                    : setNewProvider({ ...newProvider, legal_name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Codigo"
                value={editProvider ? editProvider.codigo : newProvider.codigo}
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({ ...editProvider, codigo: e.target.value })
                    : setNewProvider({ ...newProvider, codigo: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Celular"
                value={editProvider ? editProvider.cellphone : newProvider.cellphone}
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({ ...editProvider, cellphone: e.target.value })
                    : setNewProvider({ ...newProvider, cellphone: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              <input
                type="text"
                placeholder="Correo electronico"
                value={editProvider ? editProvider.email : newProvider.email}
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({ ...editProvider, email: e.target.value })
                    : setNewProvider({ ...newProvider, email: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              <input
                type="text"
                placeholder="Tipo"
                value={editProvider ? editProvider.type : newProvider.type}
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({ ...editProvider, type: e.target.value })
                    : setNewProvider({ ...newProvider, type: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              <input
                type="text"
                placeholder="Ciudad"
                value={editProvider ? editProvider.city : newProvider.city}
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({ ...editProvider, city: e.target.value })
                    : setNewProvider({ ...newProvider, city: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              <input
                type="text"
                placeholder="Comentarios"
                value={editProvider ? editProvider.comments : newProvider.comments}
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({ ...editProvider, comments: e.target.value })
                    : setNewProvider({ ...newProvider, comments: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              <input
                type="text"
                placeholder="NIT"
                value={editProvider ? editProvider.nit : newProvider.nit}
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({ ...editProvider, nit: e.target.value })
                    : setNewProvider({ ...newProvider, nit: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              <input
                type="text"
                placeholder="Banco"
                value={editProvider ? editProvider.banco : newProvider.banco}
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({ ...editProvider, banco: e.target.value })
                    : setNewProvider({ ...newProvider, banco: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              <input
                type="text"
                placeholder="Link"
                value={editProvider ? editProvider.link : newProvider.link}
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({ ...editProvider, link: e.target.value })
                    : setNewProvider({ ...newProvider, link: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              <input
                type="text"
                placeholder="Etiquetas (tags)"
                value={editProvider ? editProvider.tags : newProvider.tags}
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({ ...editProvider, tags: e.target.value })
                    : setNewProvider({ ...newProvider, tags: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              {/* ...otros campos */}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditProvider(null);
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {editProvider ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderTable;
