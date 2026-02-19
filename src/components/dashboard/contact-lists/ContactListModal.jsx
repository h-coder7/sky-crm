"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Select from "react-select";
import FileUpload from "../../shared/FileUpload";
import { useEmployees } from "@/context/EmployeesContext";
import { useCountries } from "@/context/CountriesContext";

const GENDER_OPTIONS = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" }
];

const DECISION_MAKER_OPTIONS = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" }
];

const STATUS_OPTIONS = [
    { value: "New Lead", label: "New Lead" },
    { value: "1st Contact Done", label: "1st Contact Done" },
    { value: "2nd Contact Done", label: "2nd Contact Done" },
    { value: "Follow - Up", label: "Follow - Up" },
    { value: "Meeting Scheduled", label: "Meeting Scheduled" },
    { value: "Brief Received", label: "Brief Received" },
    { value: "Proposal Submitted", label: "Proposal Submitted" },
    { value: "Comments Received", label: "Comments Received" },
    { value: "Quotation Submitted", label: "Quotation Submitted" },
    { value: "Revising Quotation", label: "Revising Quotation" },
    { value: "Final Proposal & Quotation Submitted", label: "Final Proposal & Quotation Submitted" },
    { value: "Project Won", label: "Project Won" },
    { value: "Project Lost", label: "Project Lost" }
];

const TOP_CUSTOMER_OPTIONS = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" }
];

const PHOTO_ACCEPT_TYPES = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
};

export default function ContactListModal({ show, onClose, onSave, contact = null }) {
    const { employees: contextEmployees } = useEmployees();
    const { countries: contextCountries } = useCountries();
    const [isMounted, setIsMounted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        company: "",
        job_title: "",
        employee: "",
        status: "New Lead",
        top_customer: "No",
        decision_maker_status: "",
        country: "",
        address: "",
        email: "",
        phones: [""],
        landlines: [""],
        notes: "",
        budget: "",
        avg_events_year: "",
        avg_stands_year: "",
        company_website_url: "",
        social_links: [""],
        attachments: [],
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (contact) {
            setFormData({
                name: contact.name || "",
                gender: contact.gender || "",
                company: contact.company || "",
                job_title: contact.job_title || "",
                employee: contact.employee || "",
                status: contact.status || "New Lead",
                top_customer: contact.top_customer === true || contact.top_customer === "Yes" ? "Yes" : "No",
                decision_maker_status: contact.decision_maker_status || "",
                country: contact.country || "",
                address: contact.address || "",
                email: contact.email || "",
                phones: Array.isArray(contact.phones) ? contact.phones : [contact.phone || ""],
                landlines: Array.isArray(contact.landlines) ? contact.landlines : [""],
                notes: contact.notes || "",
                budget: contact.budget || "",
                avg_events_year: contact.avg_events_year || "",
                avg_stands_year: contact.avg_stands_year || "",
                company_website_url: contact.company_website_url || "",
                social_links: Array.isArray(contact.social_links) ? contact.social_links : [""],
                attachments: contact.image ? [{ preview: contact.image, type: 'image/jpeg', name: 'Contact Image' }] : [],
            });
        } else {
            setFormData({
                name: "",
                gender: "",
                company: "",
                job_title: "",
                employee: "",
                status: "New Lead",
                top_customer: "No",
                decision_maker_status: "",
                country: "",
                address: "",
                email: "",
                phones: [""],
                landlines: [""],
                notes: "",
                budget: "",
                avg_events_year: "",
                avg_stands_year: "",
                company_website_url: "",
                social_links: [""],
                attachments: [],
            });
        }
    }, [contact, show]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleArrayChange = (index, value, field) => {
        const updated = [...formData[field]];
        updated[index] = value;
        setFormData((prev) => ({ ...prev, [field]: updated }));
    };

    const addArrayItem = (field) => {
        setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    const removeArrayItem = (index, field) => {
        if (formData[field].length > 1) {
            const updated = formData[field].filter((_, i) => i !== index);
            setFormData((prev) => ({ ...prev, [field]: updated }));
        }
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

    if (!show || !isMounted) return null;

    const employeeOptions = contextEmployees.map(emp => ({
        value: emp.name,
        label: emp.name
    }));

    const countryOptions = contextCountries.map(c => ({
        value: c.title,
        label: c.title
    }));

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
                                {contact ? "Edit Contact" : "Add New Contact"}
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
                                                    title="Contact Image"
                                                    hint="Drop image here or click to upload"
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-3">
                                                <label htmlFor="name" className="form-label">Name *</label>
                                                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
                                            </div>
                                            <div className="col-lg-6 mb-3">
                                                <label htmlFor="gender" className="form-label">Gender</label>
                                                <Select
                                                    options={GENDER_OPTIONS}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    value={GENDER_OPTIONS.find(o => o.value === formData.gender)}
                                                    onChange={(o) => setFormData(p => ({ ...p, gender: o.value }))}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-3">
                                                <label htmlFor="company" className="form-label">Company</label>
                                                <input type="text" className="form-control" id="company" name="company" value={formData.company} onChange={handleChange} />
                                            </div>
                                            <div className="col-lg-6 mb-3">
                                                <label htmlFor="job_title" className="form-label">Job Title</label>
                                                <input type="text" className="form-control" id="job_title" name="job_title" value={formData.job_title} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Group 2: Engagement --- */}
                                    <div className="col-12 mb-4">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Engagement</h6>
                                        <div className="row">
                                            <div className="col-lg-6 mb-3">
                                                <label htmlFor="employee" className="form-label">Employee</label>
                                                <Select
                                                    instanceId="contact-employee-select"
                                                    options={employeeOptions}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Employee..."
                                                    value={employeeOptions.find(o => o.value === formData.employee)}
                                                    onChange={(o) => setFormData(p => ({ ...p, employee: o ? o.value : "" }))}
                                                    isClearable
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-3">
                                                <label htmlFor="status" className="form-label">Status</label>
                                                <Select
                                                    options={STATUS_OPTIONS}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    value={STATUS_OPTIONS.find(o => o.value === formData.status)}
                                                    onChange={(o) => setFormData(p => ({ ...p, status: o.value }))}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-3">
                                                <label htmlFor="decision_maker_status" className="form-label">Decision Maker</label>
                                                <Select
                                                    options={DECISION_MAKER_OPTIONS}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    value={DECISION_MAKER_OPTIONS.find(o => o.value === formData.decision_maker_status)}
                                                    onChange={(o) => setFormData(p => ({ ...p, decision_maker_status: o.value }))}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-3">
                                                <label htmlFor="top_customer" className="form-label">Top Customer</label>
                                                <Select
                                                    options={TOP_CUSTOMER_OPTIONS}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    value={TOP_CUSTOMER_OPTIONS.find(o => o.value === formData.top_customer)}
                                                    onChange={(o) => setFormData(p => ({ ...p, top_customer: o.value }))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Group 3: Contact Info --- */}
                                    <div className="col-12 mb-4">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Contact Info</h6>
                                        <div className="row">
                                            <div className="col-lg-6 mb-3">
                                                <label htmlFor="country" className="form-label">Country</label>
                                                <Select
                                                    instanceId="contact-country-select"
                                                    options={countryOptions}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Country..."
                                                    value={countryOptions.find(o => o.value === formData.country)}
                                                    onChange={(o) => setFormData(p => ({ ...p, country: o ? o.value : "" }))}
                                                    isClearable
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-3">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} />
                                            </div>
                                            <div className="col-12 mb-3">
                                                <label htmlFor="address" className="form-label">Address</label>
                                                <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleChange} />
                                            </div>

                                            {/* Phone Numbers */}
                                            <div className="col-12 mb-3">
                                                <label className="form-label d-flex justify-content-between">
                                                    Phone Numbers
                                                    <button type="button" className="btn btn-sm bg-blue text-white fsz-10 py-0 rounded-pill hover-bg-main" onClick={() => addArrayItem("phones")}>+ Add Phone</button>
                                                </label>
                                                {formData.phones.map((phone, idx) => (
                                                    <div key={idx} className="d-flex mb-2">
                                                        <input type="text" className="form-control form-control-sm" value={phone} onChange={(e) => handleArrayChange(idx, e.target.value, "phones")} />
                                                        <button type="button" className="btn btn-sm text-danger ms-2 border-0" onClick={() => removeArrayItem(idx, "phones")} disabled={formData.phones.length === 1}>
                                                            <i className="fal fa-trash"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Landline Numbers */}
                                            <div className="col-12 mb-3">
                                                <label className="form-label d-flex justify-content-between">
                                                    Landline Numbers
                                                    <button type="button" className="btn btn-sm bg-blue text-white fsz-10 py-0 rounded-pill hover-bg-main" onClick={() => addArrayItem("landlines")}>+ Add Landline</button>
                                                </label>
                                                {formData.landlines.map((land, idx) => (
                                                    <div key={idx} className="d-flex mb-2">
                                                        <input type="text" className="form-control form-control-sm" value={land} onChange={(e) => handleArrayChange(idx, e.target.value, "landlines")} />
                                                        <button type="button" className="btn btn-sm text-danger ms-2 border-0" onClick={() => removeArrayItem(idx, "landlines")} disabled={formData.landlines.length === 1}>
                                                            <i className="fal fa-trash"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Group 4: Remarks --- */}
                                    <div className="col-12 mb-4">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Remarks</h6>
                                        <div className="row">
                                            <div className="col-12">
                                                <label htmlFor="notes" className="form-label">Notes</label>
                                                <textarea className="form-control" id="notes" name="notes" rows="5" value={formData.notes} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Group 5: Metrics --- */}
                                    <div className="col-12 mb-4">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Metrics</h6>
                                        <div className="row">
                                            <div className="col-lg-4 mb-3">
                                                <label htmlFor="budget" className="form-label">Budget</label>
                                                <input type="text" className="form-control" id="budget" name="budget" value={formData.budget} onChange={handleChange} />
                                            </div>
                                            <div className="col-lg-4 mb-3">
                                                <label htmlFor="avg_events_year" className="form-label">Avg. Events/Year</label>
                                                <input type="text" className="form-control" id="avg_events_year" name="avg_events_year" value={formData.avg_events_year} onChange={handleChange} />
                                            </div>
                                            <div className="col-lg-4 mb-3">
                                                <label htmlFor="avg_stands_year" className="form-label">Avg. Stands/Year</label>
                                                <input type="text" className="form-control" id="avg_stands_year" name="avg_stands_year" value={formData.avg_stands_year} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Group 6: Web Presence --- */}
                                    <div className="col-12 mb-4">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Web Presence</h6>
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <label htmlFor="company_website_url" className="form-label">Company Website</label>
                                                <input type="url" className="form-control" id="company_website_url" name="company_website_url" value={formData.company_website_url} onChange={handleChange} />
                                            </div>
                                            {/* Social Media Links */}
                                            <div className="col-12">
                                                <label className="form-label d-flex justify-content-between">
                                                    Social Media Links
                                                    <button type="button" className="btn btn-sm bg-blue text-white fsz-10 py-0 rounded-pill hover-bg-main" onClick={() => addArrayItem("social_links")}>+ Add Link</button>
                                                </label>
                                                {formData.social_links.map((link, idx) => (
                                                    <div key={idx} className="d-flex mb-2">
                                                        <input type="text" className="form-control form-control-sm" value={link} onChange={(e) => handleArrayChange(idx, e.target.value, "social_links")} />
                                                        <button type="button" className="btn btn-sm text-danger ms-2 border-0" onClick={() => removeArrayItem(idx, "social_links")} disabled={formData.social_links.length === 1}>
                                                            <i className="fal fa-trash"></i>
                                                        </button>
                                                    </div>
                                                ))}
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
                                    {contact ? "Update" : "Save"}
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
