"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { confirmAction } from "@/utils/confirm";

export default function TrashModal({
  show,
  trashCategories = [],
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
              {trashCategories.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fal fa-trash-alt fa-3x mb-3"></i>
                  <p>Trash is empty</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
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
                              className="btn btn-sm btn-outline-success me-2"
                              onClick={() => onRestore(cat.id)}
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
                                  onConfirm: () => onPermanentDelete(cat.id),
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
    </>,
    document.body
  );
}
