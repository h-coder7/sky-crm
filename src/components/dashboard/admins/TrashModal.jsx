"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { confirmAction } from "@/utils/confirm";

export default function TrashModal({
  show,
  trashAdmins = [],
  onClose,
  onRestore,
  onPermanentDelete,
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!show || !isMounted) return null;

  return createPortal(
    <>
      <div 
        className="modal-backdrop fade show" 
        style={{ zIndex: 1060 }}
        onClick={onClose}
      ></div>
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        style={{ zIndex: 1061 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
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
                             <span className={`alert rounded-pill py-1 px-3 fsz-12 border-0 mb-0 ${
                                    admin.role === 'Super Admin' ? 'alert-danger' : 
                                    admin.role === 'Admin' ? 'alert-primary' : 
                                    admin.role === 'Sub Admin' ? 'alert-info' : 'alert-secondary'
                                }`}>
                                    {admin.role}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-success me-2"
                              onClick={() => onRestore(admin.id)}
                              title="Restore"
                            >
                              <i className="fal fa-trash-undo"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
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
                              <i className="fal fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
