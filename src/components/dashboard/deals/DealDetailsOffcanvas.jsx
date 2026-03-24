"use client";

import { useEffect, useState } from "react";

const STATUS_MAP = {
    "1": "Brief Submitted",
    "2": "Amending Brief",
    "3": "Moodboard Requested",
    "4": "Moodboard Submitted",
    "5": "Amending Moodboard",
    "6": "3D Render Requested",
    "7": "Proposal Submitted",
    "8": "Amending Proposal",
    "9": "Quotation Requested",
    "10": "Quotation Submitted",
    "11": "Confirmed",
    "12": "Rejected",
    "13": "Payment Received"
};

export default function DealDetailsOffcanvas({ show, deal, onClose }) {
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
                id="dealDetailsOffcanvas"
                aria-labelledby="dealDetailsOffcanvasLabel"
                style={{ visibility: show ? "visible" : "hidden", width: "450px" }}
            >
                <div className="offcanvas-header border-bottom py-3">
                    <h5 className="offcanvas-title fsz-16" id="dealDetailsOffcanvasLabel">
                        <i className="fal fa-check-circle me-2"></i> Deal Details
                    </h5>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body p-4 custom-scroll">
                    {deal ? (
                        <div className="deal-details">
                            <div className="details-list mb-4 d-flex flex-wrap gap-4">
                                <div className="detail-item w-100 mb-2">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Title</label>
                                    <div className="fsz-14 fw-600">
                                        <i className="fal fa-tag me-2"></i>
                                        {deal.title}
                                    </div>
                                </div>

                                <div className="detail-item col-5">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Sector</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-layer-group me-2"></i>
                                        {deal.sector || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item col-5">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Company</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-building me-2"></i>
                                        {deal.company || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item col-5">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Contact List</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-address-book me-2"></i>
                                        {deal.contact_list || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item col-5">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Employee</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-user me-2"></i>
                                        {deal.employee || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item col-5">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Product</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-box me-2"></i>
                                        {deal.product || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item col-5">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Amount</label>
                                    <div className="fsz-13 fw-600 text-success">
                                        <i className="fal fa-money-bill-wave me-2"></i>
                                        {deal.amount || "0"}
                                    </div>
                                </div>

                                <div className="detail-item col-5">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Status</label>
                                    <div className="fsz-12">
                                        <span className="badge bg-light text-dark border">
                                            {STATUS_MAP[deal.status] || deal.status || "N/A"}
                                        </span>
                                    </div>
                                </div>

                                <div className="detail-item col-5">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Payment Status</label>
                                    <div className="fsz-12">
                                        <span className={`badge ${deal.payment_status === 'Paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} border`}>
                                            {deal.payment_status || "Pending"}
                                        </span>
                                    </div>
                                </div>

                                <div className="detail-item col-5">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Start Date</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-calendar-plus me-2"></i>
                                        {deal.start_date || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item col-5">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">End Date</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-calendar-check me-2"></i>
                                        {deal.end_date || "N/A"}
                                    </div>
                                </div>

                                {deal.file_url && (
                                    <div className="detail-item w-100">
                                        <label className="text-muted fsz-11 text-uppercase d-block mb-1">File URL</label>
                                        <div className="fsz-13">
                                            <i className="fal fa-link me-2"></i>
                                            <a href={deal.file_url} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">
                                                View Attachment
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="detail-item w-100">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Description</label>
                                    <div className="fsz-12 pt-2 mt-1 border-top cr-777" style={{ whiteSpace: "pre-wrap" }}>
                                        {deal.description || "No description provided."}
                                    </div>
                                </div>

                                <div className="detail-item w-100">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Created On</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-clock me-2"></i>
                                        {deal.created_at || "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <i className="fal fa-spinner fa-spin fa-2x mb-3"></i>
                            <p>Loading deal details...</p>
                        </div>
                    )}
                </div>
            </div>
            {show && (
                <div
                    className="offcanvas-backdrop fade show"
                    onClick={onClose}
                    style={{ zIndex: 1040 }}
                ></div>
            )}
        </>
    );
}
