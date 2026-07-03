import { useEffect, useState } from 'react';

const emptyForm = {
  full_name: '',
  contact_number: '',
  address: '',
  planMode: 'predefined',
  internet_plan: '',
  customPlan: '',
  status: 'active',
};

function CustomerForm({ plans, initialData, loading, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const isPredefined = plans.some((p) => p.name === initialData.internet_plan);
      setForm({
        full_name: initialData.full_name || '',
        contact_number: initialData.contact_number || '',
        address: initialData.address || '',
        planMode: isPredefined ? 'predefined' : 'custom',
        internet_plan: isPredefined ? initialData.internet_plan : '',
        customPlan: isPredefined ? '' : initialData.internet_plan,
        status: initialData.status || 'active',
      });
    } else {
      setForm({
        ...emptyForm,
        internet_plan: plans[0]?.name || '',
      });
    }
    setErrors({});
  }, [initialData, plans]);

  const validate = () => {
    const nextErrors = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2) {
      nextErrors.full_name = 'Full name must be at least 2 characters';
    }
    if (!form.contact_number.trim() || !/^[0-9+\-\s()]{7,20}$/.test(form.contact_number.trim())) {
      nextErrors.contact_number = 'Enter a valid contact number';
    }
    if (!form.address.trim() || form.address.trim().length < 5) {
      nextErrors.address = 'Address must be at least 5 characters';
    }
    if (form.planMode === 'predefined' && !form.internet_plan) {
      nextErrors.internet_plan = 'Select an internet plan';
    }
    if (form.planMode === 'custom' && (!form.customPlan.trim() || form.customPlan.trim().length < 2)) {
      nextErrors.customPlan = 'Enter a custom plan name';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="full_name">Full Name *</label>
        <input
          id="full_name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        />
        {errors.full_name && <span className="field-error">{errors.full_name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="contact_number">Contact Number *</label>
        <input
          id="contact_number"
          value={form.contact_number}
          onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
          placeholder="09171234567"
        />
        {errors.contact_number && <span className="field-error">{errors.contact_number}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="address">Address *</label>
        <textarea
          id="address"
          rows="3"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        {errors.address && <span className="field-error">{errors.address}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="planMode">Internet Plan *</label>
        <select
          id="planMode"
          value={form.planMode}
          onChange={(e) => setForm({ ...form, planMode: e.target.value })}
        >
          <option value="predefined">Predefined plan</option>
          <option value="custom">Custom plan</option>
        </select>
      </div>

      {form.planMode === 'predefined' ? (
        <div className="form-group">
          <label htmlFor="internet_plan">Select Plan</label>
          <select
            id="internet_plan"
            value={form.internet_plan}
            onChange={(e) => setForm({ ...form, internet_plan: e.target.value })}
          >
            <option value="">Choose a plan</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.name}>
                {plan.name}
              </option>
            ))}
          </select>
          {errors.internet_plan && <span className="field-error">{errors.internet_plan}</span>}
        </div>
      ) : (
        <div className="form-group">
          <label htmlFor="customPlan">Custom Plan Name</label>
          <input
            id="customPlan"
            value={form.customPlan}
            onChange={(e) => setForm({ ...form, customPlan: e.target.value })}
            placeholder="e.g. Family 75Mbps"
          />
          {errors.customPlan && <span className="field-error">{errors.customPlan}</span>}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="status">Status *</label>
        <select
          id="status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Customer' : 'Add Customer'}
        </button>
      </div>
    </form>
  );
}

export default CustomerForm;
