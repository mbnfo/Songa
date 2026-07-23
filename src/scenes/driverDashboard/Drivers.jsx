import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { logAction } from "@/lib/auditLogger";
import { Plus, Search, Edit2, Trash2, X, Check } from "lucide-react";

function DriverModal({ driver, onClose, onSave }) {
  const [form, setForm] = useState(driver || { full_name: "", email: "", phone: "", vehicle_plate: "", driver_id_external: "", commission_rate: 25, status: "active" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-900">{driver?.id ? "Edit Driver" : "Add Driver"}</h2>
          <button onClick={onClose}><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            ["full_name", "Full Name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "text"],
            ["vehicle_plate", "Vehicle Plate", "text"],
            ["driver_id_external", "External Driver ID", "text"],
          ].map(([key, label, type]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} value={form[key] || ""} onChange={e => set(key, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission %</label>
              <input type="number" min="0" max="100" value={form.commission_rate} onChange={e => set("commission_rate", Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
          <button onClick={() => onSave(form)} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function Drivers() {
  const { currentUser } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "add" | driver object
  const [loading, setLoading] = useState(true);

  const load = () => base44.entities.Driver.list().then(d => { setDrivers(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const canEdit = ["admin", "owner"].includes(currentUser?.role);

  const handleSave = async (form) => {
    if (form.id) {
      await base44.entities.Driver.update(form.id, form);
      await logAction({ action: "UPDATE_DRIVER", entity_type: "Driver", entity_id: form.id, details: `Updated driver ${form.full_name}`, user: currentUser });
    } else {
      const d = await base44.entities.Driver.create(form);
      await logAction({ action: "CREATE_DRIVER", entity_type: "Driver", entity_id: d.id, details: `Created driver ${form.full_name}`, user: currentUser });
    }
    setModal(null);
    load();
  };

  const handleDelete = async (d) => {
    if (!confirm(`Delete driver ${d.full_name}?`)) return;
    await base44.entities.Driver.delete(d.id);
    await logAction({ action: "DELETE_DRIVER", entity_type: "Driver", entity_id: d.id, details: `Deleted driver ${d.full_name}`, user: currentUser });
    load();
  };

  const filtered = drivers.filter(d =>
    d.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
          <p className="text-sm text-gray-500 mt-1">{drivers.length} drivers registered</p>
        </div>
        {canEdit && (
          <button onClick={() => setModal("add")} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Add Driver
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search drivers…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">No drivers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Name</th>
                  <th className="text-left px-6 py-3 font-medium">Email</th>
                  <th className="text-left px-6 py-3 font-medium">Phone</th>
                  <th className="text-left px-6 py-3 font-medium">Plate</th>
                  <th className="text-left px-6 py-3 font-medium">Commission</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  {canEdit && <th className="px-6 py-3" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{d.full_name}</td>
                    <td className="px-6 py-4 text-gray-600">{d.email}</td>
                    <td className="px-6 py-4 text-gray-600">{d.phone || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{d.vehicle_plate || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{d.commission_rate || 25}%</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${d.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {d.status === "active" ? <Check className="w-3 h-3" /> : null}
                        {d.status}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => setModal(d)} className="text-gray-400 hover:text-indigo-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(d)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <DriverModal
          driver={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}