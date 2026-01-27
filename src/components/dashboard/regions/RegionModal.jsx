"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function RegionModal({ show, onClose, onSave, region = null }) {
    const [isMounted, setIsMounted] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        country: "",
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (region) {
            setFormData({
                title: region.title || "",
                country: region.country || "",
            });
        } else {
            setFormData({
                title: "",
                country: "",
            });
        }
    }, [region, show]);

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
            <div className="modal-backdrop fade show" onClick={onClose}></div>
            <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => e.target === e.currentTarget && onClose()}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{region ? "Edit Region" : "Add New Region"}</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label htmlFor="title" className="form-label text-muted fsz-12">Title *</label>
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
                                    <div className="col-12">
                                        <label htmlFor="country" className="form-label text-muted fsz-12">Country *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="butn-st2 butn-md line-butn" onClick={onClose}>Close</button>
                                <button type="submit" className="butn-st2 butn-md">{region ? "Update" : "Save"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
