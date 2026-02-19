"use client";

import { useEffect, useState } from "react";

export default function SectorDetailsOffcanvas({ show, sector, onClose }) {
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
                id="sectorDetailsOffcanvas"
                aria-labelledby="sectorDetailsOffcanvasLabel"
                style={{ visibility: show ? "visible" : "hidden" }}
            >
                <div className="offcanvas-header border-bottom py-3">
                    <h5 className="offcanvas-title fsz-16" id="sectorDetailsOffcanvasLabel">
                        <i className="fal fa-layer-group me-2"></i> Sector Details
                    </h5>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body p-4 custom-scroll">
                    {sector ? (
                        <div className="sector-details">
                            <div className="details-list mb-4 d-flex flex-wrap gap-2">
                                <div className="detail-item">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Title</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-tag me-2"></i>
                                        {sector.title}
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Created On</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-calendar-alt me-2"></i>
                                        {sector.created_at || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item w-100">
                                    <label className="text-muted fsz-11 text-uppercase d-block mb-1">Description</label>
                                    <div className="fsz-12 pt-2 mt-2 border-top cr-777">
                                        {sector.description || "No description provided."}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <i className="fal fa-spinner fa-spin fa-2x mb-3"></i>
                            <p>Loading sector details...</p>
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
