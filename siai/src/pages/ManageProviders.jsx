import React, { useEffect, useState } from "react";
import axios from "axios";

const normalizeExtraInfo = (data = {}) => ({
  tipo_documento: data.tipo_documento || "",
  tipo_regimen: data.tipo_regimen || "",
  CIUU: data.CIUU || "",
  actividad_economica: data.actividad_economica || "",
  comercial_nombre: data.comercial_nombre || "",
  comercial_correo: data.comercial_correo || "",
  comercial_telefono: data.comercial_telefono || "",
  conta_nombre: data.conta_nombre || "",
  conta_correo: data.conta_correo || "",
  conta_telefono: data.conta_telefono || "",
  rut: data.rut || "",
  camara_comercio: data.camara_comercio || "",
  cedula_rl: data.cedula_rl || "",
  banco: data.banco || "",
  otro_documento: data.otro_documento || "",
  politica_pago: data.politica_pago || "",
  correo_operaciones: data.correo_operaciones || "",
  estado: data.estado || "DISPONIBLE",
});

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
    nit: "",
    codigo: "",
    cellphone: "",
    email: "",
    type: "",
    city: "",
    comments: "",
    banco: "",
    link: "",
    tags: "",
  });

  //estados para modal extrainfo
  const [extraInfo, setExtraInfo] = useState({
    tipo_documento: "",
    tipo_regimen: "",
    CIUU: "",
    actividad_economica: "",
    comercial_nombre: "",
    comercial_correo: "",
    comercial_telefono: "",
    conta_nombre: "",
    conta_correo: "",
    conta_telefono: "",
    rut: "",
    camara_comercio: "",
    cedula_rl: "",
    banco: "",
    otro_documento: "",
    politica_pago: "",
    correo_operaciones: "",
    estado: "DISPONIBLE",
  });

  const [editProvider, setEditProvider] = useState(null);

  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Etiquetas de columnas
  // Columnas que NO se muestran en la tabla
  const hiddenColumns = ["id", "link", "codigo"];
  const columnLabels = {
    name: "Nombre Com.",
    legal_name: "Razon social",
    nit: "NIT",
    cellphone: "Telefono",
    email: "Email",
    type: "Tipo",
    city: "Ciudad",
    comments: "Comentarios",
    banco: "Banco",
    tags: "Tags",
    link: "Enlace",
    codigo: "Código",
    detalle: "Detalles",
  };

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
      await axios.post(
        `${import.meta.env.VITE_API_URL}/provider`,
        newProvider,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      );
      setShowModal(false);
      setNewProvider({
        name: "",
        legal_name: "",
        nit: "",
        codigo: "",
        cellphone: "",
        email: "",
        type: "",
        city: "",
        comments: "",
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
  const handleEditClick = async (provider) => {
    if (!provider?.id) {
      console.warn("Proveedor sin ID válido", provider);
      return;
    }

    setEditProvider(provider);
    setShowModal(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/providers_extra_info/${provider.id}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      );

      setExtraInfo(normalizeExtraInfo(res.data));
      console.log("Extra info cargada:", res.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error(err);
      }
      resetExtraInfo();
    }
  };

  const resetExtraInfo = () => {
    setExtraInfo({
      tipo_documento: "",
      tipo_regimen: "",
      CIUU: "",
      actividad_economica: "",
      comercial_nombre: "",
      comercial_correo: "",
      comercial_telefono: "",
      conta_nombre: "",
      conta_correo: "",
      conta_telefono: "",
      rut: "",
      camara_comercio: "",
      cedula_rl: "",
      banco: "",
      otro_documento: "",
      politica_pago: "",
      correo_operaciones: "",
      estado: "DISPONIBLE",
    });
  };

  const handleUpdateProvider = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Actualiza provider
      await axios.put(
        `${import.meta.env.VITE_API_URL}/provider/${editProvider.id}`,
        editProvider,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      );

      // 2️⃣ Actualiza info adicional
      await axios.put(
        `${import.meta.env.VITE_API_URL}/providers_extra_info/provider/${
          editProvider.id
        }`,
        extraInfo,
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
      console.error(err);
      alert("Error al actualizar proveedor");
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

  // 🔎 Filtro global
  const filteredProviders = provider.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchProvider.toLowerCase())
  );

  // PAGINACIÓN
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProviders.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);

  return (
    <div className="w-full px-2 md:px-6 xl:px-10 py-6">
      {/* TÍTULO */}
      <h2 className="text-xl font-bold text-red-600 mb-4 uppercase">
        Providers
      </h2>

      {/* CONTROLES SUPERIORES */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
        {/* Botón verde */}
        <button
          onClick={() => {
            setShowModal(true);
            setEditProvider(null);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Agregar Registro
        </button>

        {/* BUSCADOR */}
        <input
          type="text"
          placeholder="Search..."
          value={searchProvider}
          onChange={(e) => {
            setSearchProvider(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border rounded w-64 shadow-sm"
        />
      </div>

      {/* SHOW ENTRIES */}
      <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
        <span>Show</span>

        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border px-2 py-1 rounded-md shadow-sm"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <span>entries</span>
      </div>

      {/* TABLA */}
      <div className="border border-black rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-[1600px] w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-100">
              {provider.length > 0 &&
                Object.keys(provider[0])
                  .filter((key) => !hiddenColumns.includes(key))
                  .map((key) => (
                    <th
                      key={key}
                      className="border px-4 py-3 text-sm font-semibold uppercase whitespace-nowrap"
                    >
                      {columnLabels[key] || key}
                    </th>
                  ))}

              {/* COLUMNA EXTRA DE DETALLES */}
              <th className="border px-3 py-2 text-xs font-semibold uppercase whitespace-nowrap text-center">
                Detalles
              </th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {Object.keys(row)
                  .filter((key) => !hiddenColumns.includes(key))
                  .map((key, idx) => (
                    <td
                      key={idx}
                      className="border px-4 py-3 text-sm whitespace-nowrap"
                    >
                      {String(row[key])}
                    </td>
                  ))}

                {/* COLUMNA DETALLES */}
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleEditClick(row)} // tu función
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INFO + PAGINACIÓN */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mt-4">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, filteredProviders.length)} of{" "}
          {filteredProviders.length} entries
        </p>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {[...Array(totalPages)].slice(0, 5).map((_, idx) => {
            const num = idx + 1;
            return (
              <button
                key={idx}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 border rounded ${
                  currentPage === num ? "bg-blue-600 text-white" : ""
                }`}
              >
                {num}
              </button>
            );
          })}

          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[95%] max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editProvider ? "Editar Proveedor" : "Agregar Proveedor"}
            </h3>

            <form
              onSubmit={
                editProvider ? handleUpdateProvider : handleCreateProvider
              }
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
                value={
                  editProvider
                    ? editProvider.legal_name
                    : newProvider.legal_name
                }
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({
                        ...editProvider,
                        legal_name: e.target.value,
                      })
                    : setNewProvider({
                        ...newProvider,
                        legal_name: e.target.value,
                      })
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
                placeholder="Codigo"
                value={editProvider ? editProvider.codigo : newProvider.codigo}
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({
                        ...editProvider,
                        codigo: e.target.value,
                      })
                    : setNewProvider({ ...newProvider, codigo: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Celular"
                value={
                  editProvider ? editProvider.cellphone : newProvider.cellphone
                }
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({
                        ...editProvider,
                        cellphone: e.target.value,
                      })
                    : setNewProvider({
                        ...newProvider,
                        cellphone: e.target.value,
                      })
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
                    ? setEditProvider({
                        ...editProvider,
                        email: e.target.value,
                      })
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
                value={
                  editProvider ? editProvider.comments : newProvider.comments
                }
                onChange={(e) =>
                  editProvider
                    ? setEditProvider({
                        ...editProvider,
                        comments: e.target.value,
                      })
                    : setNewProvider({
                        ...newProvider,
                        comments: e.target.value,
                      })
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
                    ? setEditProvider({
                        ...editProvider,
                        banco: e.target.value,
                      })
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

              {/*Ventana modal para editar
Esta ventana modal trae una pequeña ventana que aparece encima de la principal donde trae toda la informacion sobre lo proveedores y permite editar cada uno de sus campos */}
              {editProvider && (
                <>
                  <hr className="my-4" />
                  <h4 className="text-lg font-semibold">
                    Información Adicional
                  </h4>

                  {/* Documento */}
                  <select
                    value={extraInfo.tipo_documento}
                    onChange={(e) =>
                      setExtraInfo({
                        ...extraInfo,
                        tipo_documento: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Tipo de documento</option>
                    <option value="CC">CC</option>
                    <option value="NIT">NIT</option>
                    <option value="CE">CE</option>
                  </select>

                  {/* Régimen */}
                  <select
                    value={extraInfo.tipo_regimen}
                    onChange={(e) =>
                      setExtraInfo({
                        ...extraInfo,
                        tipo_regimen: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Tipo de régimen</option>
                    <option value="PERSONA JURIDICA">Persona Jurídica</option>
                    <option value="PERSONA NATURAL">Persona Natural</option>
                    <option value="REGIMEN SIMPLE">Régimen Simple</option>
                  </select>

                  <input
                    type="text"
                    placeholder="CIUU"
                    value={extraInfo.CIUU}
                    onChange={(e) =>
                      setExtraInfo({ ...extraInfo, CIUU: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Actividad económica"
                    value={extraInfo.actividad_economica}
                    onChange={(e) =>
                      setExtraInfo({
                        ...extraInfo,
                        actividad_economica: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  {/* Comercial */}
                  <input
                    type="text"
                    placeholder="Nombre comercial"
                    value={extraInfo.comercial_nombre}
                    onChange={(e) =>
                      setExtraInfo({
                        ...extraInfo,
                        comercial_nombre: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  <input
                    type="email"
                    placeholder="Correo comercial"
                    value={extraInfo.comercial_correo}
                    onChange={(e) =>
                      setExtraInfo({
                        ...extraInfo,
                        comercial_correo: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Teléfono comercial"
                    value={extraInfo.comercial_telefono}
                    onChange={(e) =>
                      setExtraInfo({
                        ...extraInfo,
                        comercial_telefono: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  {/* Contabilidad */}
                  <input
                    type="text"
                    placeholder="Nombre contabilidad"
                    value={extraInfo.conta_nombre}
                    onChange={(e) =>
                      setExtraInfo({
                        ...extraInfo,
                        conta_nombre: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  <input
                    type="email"
                    placeholder="Correo contabilidad"
                    value={extraInfo.conta_correo}
                    onChange={(e) =>
                      setExtraInfo({
                        ...extraInfo,
                        conta_correo: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Teléfono contabilidad"
                    value={extraInfo.conta_telefono}
                    onChange={(e) =>
                      setExtraInfo({
                        ...extraInfo,
                        conta_telefono: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  {/* Documentos */}
                  <input
                    type="text"
                    placeholder="RUT (link)"
                    value={extraInfo.rut}
                    onChange={(e) =>
                      setExtraInfo({ ...extraInfo, rut: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Cámara de comercio (link)"
                    value={extraInfo.camara_comercio}
                    onChange={(e) =>
                      setExtraInfo({
                        ...extraInfo,
                        camara_comercio: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Cédula representante legal (link)"
                    value={extraInfo.cedula_rl}
                    onChange={(e) =>
                      setExtraInfo({
                        ...extraInfo,
                        cedula_rl: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Otro documento (link)"
                    value={extraInfo.otro_documento}
                    onChange={(e) =>
                      setExtraInfo({
                        ...extraInfo,
                        otro_documento: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  {/* Otros */}
                  <select
                    value={extraInfo.politica_pago}
                    onChange={(e) =>
                      setExtraInfo({
                        ...extraInfo,
                        politica_pago: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Política de pago</option>
                    <option value="Estándar">Estándar</option>
                    <option value="Prioritaria">Prioritaria</option>
                    <option value="Anticipada">Anticipada</option>
                    <option value="Sin Acordar">Sin acordar</option>
                  </select>

                  <input
                    type="email"
                    placeholder="Correo operaciones"
                    value={extraInfo.correo_operaciones}
                    onChange={(e) =>
                      setExtraInfo({
                        ...extraInfo,
                        correo_operaciones: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  <select
                    value={extraInfo.estado}
                    onChange={(e) =>
                      setExtraInfo({ ...extraInfo, estado: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="DISPONIBLE">Disponible</option>
                    <option value="LISTA GRIS">Lista gris</option>
                    <option value="LISTA NEGRA">Lista negra</option>
                  </select>
                </>
              )}

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
