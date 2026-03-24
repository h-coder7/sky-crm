"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function SectorModal({ show, onClose, onSave, sector = null }) {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    from_date: "",
    to_date: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (sector) {
      setFormData({
        title: sector.title || "",
        description: sector.description || "",
        from_date: sector.from_date || "",
        to_date: sector.to_date || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        from_date: new Date().toISOString().split("T")[0],
        to_date: new Date().toISOString().split("T")[0],
      });
    }
  }, [sector, show]);

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
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title">
                {sector ? "Edit Sector" : "Add New Sector"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                <div className="row">
                  {/* --- Group 1: Identity --- */}
                  <div className="col-12 mb-4">
                    <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Main info</h6>
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label htmlFor="title" className="form-label text-muted fsz-12">
                          Sector Name
                        </label>
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
                      <div className="col-md-12 mb-3">
                        <label htmlFor="description" className="form-label text-muted fsz-12">
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          id="description"
                          name="description"
                          rows="3"
                          value={formData.description}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- Group 2: Duration --- */}
                  <div className="col-12 mb-4">
                    <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Duration</h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="from_date" className="form-label text-muted fsz-12">
                          From Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="from_date"
                          name="from_date"
                          value={formData.from_date}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="to_date" className="form-label text-muted fsz-12">
                          To Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="to_date"
                          name="to_date"
                          value={formData.to_date}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer p-3 border-top-0">
                <button
                  type="button"
                  className="butn-st2 butn-md line-butn me-2"
                  onClick={onClose}
                >
                  Close
                </button>
                <button type="submit" className="butn-st2 butn-md">
                  {sector ? "Update" : "Save"}
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
