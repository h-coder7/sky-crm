"use client";

import { useEffect, useState } from "react";

export default function AdminDetailsOffcanvas({ show, admin, onClose }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <div
                className={`offcanvas offcanvas-end border-0 shadow ${show ? "show" : ""}`}
                tabIndex="-1"
                id="adminDetailsOffcanvas"
                aria-labelledby="adminDetailsOffcanvasLabel"
                style={{ visibility: show ? "visible" : "hidden" }}
            >
                <div className="offcanvas-header border-bottom py-3">
                    <h5 className="offcanvas-title fw-600 fsz-16" id="adminDetailsOffcanvasLabel">
                        <i className="fal fa-user-tie me-2 text-primary"></i> Admin Details
                    </h5>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body p-4">
                    {admin ? (
                        <div className="admin-details">
                            <div className="text-center mb-4">
                                <div className="icon-80 p-1 rounded-circle border p-1 mx-auto overflow-hidden bg-light mb-3">
                                    <img
                                        src={admin.image || "/crm-skybridge/images/fav.png"}
                                        alt={admin.name}
                                        className="img-contain h-100 w-100 rounded-circle"
                                    />
                                </div>
                                <h6 className="fw-700 fsz-18 mb-1">{admin.name}</h6>
                                <span className={`alert rounded-pill py-1 px-3 fsz-12 border-0 mb-0 ${admin.role === 'Super Admin' ? 'alert-danger' : admin.role === 'Admin' ? 'alert-primary' : admin.role === 'Sub Admin' ? 'alert-info' : 'alert-secondary'}`}>
                                    {admin.role}
                                </span>
                            </div>

                            <div className="details-list">
                                <div className="detail-item mb-4 border-bottom pb-3">
                                    <label className="text-muted fsz-12 text-uppercase fw-600 d-block mb-1">Email</label>
                                    <div className="fsz-14 fw-500">
                                        <i className="fal fa-envelope me-2 text-primary"></i>
                                        {admin.email || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item mb-4 border-bottom pb-3">
                                    <label className="text-muted fsz-12 text-uppercase fw-600 d-block mb-1">Phone</label>
                                    <div className="fsz-14 fw-500">
                                        <i className="fal fa-phone me-2 text-primary"></i>
                                        {admin.phone || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item mb-4 border-bottom pb-3">
                                    <label className="text-muted fsz-12 text-uppercase fw-600 d-block mb-1">Created At</label>
                                    <div className="fsz-14 fw-500">
                                        <i className="fal fa-calendar-alt me-2 text-primary"></i>
                                        {admin.created_at || "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <i className="fal fa-spinner fa-spin fa-2x mb-3"></i>
                            <p>Loading admin details...</p>
                        </div>
                    )}
                </div>
            </div>
            {show && (
                <div
                    className="offcanvas-backdrop fade show"
                    onClick={onClose}
                ></div>
            )}
        </>
    );
}
