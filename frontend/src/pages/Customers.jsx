import { useEffect, useState } from "react";
import api from "../services/api";
import CustomerForm from "../components/CustomerForm";
import CustomerTable from "../components/CustomerTable";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const isArchivedView = viewMode === "archived";

  const fetchCustomers = async (query = search, mode = viewMode) => {
    setLoading(true);
    setError("");
    try {
      const params = { archived: mode === "archived" };
      if (query) params.search = query;
      const response = await api.get("/customers", { params });
      setCustomers(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    const response = await api.get("/plans");
    setPlans(response.data.data);
  };

  useEffect(() => {
    fetchPlans();
    fetchCustomers("", "active");
  }, []);

  useEffect(() => {
    fetchCustomers(search, viewMode);
  }, [viewMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(search, viewMode);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSave = async (formData) => {
    setActionLoading(true);
    setError("");
    try {
      let planName = formData.internet_plan;

      if (formData.planMode === "custom") {
        const customName = formData.customPlan.trim();
        const existing = plans.find(
          (p) => p.name.toLowerCase() === customName.toLowerCase(),
        );
        if (!existing) {
          const planRes = await api.post("/plans", { name: customName });
          setPlans((prev) => [...prev, planRes.data.data]);
        }
        planName = customName;
      }

      const payload = {
        full_name: formData.full_name.trim(),
        contact_number: formData.contact_number.trim(),
        address: formData.address.trim(),
        internet_plan: planName,
        status: formData.status,
      };

      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, payload);
      } else {
        await api.post("/customers", payload);
      }

      setShowForm(false);
      setEditingCustomer(null);
      await fetchCustomers(search, viewMode);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save customer");
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!archiveTarget) return;
    setActionLoading(true);
    setError("");
    try {
      await api.delete(`/customers/${archiveTarget.id}`);
      setArchiveTarget(null);
      await fetchCustomers(search, viewMode);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to archive customer");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreTarget) return;
    setActionLoading(true);
    setError("");
    try {
      await api.patch(`/customers/${restoreTarget.id}/restore`);
      setRestoreTarget(null);
      await fetchCustomers(search, viewMode);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to restore customer");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>Manage active and archived customers</p>
        </div>
        {!isArchivedView && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditingCustomer(null);
              setShowForm(true);
            }}
          >
            Add Customer
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="customer-view-tabs">
          <button
            type="button"
            className={`dashboard-tab ${!isArchivedView ? "active" : ""}`}
            onClick={() => setViewMode("active")}
          >
            Active Customers
          </button>
          <button
            type="button"
            className={`dashboard-tab ${isArchivedView ? "active" : ""}`}
            onClick={() => setViewMode("archived")}
          >
            Archived Customers
          </button>
        </div>

        <div className="search-bar">
          <input
            type="search"
            placeholder="Search by name, contact, address, or plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="page-loading">Loading customers...</div>
        ) : (
          <CustomerTable
            customers={customers}
            isArchivedView={isArchivedView}
            onEdit={(customer) => {
              setEditingCustomer(customer);
              setShowForm(true);
            }}
            onArchive={setArchiveTarget}
            onRestore={setRestoreTarget}
          />
        )}
      </div>

      {showForm && !isArchivedView && (
        <div
          className="modal-overlay"
          onClick={() => !actionLoading && setShowForm(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCustomer ? "Edit Customer" : "Add Customer"}</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowForm(false)}
                disabled={actionLoading}
              >
                &times;
              </button>
            </div>
            <CustomerForm
              plans={plans}
              initialData={editingCustomer}
              loading={actionLoading}
              onSubmit={handleSave}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {archiveTarget && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <h2>Archive Customer</h2>
            <p>
              Archive <strong>{archiveTarget.full_name}</strong>? You can
              restore this customer later.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setArchiveTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleArchive}
                disabled={actionLoading}
              >
                {actionLoading ? "Archiving..." : "Archive"}
              </button>
            </div>
          </div>
        </div>
      )}

      {restoreTarget && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <h2>Restore Customer</h2>
            <p>
              Restore <strong>{restoreTarget.full_name}</strong> to active
              customers?
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setRestoreTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRestore}
                disabled={actionLoading}
              >
                {actionLoading ? "Restoring..." : "Restore"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
