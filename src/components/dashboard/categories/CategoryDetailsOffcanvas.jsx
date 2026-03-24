"use client";

import { useEffect, useState } from "react";

export default function CategoryDetailsOffcanvas({ show, category, onClose }) {
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
        id="categoryDetailsOffcanvas"
        aria-labelledby="categoryDetailsOffcanvasLabel"
        style={{ visibility: show ? "visible" : "hidden", width: "400px" }}
      >
        <div className="offcanvas-header border-bottom py-3">
          <h5 className="offcanvas-title fsz-16" id="categoryDetailsOffcanvasLabel">
            <i className="fal fa-grid-2 me-2"></i> Category Details
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body p-4 custom-scroll">
          {category ? (
            <div className="category-details">
              <div className="text-center mb-4">
                <div className="icon-60 rounded-circle border mx-auto mb-3 bg-light d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                  <i className="fas fa-layer-group fa-2x text-muted"></i>
                </div>
                <h6 className="fsz-18 mb-1">{category.title}</h6>
                <span className="badge bg-light text-dark border fsz-11 text-uppercase">Price Range Category</span>
              </div>

              <div className="details-list mb-4">
                <div className="detail-item mb-3">
                  <label className="text-muted fsz-11 text-uppercase d-block mb-1">Category Title</label>
                  <div className="fsz-14 fw-500">{category.title}</div>
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Start Price</label>
                      <div className="fsz-14 fw-500 text-success">{category.start_price}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">End Price</label>
                      <div className="fsz-14 fw-500 text-danger">{category.end_price}</div>
                    </div>
                  </div>
                </div>

                <div className="detail-item mb-3 pt-3 border-top">
                  <label className="text-muted fsz-11 text-uppercase d-block mb-1">Added On</label>
                  <div className="fsz-13">
                    <i className="fal fa-calendar-alt me-2"></i>
                    {category.created_at ? new Date(category.created_at).toLocaleDateString() : "N/A"}
                  </div>
                </div>

                <div className="detail-item mb-3 pt-3 border-top">
                  <label className="text-muted fsz-11 text-uppercase d-block mb-1">System ID</label>
                  <div className="fsz-12 text-muted">{category.id}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="fal fa-spinner fa-spin fa-2x mb-3"></i>
              <p>Loading category details...</p>
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
