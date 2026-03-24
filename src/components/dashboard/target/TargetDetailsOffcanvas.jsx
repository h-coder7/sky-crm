"use client";

import { useEffect, useState } from "react";

export default function TargetDetailsOffcanvas({ show, target, onClose }) {
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
        id="targetDetailsOffcanvas"
        aria-labelledby="targetDetailsOffcanvasLabel"
        style={{ visibility: show ? "visible" : "hidden", width: "400px" }}
      >
        <div className="offcanvas-header border-bottom py-3">
          <h5 className="offcanvas-title fsz-16" id="targetDetailsOffcanvasLabel">
            <i className="fal fa-bullseye-arrow me-2"></i> Target Details
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body p-4 custom-scroll">
          {target ? (
            <div className="target-details">
              <div className="text-center mb-4">
                <div className="icon-60 rounded-circle border mx-auto mb-3 bg-light d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                  <i className="fas fa-user-chart fa-2x text-muted"></i>
                </div>
                <h6 className="fsz-18 mb-1">{target.employee}</h6>
                <span className="badge bg-light text-dark border fsz-11 text-uppercase">Sales Target</span>
              </div>

              <div className="details-list mb-4">
                <div className="row g-3">
                  <div className="col-12">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Employee</label>
                      <div className="fsz-14 fw-500">{target.employee}</div>
                    </div>
                  </div>

                  <div className="col-12 pt-2 border-top">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Product</label>
                      <div className="fsz-14 fw-500">{target.product}</div>
                    </div>
                  </div>

                  <div className="col-6 pt-2 border-top">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Year</label>
                      <div className="fsz-14 fw-500">{target.year}</div>
                    </div>
                  </div>

                  <div className="col-6 pt-2 border-top">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Length</label>
                      <div className="fsz-14 fw-500">{target.length}</div>
                    </div>
                  </div>

                  <div className="col-12 pt-2 border-top">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Target Values</label>
                      <div className="fsz-16 fw-600">{target.values}</div>
                    </div>
                  </div>

                  <div className="col-12 pt-3 border-top">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Created On</label>
                      <div className="fsz-13">
                        <i className="fal fa-calendar-alt me-2"></i>
                        {target.created_at ? new Date(target.created_at).toLocaleDateString() : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">System ID</label>
                      <div className="fsz-12 text-muted">{target.id}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="fal fa-spinner fa-spin fa-2x mb-3"></i>
              <p>Loading target details...</p>
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
