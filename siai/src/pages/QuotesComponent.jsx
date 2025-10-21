import React, { useEffect, useState } from "react";
import axios from "axios";

const EditableTourTable = () => {
  const [tours, setTours] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Cargar datos desde el backend
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/tour`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        setTours(response.data);
      } catch (error) {
        console.error("Error al cargar los tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // ✅ Iniciar edición
  const handleEdit = (id) => {
    const fila = tours.find((tour) => tour.id === id);
    setEditId(id);
    setEditValues(fila);
  };

  // ✅ Detectar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues({ ...editValues, [name]: value });
  };

  // ✅ Guardar cambios (PUT al backend)
  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/tour/${editId}`,
        editValues,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Actualizar frontend
      const updated = tours.map((t) =>
        t.id === editId ? editValues : t
      );
      setTours(updated);
      setEditId(null);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  // ✅ Cancelar edición
  const handleCancel = () => {
    setEditId(null);
    setEditValues({});
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">Cargando tours...</div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        🧭 Grilla Editable de Tours
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border p-3 text-left">Variant</th>
              <th className="border p-3 text-left">Master Tour</th>
              <th className="border p-3 text-left">Description</th>
              <th className="border p-3 text-left">Inclusions</th>
              <th className="border p-3 text-left">Distribution</th>
              <th className="border p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id} className="hover:bg-gray-50">
                {editId === tour.id ? (
                  <>
                    <td className="border p-2">
                      <input
                        name="variant"
                        value={editValues.variant || ""}
                        onChange={handleChange}
                        className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        name="master_tour"
                        value={editValues.master_tour || ""}
                        onChange={handleChange}
                        className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        name="description"
                        value={editValues.description || ""}
                        onChange={handleChange}
                        className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        name="inclusions"
                        value={editValues.inclusions || ""}
                        onChange={handleChange}
                        className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        name="distribution"
                        value={editValues.distribution || ""}
                        onChange={handleChange}
                        className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                      />
                    </td>

                    <td className="border p-2 text-center">
                      <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border p-2">{tour.variant}</td>
                    <td className="border p-2">{tour.master_tour}</td>
                    <td className="border p-2">{tour.description}</td>
                    <td className="border p-2">{tour.inclusions}</td>
                    <td className="border p-2">{tour.distribution}</td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleEdit(tour.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Editar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditableTourTable;
