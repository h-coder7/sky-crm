"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function TargetModal({ show, onClose, onSave, target = null }) {
    const [isMounted, setIsMounted] = useState(false);
    const [formData, setFormData] = useState({
        employee: "",
        year: "",
        product: "",
        target: "",
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (target) {
            setFormData({
                employee: target.employee || "",
                year: target.year || "",
                product: target.product || "",
                target: target.target || "",
            });
        } else {
            setFormData({
                employee: "",
                year: "",
                product: "",
                target: "",
            });
        }
    }, [target, show]);

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
                                {target ? "Edit Target" : "Add Target"}
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
                                    <div className="col-md-6">
                                        <label className="form-label">Employee</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="employee"
                                            value={formData.employee}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Year</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Product</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="product"
                                            value={formData.product}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Target</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="target"
                                            value={formData.target}
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
                                    {target ? "Update" : "Save"}
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
