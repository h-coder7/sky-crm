"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function AdminModal({ show, onClose, onSave, admin = null }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "Admin",
        image: "",
    });

    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        if (admin) {
            setFormData({
                name: admin.name || "",
                email: admin.email || "",
                phone: admin.phone || "",
                role: admin.role || "Admin",
                image: admin.image || "",
            });
            setImagePreview(admin.image || "");
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                role: "Admin",
                image: "",
            });
            setImagePreview("");
        }
    }, [admin, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a temporary URL for preview
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            // Update formData with the previewUrl so it shows in the table
            setFormData((prev) => ({ ...prev, image: previewUrl }));
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
                                {admin ? "Edit Admin" : "Add New Admin"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            ></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="form-group mb-3">
                                            <label htmlFor="name" className="form-label">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group mb-3">
                                            <label htmlFor="email" className="form-label">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group mb-3">
                                            <label htmlFor="phone" className="form-label">
                                                Phone
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group mb-3">
                                            <label htmlFor="role" className="form-label">
                                                Role
                                            </label>
                                            <select
                                                className="form-control form-select"
                                                id="role"
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Super Admin">Super Admin</option>
                                                <option value="Sub Admin">Sub Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group mb-3 upload-comp">
                                            <label htmlFor="image" className="form-label">
                                                Admin Image
                                            </label>
                                            <div className="upload-content">
                                                <div className="row">
                                                    <div className="col-4">
                                                        <div className="inpt-cont">
                                                            <input
                                                                type="file"
                                                                className="form-control"
                                                                id="image"
                                                                name="image"
                                                                accept="image/*"
                                                                onChange={handleImageChange}
                                                            />
                                                            <div className="float-txt">
                                                                <i className="fal fa-upload"></i>
                                                                <span className="d-block text-center">Upload Image</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-4">
                                                        {imagePreview && (
                                                            <div className="img-prev">
                                                                <img src={imagePreview}
                                                                    alt="Preview"
                                                                    className=""
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
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
                                    {admin ? "Update" : "Save"}
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
