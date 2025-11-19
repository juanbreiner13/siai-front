import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

// Función para evitar múltiples requests mientras se escribe
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const EditableTourAutoSave = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Cargar tours desde el backend
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

  // ✅ Guardar cambios en backend (PUT)
  const saveChange = async (id, updatedField) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/tour/${id}`,
        updatedField,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Campo actualizado en BD:", updatedField);
    } catch (error) {
      console.error("Error al guardar el cambio:", error);
    }
  };

  // ✅ Debounce para no spamear el backend
  const debouncedSave = useCallback(debounce(saveChange, 800), []);

  // ✅ Manejar cambios en los inputs
  const handleChange = (id, field, value) => {
    // 1️⃣ Actualiza el estado local
    setTours((prevTours) =>
      prevTours.map((tour) =>
        tour.id === id ? { ...tour, [field]: value } : tour
      )
    );

    // 2️⃣ Envía el cambio al backend después de 800ms sin escribir
    debouncedSave(id, { [field]: value });
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">Cargando tours...</div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        ✈️ Grilla Editable en Tiempo Real (Auto Save)
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
            </tr>
          </thead>

          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id} className="hover:bg-gray-50">
                <td className="border p-2">
                  <input
                    type="text"
                    value={tour.variant || ""}
                    onChange={(e) =>
                      handleChange(tour.id, "variant", e.target.value)
                    }
                    className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={tour.master_tour || ""}
                    onChange={(e) =>
                      handleChange(tour.id, "master_tour", e.target.value)
                    }
                    className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={tour.description || ""}
                    onChange={(e) =>
                      handleChange(tour.id, "description", e.target.value)
                    }
                    className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={tour.inclusions || ""}
                    onChange={(e) =>
                      handleChange(tour.id, "inclusions", e.target.value)
                    }
                    className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={tour.distribution || ""}
                    onChange={(e) =>
                      handleChange(tour.id, "distribution", e.target.value)
                    }
                    className="border rounded p-1 w-full focus:ring focus:ring-blue-300"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditableTourAutoSave;
