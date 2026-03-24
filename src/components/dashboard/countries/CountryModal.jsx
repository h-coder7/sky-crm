"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function CountryModal({ show, onClose, onSave, country = null }) {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    country_key: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (country) {
      setFormData({
        title: country.title || "",
        country_key: country.country_key || "",
      });
    } else {
      setFormData({
        title: "",
        country_key: "",
      });
    }
  }, [country, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!show || !isMounted) return null;

  return createPortal(
    <>
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
      ></div>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {country ? "Edit Country" : "Add New Country"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row g-3">
                  {/* Country Identity */}
                  <div className="col-12 mb-2">
                    <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Country Identity</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="title" className="form-label text-muted fsz-12">Country Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="country_key" className="form-label text-muted fsz-12">Country Key *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="country_key"
                          name="country_key"
                          value={formData.country_key}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
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
                <button type="submit" className="butn-st2 butn-md">
                  {country ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
