"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCountries } from "../../../hooks/useCountries";
import Select from "react-select";

export default function RegionModal({ show, onClose, onSave, region = null }) {
    const { data: countriesData } = useCountries();
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

    const handleSelectChange = (selectedOption, { name }) => {
        setFormData((prev) => ({
            ...prev,
            [name]: selectedOption ? selectedOption.value : "",
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const countryOptions = countriesData?.map((c) => ({
        value: c.title,
        label: c.title,
    })) || [];

    if (!show || !isMounted) return null;

    return createPortal(
        <>
            <div className="modal-backdrop fade show" onClick={onClose}></div>
            <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => e.target === e.currentTarget && onClose()}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{region ? "Edit Region" : "Add New Region"}</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row g-3">
                                    {/* Region Identity */}
                                    <div className="col-12 mb-2">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Region Identity</h6>
                                        <div className="row g-3">
                                            <div className="col-md-6">
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
                                            <div className="col-md-6">
                                                <label htmlFor="country" className="form-label text-muted fsz-12">Country *</label>
                                                <Select
                                                    name="country"
                                                    options={countryOptions}
                                                    value={countryOptions.find((opt) => opt.value === formData.country)}
                                                    onChange={handleSelectChange}
                                                    placeholder="Select Country..."
                                                    isClearable
                                                    required
                                                    classNamePrefix="react-select"
                                                />
                                            </div>
                                        </div>
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
