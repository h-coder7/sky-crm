"use client";
import { confirmAction } from "@/utils/confirm";

export default function TrashModal({
  show,
  trashAdmins = [],
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
            <div className="modal-body">
              {trashAdmins.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fal fa-trash-alt fa-3x mb-3"></i>
                  <p>Trash is empty</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {trashAdmins.map((admin) => (
                        <tr key={admin.id}>
                          <td>
                            <div className="d-flex align-items-center">
                                <img 
                                    src={admin.image || "https://placehold.co/60x60"} 
                                    alt={admin.name}
                                    className="rounded-circle me-2"
                                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                />
                                {admin.name}
                            </div>
                          </td>
                          <td>
                             <span className={`alert rounded-pill py-1 px-3 fsz-12 ms-2 border-0 mb-0 ${
                                    admin.role === 'Super Admin' ? 'alert-danger' : 
                                    admin.role === 'Admin' ? 'alert-primary' : 'alert-info'
                                }`}>
                                    {admin.role}
                            </span>
                          </td>
                          <td>
                            <button
                              className="butn-st2 butn-md blue-butn py-2 me-2"
                              onClick={() => onRestore(admin.id)}
                              title="Restore"
                            >
                              <i className="fal fa-trash-undo"></i> Restore
                            </button>
                            <button
                              className="butn-st2 butn-md bg-danger py-2 px-3"
                              onClick={() => {
                                confirmAction({
                                  title: "Delete Permanently?",
                                  message: "This action cannot be undone. Are you sure?",
                                  confirmLabel: "Delete Forever",
                                  onConfirm: () => onPermanentDelete(admin.id),
                                });
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
            {/* <div className="modal-footer">
              <button
                type="button"
                className="butn-st2 butn-md line-butn"
                onClick={onClose}
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
