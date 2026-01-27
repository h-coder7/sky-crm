"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function CategoryModal({ show, onClose, onSave, category = null }) {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    start_price: "",
    end_price: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (category) {
      setFormData({
        title: category.title || "",
        start_price: category.start_price || "",
        end_price: category.end_price || "",
      });
    } else {
      setFormData({
        title: "",
        start_price: "",
        end_price: "",
      });
    }
  }, [category, show]);

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
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {category ? "Edit Category" : "Add Category"}
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
                  <div className="col-md-12">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Start Price</label>
                    <input
                      type="text" // Using text to allow custom formatting input if user desires, or number
                      className="form-control"
                      name="start_price"
                      value={formData.start_price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">End Price</label>
                    <input
                      type="text"
                      className="form-control"
                      name="end_price"
                      value={formData.end_price}
                      onChange={handleChange}
                      required
                    />
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
                  {category ? "Update" : "Save"}
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
