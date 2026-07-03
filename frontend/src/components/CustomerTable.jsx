function CustomerTable({ customers, isArchivedView, onEdit, onArchive, onRestore }) {
  if (customers.length === 0) {
    return <p className="empty-state">No customers found.</p>;
  }

  return (
    <>
      <div className="table-wrapper desktop-only">
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Internet Plan</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.full_name}</td>
                <td>{customer.contact_number}</td>
                <td>{customer.address}</td>
                <td>{customer.internet_plan}</td>
                <td>
                  <span className={`badge badge-${customer.status}`}>{customer.status}</span>
                </td>
                <td className="actions-cell">
                  {isArchivedView ? (
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => onRestore(customer)}>
                      Restore
                    </button>
                  ) : (
                    <>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => onEdit(customer)}>
                        Edit
                      </button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => onArchive(customer)}>
                        Archive
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="customer-cards mobile-only">
        {customers.map((customer) => (
          <div key={customer.id} className="customer-card">
            <div className="customer-card-header">
              <h3>{customer.full_name}</h3>
              <span className={`badge badge-${customer.status}`}>{customer.status}</span>
            </div>
            <p><strong>Contact:</strong> {customer.contact_number}</p>
            <p><strong>Address:</strong> {customer.address}</p>
            <p><strong>Plan:</strong> {customer.internet_plan}</p>
            <div className="customer-card-actions">
              {isArchivedView ? (
                <button type="button" className="btn btn-primary btn-sm" onClick={() => onRestore(customer)}>
                  Restore
                </button>
              ) : (
                <>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => onEdit(customer)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => onArchive(customer)}>
                    Archive
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default CustomerTable;
