import { useEffect, useState, useMemo } from "react";

export default function ManageItems() {
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    fetch("https://api.siaiapp.com/service", {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Respuesta del backend:", data);
        setServices(data);
      })
      .catch((err) => console.error("Error cargando servicios:", err));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return services;
    const q = query.toLowerCase();
    return services.filter((s) =>
      Object.values(s || {}).some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [services, query]);

  const sorted = useMemo(() => {
    const data = [...filtered];
    data.sort((a, b) => {
      const va = a?.[sortKey];
      const vb = b?.[sortKey];
      if (va == null && vb == null) return 0;
      if (va == null) return sortDir === "asc" ? -1 : 1;
      if (vb == null) return sortDir === "asc" ? 1 : -1;
      const aa = typeof va === "number" ? va : String(va).toLowerCase();
      const bb = typeof vb === "number" ? vb : String(vb).toLowerCase();
      if (aa < bb) return sortDir === "asc" ? -1 : 1;
      if (aa > bb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "code", label: "Code" },
    { key: "name", label: "Name" },
    { key: "city", label: "City" },
    { key: "type", label: "Type" },
    { key: "type_charge", label: "Type Charge" },
    { key: "name_shown", label: "Name Shown" },
    { key: "name_shown_es", label: "Name Shown ES" },
    { key: "name_shown_ge", label: "Name Shown GE" },
    { key: "name_shown_fr", label: "Name Shown FR" },
    { key: "provider", label: "Provider" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Lista de Servicios
      </h1>

      <div className="mb-4 flex justify-end">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar en todos los campos..."
          className="w-72 max-w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border border-gray-200 rounded-lg shadow-md bg-white">
          <thead className="bg-blue-600 text-white">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="cursor-pointer whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hover:text-gray-200"
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    {sortKey === col.key && (
                      sortDir === "asc" ? (
                        <span>▲</span>
                      ) : (
                        <span>▼</span>
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500">
                  Sin resultados
                </td>
              </tr>
            ) : (
              sorted.map((s) => (
                <tr
                  key={s.id}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <Td>{s?.id}</Td>
                  <Td mono>{s?.code}</Td>
                  <Td strong>{s?.name}</Td>
                  <Td>{s?.city}</Td>
                  <Td><Badge>{s?.type}</Badge></Td>
                  <Td><Badge muted>{s?.type_charge}</Badge></Td>
                  <Td>{s?.name_shown}</Td>
                  <Td>{s?.name_shown_es}</Td>
                  <Td>{s?.name_shown_ge}</Td>
                  <Td>{s?.name_shown_fr}</Td>
                  <Td>{s?.provider}</Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Td({ children, strong = false, mono = false }) {
  return (
    <td className={`whitespace-nowrap px-4 py-3 text-sm text-gray-700 ${
      strong ? "font-medium" : ""
    } ${mono ? "font-mono" : ""}`}>
      {children ?? "—"}
    </td>
  );
}

function Badge({ children, muted = false }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
        muted ? "bg-gray-100 text-gray-700" : "bg-blue-100 text-blue-700"
      }`}
    >
      {children ?? "—"}
    </span>
  );
}
