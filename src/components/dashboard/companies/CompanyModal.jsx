"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Select from "react-select";
import FileUpload from "../../shared/FileUpload";

const PHOTO_ACCEPT_TYPES = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
};

export default function CompanyModal({ isOpen, onClose, onSave, company }) {
    const [formData, setFormData] = useState({
        title: "",
        address: "",
        description: "",
        domain: "",
        sector: "",
        country: "",
        region: "",
        location: "",
        attachments: [],
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
                country: company.country || "",
                region: company.region || "",
                location: company.location || "",
                attachments: company.image ? [{ preview: company.image, type: 'image/jpeg', name: 'Company Image' }] : [],
            });
        } else {
            setFormData({
                title: "",
                address: "",
                description: "",
                domain: "",
                sector: "",
                country: "",
                region: "",
                location: "",
                attachments: [],
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
        { value: "Saudi Arabia", label: "Saudi Arabia" },
        { value: "Kuwait", label: "Kuwait" },
        { value: "Qatar", label: "Qatar" },
        { value: "Oman", label: "Oman" },
        { value: "Egypt", label: "Egypt" },
    ], []);

    const regionOptions = useMemo(() => [
        { value: "Dubai", label: "Dubai" },
        { value: "Abu Dhabi", label: "Abu Dhabi" },
        { value: "Riyadh", label: "Riyadh" },
        { value: "Cairo", label: "Cairo" },
    ], []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFilesChange = (newFiles) => {
        setFormData((prev) => ({ ...prev, attachments: newFiles }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = { ...formData };
        if (formData.attachments && formData.attachments.length > 0) {
            submissionData.image = formData.attachments[0].preview;
        } else {
            submissionData.image = "";
        }
        delete submissionData.attachments;
        onSave(submissionData);
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
                                {company ? "Edit Company" : "Add New Company"}
                            </h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row">
                                    {/* --- Group 1: Identity --- */}
                                    <div className="col-12 mb-4">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Identity</h6>
                                        <div className="row">
                                            <div className="col-lg-12 mb-4">
                                                <FileUpload
                                                    files={formData.attachments}
                                                    onFilesChange={handleFilesChange}
                                                    maxFiles={1}
                                                    accept={PHOTO_ACCEPT_TYPES}
                                                    title="Company Logo"
                                                    hint="Drop logo here or click to upload"
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-3">
                                                <label className="form-label">Title *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="title"
                                                    required
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-3">
                                                <label className="form-label">Sector</label>
                                                <Select
                                                    options={sectorOptions}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    value={sectorOptions.find(o => o.value === formData.sector)}
                                                    onChange={(o) => setFormData(p => ({ ...p, sector: o.value }))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Group 2: Geography --- */}
                                    <div className="col-12 mb-4">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Geography</h6>
                                        <div className="row">
                                            <div className="col-lg-4 mb-3">
                                                <label className="form-label">Country</label>
                                                <Select
                                                    options={countryOptions}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    value={countryOptions.find(o => o.value === formData.country)}
                                                    onChange={(o) => setFormData(p => ({ ...p, country: o.value }))}
                                                />
                                            </div>
                                            <div className="col-lg-4 mb-3">
                                                <label className="form-label">Region</label>
                                                <Select
                                                    options={regionOptions}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    value={regionOptions.find(o => o.value === formData.region)}
                                                    onChange={(o) => setFormData(p => ({ ...p, region: o.value }))}
                                                />
                                            </div>
                                            <div className="col-lg-4 mb-3">
                                                <label className="form-label">Address</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Group 3: Details --- */}
                                    <div className="col-12 mb-4">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Details</h6>
                                        <div className="row">
                                            <div className="col-md-12 mb-3">
                                                <label className="form-label">Description</label>
                                                <textarea
                                                    className="form-control"
                                                    name="description"
                                                    rows="5"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                ></textarea>
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
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Location (Map View)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="location"
                                                    placeholder="Google Maps URL or Coordinates"
                                                    value={formData.location}
                                                    onChange={handleChange}
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
