"use client";

export default function TrashModal({
  show,
  trashCategories = [],
  onClose,
  onRestore,
  onPermanentDelete,
}) {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Recycle Bin</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body p-0">
              {trashCategories.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fal fa-trash-alt fa-3x mb-3"></i>
                  <p>Trash is empty</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trashCategories.map((cat) => (
                        <tr key={cat.id}>
                          <td>{cat.title}</td>
                          <td>{cat.start_price}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => onRestore(cat.id)}
                              title="Restore"
                            >
                              <i className="fal fa-trash-undo"></i> Restore
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Delete permanently? This action cannot be undone."
                                  )
                                ) {
                                  onPermanentDelete(cat.id);
                                }
                              }}
                              title="Delete Permanently"
                            >
                              <i className="fal fa-times"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
