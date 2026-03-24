"use client";

import { useEffect, useState } from "react";

export default function CompanyDetailsOffcanvas({ show, company, onClose }) {
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
                id="companyDetailsOffcanvas"
                aria-labelledby="companyDetailsOffcanvasLabel"
                style={{ visibility: show ? "visible" : "hidden", width: "450px" }}
            >
                <div className="offcanvas-header border-bottom py-3">
                    <h5 className="offcanvas-title fsz-16" id="companyDetailsOffcanvasLabel">
                        <i className="fal fa-building me-2"></i> Company Details
                    </h5>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body p-4 custom-scroll">
                    {company ? (
                        <div className="company-details">
                            <div className="text-center mb-4">
                                <div className="icon-80 p-2 rounded-circle border mx-auto mb-3 overflow-hidden bg-light d-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                                    {company.image ? (
                                        <img src={company.image} alt="" className="img-contain h-100 w-100" />
                                    ) : (
                                        <i className="fas fa-building fa-2x text-muted"></i>
                                    )}
                                </div>
                                <h6 className="fsz-18 mb-1">{company.title}</h6>
                                <span className="badge bg-light text-dark border fsz-11 text-uppercase">{company.sector || "General Sector"}</span>
                            </div>

                            <div className="details-list mb-4 d-flex flex-wrap gap-4">
                                <div className="detail-item col-5">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Country</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-globe-americas me-2"></i>
                                        {company.country || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item col-5">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Region</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-map-marker-alt me-2"></i>
                                        {company.region || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item w-100">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Address</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-map-signs me-2"></i>
                                        {company.address || "N/A"}
                                    </div>
                                </div>

                                {company.domain && (
                                    <div className="detail-item w-100">
                                        <label className="text-muted fsz-11 text-uppercase d-block mb-1">Domain / Website</label>
                                        <div className="fsz-13">
                                            <i className="fal fa-external-link me-2"></i>
                                            <a href={company.domain.startsWith('http') ? company.domain : `https://${company.domain}`} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">
                                                {company.domain}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {company.location && (
                                    <div className="detail-item w-100">
                                        <label className="text-muted fsz-11 text-uppercase d-block mb-1">Location Map</label>
                                        <div className="fsz-13">
                                            <i className="fal fa-map me-2"></i>
                                            <a href={company.location.startsWith('http') ? company.location : `https://www.google.com/maps/search/${encodeURIComponent(company.location)}`} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">
                                                View on Google Maps
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="detail-item w-100">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Description</label>
                                    <div className="fsz-12 pt-2 mt-1 border-top cr-777" style={{ whiteSpace: "pre-wrap" }}>
                                        {company.description || "No description provided."}
                                    </div>
                                </div>

                                <div className="detail-item w-100">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Created On</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-calendar-alt me-2"></i>
                                        {company.created_at ? new Date(company.created_at).toLocaleDateString() : "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <i className="fal fa-spinner fa-spin fa-2x mb-3"></i>
                            <p>Loading company details...</p>
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
