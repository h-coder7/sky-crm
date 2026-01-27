"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

export default function CompanyModal({ isOpen, onClose, onSave, company }) {
    const [formData, setFormData] = useState({
        title: "",
        address: "",
        description: "",
        domain: "",
        sector: "",
        country: ""
    });

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (company) {
            setFormData({
                title: company.title || "",
                address: company.address || "",
                description: company.description || "",
                domain: company.domain || "",
                sector: company.sector || "",
                country: company.country || ""
            });
        } else {
            setFormData({
                title: "",
                address: "",
                description: "",
                domain: "",
                sector: "",
                country: ""
            });
        }
    }, [company, isOpen]);

    // Sector options
    const sectorOptions = useMemo(() => [
        { value: "Manufacturing", label: "Manufacturing" },
        { value: "Banking, Insurance & FinTech", label: "Banking, Insurance & FinTech" },
        { value: "Telecomm, Media & Entertainment", label: "Telecomm, Media & Entertainment" },
        { value: "Beauty, Cosmetics & BeautyTech", label: "Beauty, Cosmetics & BeautyTech" },
        { value: "Defense & Security", label: "Defense & Security" },
        { value: "FMCGs, F&B, Foodtech & Aggregators", label: "FMCGs, F&B, Foodtech & Aggregators" },
        { value: "Aviation, Hospitality & TravelTech", label: "Aviation, Hospitality & TravelTech" },
        { value: "Real estate & Proptech", label: "Real estate & Proptech" },
        { value: "Luxury, Fashion & RetailTech", label: "Luxury, Fashion & RetailTech" },
        { value: "Renewable Energy, Oil & Gas", label: "Renewable Energy, Oil & Gas" },
        { value: "Business Services, Auditing & Consultancy", label: "Business Services, Auditing & Consultancy" },
        { value: "Government", label: "Government" },
        { value: "Automotive & Autotech", label: "Automotive & Autotech" },
        { value: "Tech & Cybersecurity", label: "Tech & Cybersecurity" },
        { value: "Pharmaceutical, Medical & MedTech", label: "Pharmaceutical, Medical & MedTech" },
    ], []);

    // Country options (Mocked from countries module)
    const countryOptions = useMemo(() => [
        { value: "United Arab Emirates", label: "United Arab Emirates" },
        { value: "saudia arabia", label: "saudia arabia" },
        { value: "Afghanistan", label: "Afghanistan" },
        { value: "Aland Islands", label: "Aland Islands" },
        { value: "Albania", label: "Albania" },
        { value: "Algeria", label: "Algeria" },
        { value: "American Samoa", label: "American Samoa" },
        { value: "Andorra", label: "Andorra" },
        { value: "Angola", label: "Angola" },
        { value: "Anguilla", label: "Anguilla" },
        { value: "Antarctica", label: "Antarctica" },
        { value: "Antigua and Barbuda", label: "Antigua and Barbuda" },
        { value: "Argentina", label: "Argentina" },
        { value: "Armenia", label: "Armenia" },
        { value: "Aruba", label: "Aruba" },
        { value: "Australia", label: "Australia" },
        { value: "Austria", label: "Austria" },
        { value: "Azerbaijan", label: "Azerbaijan" },
    ], []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen || !isMounted) return null;

    return createPortal(
        <>
            <div className="modal-backdrop fade show" onClick={onClose}></div>
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {company ? "Edit Company" : "Add Company"}
                            </h5>
                            <button className="btn-close" onClick={onClose}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="title"
                                            required
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Domain</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            name="domain"
                                            placeholder="https://example.com"
                                            value={formData.domain}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Address</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Sector</label>
                                        <select
                                            className="form-control form-select"
                                            name="sector"
                                            value={formData.sector}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Sector</option>
                                            <option value="">All</option>
                                            {sectorOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Country</label>
                                        <select
                                            className="form-control form-select"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Country</option>
                                            {countryOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            rows="3"
                                            value={formData.description}
                                            onChange={handleChange}
                                        ></textarea>
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
                                <button
                                    type="submit"
                                    className="butn-st2 butn-md"
                                >
                                    {company ? "Update" : "Save"}
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
