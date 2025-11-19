import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

// 🔁 Debounce para evitar saturar el backend
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const EditableTestVentasAutoSave = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 filtro

  // ✅ Cargar datos
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/test_ventas`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        setVentas(response.data);
      } catch (error) {
        console.error("Error al cargar las ventas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  // ✅ Guardar cambios
  const saveChange = async (id, updatedField) => {
    try {
      setSavingId(id);
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/test_ventas/${id}`,
        updatedField,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error al guardar el cambio:", error);
    } finally {
      setTimeout(() => setSavingId(null), 400);
    }
  };

  const debouncedSave = useCallback(debounce(saveChange, 800), []);

  const handleChange = (id, field, value) => {
    setVentas((prev) =>
      prev.map((venta) =>
        venta.id === id ? { ...venta, [field]: value } : venta
      )
    );
    debouncedSave(id, { [field]: value });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta venta?")) return;
    try {
      setSavingId(id);
      await axios.delete(`${import.meta.env.VITE_API_URL}/test_ventas/${id}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      });
      setVentas((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-6 text-gray-600">Cargando...</div>;
  }

  // ✅ Filtrar resultados según searchTerm
  const filteredVentas = ventas.filter((venta) => {
    const term = searchTerm.toLowerCase();
    return (
      venta.item?.toLowerCase().includes(term) ||
      venta.nota?.toLowerCase().includes(term) ||
      venta.id?.toString().includes(term)
    );
  });

  // ===================== UI ======================
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* HEADER */}
      <div className="bg-white shadow-md rounded-lg p-5 mb-6">
        <h2 className="text-lg font-semibold text-red-500 mb-4">
          HANDLE QUOTE
        </h2>

        {/* Campos de búsqueda (decorativos) */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
          <input
            type="text"
            placeholder="Quote Id"
            className="border rounded-md px-3 py-2 col-span-1"
          />
          <input
            type="text"
            placeholder="Booking Reference"
            className="border rounded-md px-3 py-2 col-span-1"
          />
          <input
            type="text"
            placeholder="Client"
            className="border rounded-md px-3 py-2 col-span-2"
          />
          <input type="date" className="border rounded-md px-3 py-2 col-span-1" />
          <input
            type="text"
            placeholder="Trip Name"
            className="border rounded-md px-3 py-2 col-span-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <select className="border rounded-md px-3 py-2 col-span-3">
            <option value="">Consultant</option>
          </select>
          <button className="bg-blue-500 text-white rounded-md px-4 py-2">
            Buscar
          </button>
        </div>
      </div>

      {/* MAIN SECTION */}
      <div className="bg-white shadow-md rounded-lg p-5">
        {/* Botones superiores */}
        <div className="flex justify-between mb-3 flex-wrap gap-3">
          <div>
            <p className="text-sm">
              <strong>Consultant:</strong> Quote ID
            </p>
            <p className="text-sm">
              <strong>Quote ID:</strong> 8324
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="bg-blue-500 text-white px-3 py-1 rounded">
              Proposal Sections
            </button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded">
              Trip Information
            </button>
            <button className="bg-green-500 text-white px-3 py-1 rounded">
              Add Payment
            </button>
            <button className="bg-yellow-500 text-white px-3 py-1 rounded">
              Save Version
            </button>
            <button className="bg-purple-500 text-white px-3 py-1 rounded">
              Pax Form
            </button>
            <button className="bg-gray-500 text-white px-3 py-1 rounded">
              IVA
            </button>
          </div>
        </div>

        {/* 🔍 FILTRO LOCAL */}
        <div className="mb-4 flex justify-end">
          <input
            type="text"
            placeholder="Buscar por ID, item o nota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-md px-3 py-2 w-full md:w-1/3 focus:ring focus:ring-blue-300"
          />
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-gray-700">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Costo</th>
                <th className="p-2 border">Venta</th>
                <th className="p-2 border">Pax</th>
                <th className="p-2 border">Día</th>
                <th className="p-2 border">Hora</th>
                <th className="p-2 border">Nota</th>
                <th className="p-2 border">Estado</th>
                <th className="p-2 border">Acción</th>
              </tr>
            </thead>

            <tbody>
              {filteredVentas.length > 0 ? (
                filteredVentas.map((venta) => (
                  <tr key={venta.id} className="hover:bg-gray-50">
                    <td className="p-2 border text-center">{venta.id}</td>

                    <td className="p-2 border">
                      <input
                        type="text"
                        value={venta.item || ""}
                        onChange={(e) =>
                          handleChange(venta.id, "item", e.target.value)
                        }
                        className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                      />
                    </td>

                    <td className="p-2 border">
                      <input
                        type="number"
                        value={venta.costo || ""}
                        onChange={(e) =>
                          handleChange(venta.id, "costo", e.target.value)
                        }
                        className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                      />
                    </td>

                    <td className="p-2 border">
                      <input
                        type="number"
                        value={venta.venta || ""}
                        onChange={(e) =>
                          handleChange(venta.id, "venta", e.target.value)
                        }
                        className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                      />
                    </td>

                    <td className="p-2 border text-center">
                      <input
                        type="number"
                        value={venta.pasajeros || ""}
                        onChange={(e) =>
                          handleChange(venta.id, "pasajeros", e.target.value)
                        }
                        className="border rounded p-1 w-16 text-center focus:ring focus:ring-blue-300"
                      />
                    </td>

                    <td className="p-2 border">
                      <input
                        type="number"
                        value={venta.dia || ""}
                        onChange={(e) =>
                          handleChange(venta.id, "dia", e.target.value)
                        }
                        className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                      />
                    </td>

                    <td className="p-2 border">
                      <input
                        type="time"
                        value={venta.hora || ""}
                        onChange={(e) =>
                          handleChange(venta.id, "hora", e.target.value)
                        }
                        className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                      />
                    </td>

                    <td className="p-2 border">
                      <input
                        type="text"
                        value={venta.nota || ""}
                        onChange={(e) =>
                          handleChange(venta.id, "nota", e.target.value)
                        }
                        className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                      />
                    </td>

                    <td className="p-2 border text-center">
                      {savingId === venta.id ? (
                        <span className="text-yellow-500 font-medium animate-pulse">
                          Guardando...
                        </span>
                      ) : (
                        <span className="text-green-600 font-medium">✓</span>
                      )}
                    </td>

                    <td className="p-2 border text-center">
                      <button
                        onClick={() => handleDelete(venta.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center text-gray-500 p-4 italic"
                  >
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Botones finales */}
        <div className="text-center mt-5">
          <p className="uppercase text-gray-600 font-semibold text-xs tracking-wider">
            End of Services
          </p>
          <div className="flex justify-center gap-3 mt-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Service
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Add Item
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded">
              Add Hotel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditableTestVentasAutoSave;
