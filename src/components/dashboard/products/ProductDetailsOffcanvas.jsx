"use client";

import { useEffect, useState } from "react";

export default function ProductDetailsOffcanvas({ show, product, onClose }) {
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
        id="productDetailsOffcanvas"
        aria-labelledby="productDetailsOffcanvasLabel"
        style={{ visibility: show ? "visible" : "hidden", width: "400px" }}
      >
        <div className="offcanvas-header border-bottom py-3">
          <h5 className="offcanvas-title fsz-16" id="productDetailsOffcanvasLabel">
            <i className="fal fa-box me-2"></i> Product Details
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body p-4 custom-scroll">
          {product ? (
            <div className="product-details">
              <div className="text-center mb-4">
                <div className="icon-60 rounded-circle border mx-auto mb-3 bg-light d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                  <i className="fas fa-box fa-2x text-muted"></i>
                </div>
                <h6 className="fsz-18 mb-1">{product.title}</h6>
                <span className="badge bg-light text-dark border fsz-11 text-uppercase">Internal Product</span>
              </div>

              <div className="details-list mb-4">
                <div className="detail-item mb-3">
                  <label className="text-muted fsz-11 text-uppercase d-block mb-1">Product Title</label>
                  <div className="fsz-14 fw-500">{product.title}</div>
                </div>

                <div className="detail-item mb-3">
                  <label className="text-muted fsz-11 text-uppercase d-block mb-1">Added On</label>
                  <div className="fsz-13">
                    <i className="fal fa-calendar-alt me-2"></i>
                    {product.created_at ? new Date(product.created_at).toLocaleDateString() : "N/A"}
                  </div>
                </div>

                <div className="detail-item mb-3 pt-3 border-top">
                  <label className="text-muted fsz-11 text-uppercase d-block mb-1">System ID</label>
                  <div className="fsz-12 text-muted">{product.id}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="fal fa-spinner fa-spin fa-2x mb-3"></i>
              <p>Loading product details...</p>
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
