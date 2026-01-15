"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { confirmAction } from "@/utils/confirm";

export default function TrashModal({ show, onClose, trashEmployees, onRestore, onPermanentDelete }) {
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
                            <h5 className="modal-title">Employees Trash Can</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            ></button>
                        </div>
                        <div className="modal-body p-0">
                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trashEmployees.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4 text-muted">
                                                    Trash is empty
                                                </td>
                                            </tr>
                                        ) : (
                                            trashEmployees.map((emp) => (
                                                <tr key={emp.id}>
                                                    <td>{emp.name}</td>
                                                    <td>{emp.email}</td>
                                                    <td>
                                                        {(() => {
                                                            const getRoleBadgeClass = (role) => {
                                                                switch (role) {
                                                                    case "Head Department": return "alert-warning";
                                                                    case "Senior Business Development Manager": return "alert-success";
                                                                    case "Business Development Manager": return "alert-secondary";
                                                                    case "Senior Business Development Executive": return "role-purple";
                                                                    case "Business Development Executive": return "role-teal";
                                                                    default: return "alert-primary";
                                                                }
                                                            };
                                                            return (
                                                                <span className={`alert rounded-pill py-1 px-3 fsz-10 border-0 mb-0 ${getRoleBadgeClass(emp.role)}`}>
                                                                    {emp.role}
                                                                </span>
                                                            );
                                                        })()}
                                                    </td>
                                                    <td className="text-end">
                                                        <button 
                                                            className="btn btn-sm btn-outline-success me-2"
                                                            onClick={() => onRestore(emp.id)}
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
                                                                    onConfirm: () => onPermanentDelete(emp.id),
                                                                });
                                                            }}
                                                            title="Delete Permanently"
                                                        >
                                                            <i className="fal fa-trash-alt"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="butn-st2 butn-md line-butn"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
