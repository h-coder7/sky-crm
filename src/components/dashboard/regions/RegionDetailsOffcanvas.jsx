"use client";

import { useEffect, useState } from "react";

export default function RegionDetailsOffcanvas({ show, region, onClose }) {
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
        id="regionDetailsOffcanvas"
        aria-labelledby="regionDetailsOffcanvasLabel"
        style={{ visibility: show ? "visible" : "hidden", width: "400px" }}
      >
        <div className="offcanvas-header border-bottom py-3">
          <h5 className="offcanvas-title fsz-16" id="regionDetailsOffcanvasLabel">
            <i className="fal fa-map-location-dot me-2"></i> Region Details
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body p-4 custom-scroll">
          {region ? (
            <div className="region-details">
              <div className="text-center mb-4">
                <div className="icon-60 rounded-circle border mx-auto mb-3 bg-light d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                  <i className="fas fa-map-marker-alt fa-2x text-muted"></i>
                </div>
                <h6 className="fsz-18 mb-1">{region.title}</h6>
                <span className="badge bg-primary-soft text-primary border border-primary-soft fsz-11 text-uppercase">{region.country}</span>
              </div>

              <div className="details-list mb-4">
                <div className="detail-item mb-3">
                  <label className="text-muted fsz-11 text-uppercase d-block mb-1">Region Title</label>
                  <div className="fsz-14 fw-600">{region.title}</div>
                </div>
                <div className="detail-item mb-3">
                  <label className="text-muted fsz-11 text-uppercase d-block mb-1">Country</label>
                  <div className="fsz-14 fw-500">{region.country}</div>
                </div>
                <div className="detail-item mb-3">
                  <label className="text-muted fsz-11 text-uppercase d-block mb-1">Added On</label>
                  <div className="fsz-14 fw-500">
                    {region.created_at ? new Date(region.created_at).toLocaleDateString() : "N/A"}
                  </div>
                </div>
                <div className="detail-item mb-3">
                   <label className="text-muted fsz-11 text-uppercase d-block mb-1">System ID</label>
                   <div className="fsz-12 text-muted text-break">{region.id}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="fal fa-spinner fa-spin fa-2x mb-3"></i>
              <p>Loading region details...</p>
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
