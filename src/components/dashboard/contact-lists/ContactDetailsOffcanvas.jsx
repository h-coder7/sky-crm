"use client";

import { useEffect, useState } from "react";

export default function ContactDetailsOffcanvas({ show, contact, onClose }) {
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
                id="contactDetailsOffcanvas"
                aria-labelledby="contactDetailsOffcanvasLabel"
                style={{ visibility: show ? "visible" : "hidden", width: "450px" }}
            >
                <div className="offcanvas-header border-bottom py-3">
                    <h5 className="offcanvas-title fsz-16" id="contactDetailsOffcanvasLabel">
                        <i className="fal fa-address-card me-2"></i> Contact Details
                    </h5>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body p-4 custom-scroll">
                    {contact ? (
                        <div className="contact-details">
                            {/* Identity Section */}
                            <div className="details-list mb-4 d-flex flex-wrap gap-2">
                                <div className="detail-item d-flex align-items-center w-100">
                                    <div className="icon-50 p-1 rounded-circle border bg-white me-3 overflow-hidden">
                                        <img
                                            src={contact.image || "/crm-skybridge/images/fav.png"}
                                            alt={contact.name}
                                            className="img-contain h-100 w-100 rounded-circle"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-muted fsz-11 text-uppercase d-block mb-0">Profile</label>
                                        <div className="fsz-13 fw-600">{contact.name}</div>
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <label className="text-muted fsz-12 text-uppercase d-block mb-2">Position / Role</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-user-chart me-2"></i>
                                        {contact.job_title || "No job title"} at {contact.company || "No company"}
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <label className="text-muted fsz-12 text-uppercase d-block mb-2">Gender</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-venus-mars me-2 "></i>
                                        {contact.gender || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <label className="text-muted fsz-12 text-uppercase d-block mb-2">Added On</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-calendar-alt me-2 "></i>
                                        {contact.created_at || "N/A"}
                                    </div>
                                </div>
                            </div>

                            {/* Engagement Section */}
                            <div className="detail-group mb-4">
                                <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Engagement</h6>
                                <div className="details-list d-flex flex-wrap gap-2">
                                    <div className="detail-item">
                                        <label className="text-muted fsz-12 text-uppercase d-block mb-2">Assigned Employee</label>
                                        <div className="fsz-13">
                                            <i className="fal fa-user-chart me-2"></i>
                                            {contact.employee || "Unassigned"}
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <label className="text-muted fsz-12 text-uppercase d-block mb-2">Status</label>
                                        <div className="fsz-13">
                                            <span className={`alert rounded-pill py-1 px-3 fsz-11 border-0 mb-0 ${contact.status === 'Active' ? 'alert-success' : 'alert-warning'}`}>
                                                {contact.status || "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <label className="text-muted fsz-12 text-uppercase d-block mb-2">Top Customer</label>
                                        <div className="fsz-13">
                                            <span className={`alert rounded-pill py-1 px-3 fsz-11 border-0 mb-0 ${contact.top_customer ? 'alert-success' : 'alert-danger'}`}>
                                                {contact.top_customer ? "Yes" : "No"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <label className="text-muted fsz-12 text-uppercase d-block mb-2">D.M. Status</label>
                                        <div className="fsz-13">
                                            <span className={`alert rounded-pill py-1 px-3 fsz-11 border-0 mb-0 ${contact.decision_maker_status ? 'alert-success' : 'alert-danger'}`}>
                                                {contact.decision_maker_status ? "Yes" : "No"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics Section */}
                            <div className="detail-group mb-4">
                                <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Performance Metrics</h6>
                                <div className="details-list d-flex flex-wrap gap-2">
                                    <div className="detail-item">
                                        <label className="text-muted fsz-12 text-uppercase d-block mb-2">Budget</label>
                                        <div className="fsz-13 fw-600 text-success">{contact.budget || "0"}</div>
                                    </div>
                                    <div className="detail-item">
                                        <label className="text-muted fsz-12 text-uppercase d-block mb-2">Events/Yr</label>
                                        <div className="fsz-13">{contact.avg_events_year || "0"}</div>
                                    </div>
                                    <div className="detail-item">
                                        <label className="text-muted fsz-12 text-uppercase d-block mb-2">Stands/Yr</label>
                                        <div className="fsz-13">{contact.avg_stands_year || "0"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info Section */}
                            <div className="detail-group mb-4">
                                <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Contact Info</h6>
                                <div className="details-list d-flex flex-wrap gap-2">
                                    <div className="detail-item w-100">
                                        <label className="text-muted fsz-12 text-uppercase d-block mb-2">Email Address</label>
                                        <div className="fsz-13">
                                            <i className="fal fa-envelope me-2"></i>
                                            {contact.email || "N/A"}
                                        </div>
                                    </div>
                                    <div className="detail-item w-100">
                                        <label className="text-muted fsz-12 text-uppercase d-block mb-2">Phone Numbers</label>
                                        <div className="d-flex flex-wrap gap-1">
                                            {contact.phones?.length > 0 ? contact.phones.map((p, i) => (
                                                <span key={i} className="bg-white text-dark border fsz-11 py-1 px-2 rounded-pill"><i className="fal fa-mobile me-1"></i> {p}</span>
                                            )) : <span className="fsz-12 text-muted">N/A</span>}
                                        </div>
                                    </div>
                                    <div className="detail-item w-100">
                                        <label className="text-muted fsz-12 text-uppercase d-block mb-2">Landlines</label>
                                        <div className="d-flex flex-wrap gap-1">
                                            {contact.landlines?.length > 0 ? contact.landlines.map((p, i) => (
                                                <span key={i} className="bg-white text-dark border fsz-11 py-1 px-2 rounded-pill"><i className="fal fa-phone-alt me-1"></i> {p}</span>
                                            )) : <span className="fsz-12 text-muted">N/A</span>}
                                        </div>
                                    </div>
                                    <div className="detail-item w-100">
                                        <label className="text-muted fsz-12 text-uppercase d-block mb-2">Location</label>
                                        <div className="fsz-13">
                                            <i className="fal fa-globe me-2"></i>
                                            {contact.country || "No country"}
                                            <div className="mt-1 ps-4 text-muted small">{contact.address || "No address provided"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Web Presence Section */}
                            <div className="detail-group mb-4">
                                <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Web & Social</h6>
                                <div className="details-list d-flex flex-wrap gap-2">
                                    <div className="detail-item w-100">
                                        <label className="text-muted fsz-12 text-uppercase d-block mb-2">Website</label>
                                        <div className="fsz-13">
                                            <i className="fal fa-browser me-2 text-muted"></i>
                                            {contact.company_website_url ? (
                                                <a href={contact.company_website_url} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary">
                                                    {contact.company_website_url}
                                                </a>
                                            ) : "N/A"}
                                        </div>
                                    </div>
                                    <div className="detail-item w-100">
                                        <label className="text-muted fsz-12 text-uppercase d-block mb-2">Social Links</label>
                                        <div className="d-flex flex-wrap gap-1">
                                            {contact.social_links?.length > 0 ? contact.social_links.map((link, i) => (
                                                <span key={i} className="bg-white text-dark border fsz-11 py-1 px-2 rounded-pill">
                                                    <i className="fal fa-share-alt me-1"></i>
                                                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark">{link}</a>
                                                </span>
                                            )) : <span className="fsz-12 text-muted">N/A</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Remarks Section */}
                            <div className="detail-group">
                                <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Remarks</h6>
                                <div className="p-3 bg-light rounded-3 border fsz-12 cr-666">
                                    {contact.notes || "No additional notes."}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <i className="fal fa-spinner fa-spin fa-2x mb-3 text-primary"></i>
                            <p className="fsz-12">Fetching contact records...</p>
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
