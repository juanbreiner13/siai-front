import axios from "axios";
import { useEffect, useState } from "react";

const B2bTable = () => {
  const [b2b, setB2b] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchClient, setSearchClient] = useState("");

  // Estados para modal
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({
    client: "",
    email_accounting: "",
    id_tributaria: "",
    country: "",
    address: "",
    logo: "",
    impuestos: "",
    source: "",
    detalle: "",
    comentario: "",
    created_at: "",
  });

  const [editClient, setEditClient] = useState(null);

  const itemsPerPage = 25;

  // Cargar clientes
  const fetchB2b = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/client`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      );
      setB2b(response.data);
    } catch (err) {
      setError("Error al cargar los clientes: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchB2b();
  }, []);

  // Crear cliente
  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/client`, newClient, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      });
      setShowModal(false);
      setNewClient({
        client: "",
        email_accounting: "",
        id_tributaria: "",
        country: "",
        address: "",
        logo: "",
        impuestos: "",
        source: "",
        detalle: "",
        comentario: "",
        created_at: "",
      });
      fetchB2b();
    } catch (err) {
      alert("Error al crear cliente: " + err);
    }
  };

  // Editar cliente
  const handleEditClick = (client) => {
    setEditClient(client);
    setShowModal(true);
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/client/${editClient.id}`,
        editClient,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      );
      setShowModal(false);
      setEditClient(null);
      fetchB2b();
    } catch (err) {
      alert("Error al actualizar cliente: " + err);
    }
  };

  // Eliminar cliente
  const handleDeleteClient = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/client/${id}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      });
      fetchB2b();
    } catch (err) {
      alert("Error al eliminar cliente: " + err);
    }
  };

  if (loading)
    return <p className="text-center text-gray-600">Cargando clientes...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const filteredClients = b2b.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchClient.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredClients.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setEditClient(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={searchClient}
        onChange={(e) => {
          setSearchClient(e.target.value);
          setCurrentPage(1);
        }}
        className="mb-4 w-full md:w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Tabla de clientes */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow">
          <thead className="bg-gray-200">
            <tr>
              {b2b.length > 0 &&
                Object.keys(b2b[0])
                  .filter((key) => key !== "logo") // 👈 excluye la columna logo
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
                      onClick={() => handleDeleteClient(row.id)}
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
                  colSpan={b2b.length > 0 ? Object.keys(b2b[0]).length + 1 : 1}
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
              {editClient ? "Editar Cliente" : "Agregar Cliente"}
            </h3>

            <form
              onSubmit={editClient ? handleUpdateClient : handleCreateClient}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Cliente"
                value={editClient ? editClient.client : newClient.client}
                onChange={(e) =>
                  editClient
                    ? setEditClient({ ...editClient, client: e.target.value })
                    : setNewClient({ ...newClient, client: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              <input
                type="varchar"
                placeholder="Categoria"
                value={editClient ? editClient.category : newClient.category}
                onChange={(e) =>
                  editClient
                    ? setEditClient({ ...editClient, category: e.target.value })
                    : setNewClient({ ...newClient, category: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="varchar"
                placeholder="Id_tributaria"
                value={
                  editClient
                    ? editClient.id_tributaria
                    : newClient.id_tributaria
                }
                onChange={(e) =>
                  editClient
                    ? setEditClient({
                        ...editClient,
                        id_tributaria: e.target.value,
                      })
                    : setNewClient({
                        ...newClient,
                        id_tributaria: e.target.value,
                      })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="varchar"
                placeholder="Pais"
                value={editClient ? editClient.country : newClient.country}
                onChange={(e) =>
                  editClient
                    ? setEditClient({ ...editClient, country: e.target.value })
                    : setNewClient({ ...newClient, country: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="varchar"
                placeholder="Telefono"
                value={editClient ? editClient.telephone : newClient.telephone}
                onChange={(e) =>
                  editClient
                    ? setEditClient({
                        ...editClient,
                        telephone: e.target.value,
                      })
                    : setNewClient({ ...newClient, telephone: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="varchar"
                placeholder="Direccion"
                value={editClient ? editClient.address : newClient.address}
                onChange={(e) =>
                  editClient
                    ? setEditClient({ ...editClient, address: e.target.value })
                    : setNewClient({ ...newClient, address: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="varchar"
                placeholder="Correo electronico"
                value={
                  editClient
                    ? editClient.email_accounting
                    : newClient.email_accounting
                }
                onChange={(e) =>
                  editClient
                    ? setEditClient({
                        ...editClient,
                        email_accounting: e.target.value,
                      })
                    : setNewClient({
                        ...newClient,
                        email_accounting: e.target.value,
                      })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Logo"
                value={editClient ? editClient.logo : newClient.logo}
                onChange={(e) =>
                  editClient
                    ? setEditClient({ ...editClient, logo: e.target.value })
                    : setNewClient({ ...newClient, logo: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Impuestos"
                value={editClient ? editClient.impuestos : newClient.impuestos}
                onChange={(e) =>
                  editClient
                    ? setEditClient({
                        ...editClient,
                        impuestos: e.target.value,
                      })
                    : setNewClient({ ...newClient, impuestos: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="varchar"
                placeholder="Fuente"
                value={editClient ? editClient.source : newClient.source}
                onChange={(e) =>
                  editClient
                    ? setEditClient({ ...editClient, source: e.target.value })
                    : setNewClient({ ...newClient, source: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="varchar"
                placeholder="Detalle"
                value={editClient ? editClient.detalle : newClient.detalle}
                onChange={(e) =>
                  editClient
                    ? setEditClient({ ...editClient, detalle: e.target.value })
                    : setNewClient({ ...newClient, detalle: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="varchar"
                placeholder="comentario"
                value={
                  editClient ? editClient.comentario : newClient.comentario
                }
                onChange={(e) =>
                  editClient
                    ? setEditClient({
                        ...editClient,
                        comentario: e.target.value,
                      })
                    : setNewClient({ ...newClient, comentario: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="varchar"
                placeholder="Creado_En"
                value={
                  editClient ? editClient.created_at : newClient.created_at
                }
                onChange={(e) =>
                  editClient
                    ? setEditClient({
                        ...editClient,
                        created_at: e.target.value,
                      })
                    : setNewClient({ ...newClient, created_at: e.target.value })
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
                    setEditClient(null);
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {editClient ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default B2bTable;
