"use client";

import { useState, useEffect } from "react";

export default function CategoryModal({ show, onClose, onSave, category = null }) {
  const [formData, setFormData] = useState({
    title: "",
    start_price: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        title: category.title || "",
        start_price: category.start_price || "",
      });
    } else {
      setFormData({
        title: "",
        start_price: "",
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

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {category ? "Edit Category" : "Add New Category"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Category Title
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
                <div className="mb-3">
                  <label htmlFor="start_price" className="form-label">
                    Start Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="start_price"
                    name="start_price"
                    value={formData.start_price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  {category ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
