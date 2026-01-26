"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const SECTORS = [
    "Manufacturing",
    "Banking. Insurance & FinTech",
    "Telecomm, Media & Entertainment",
    "Beauty, Cosmetics & BeautyTech",
    "Defense & Security",
    "FMCGs, F&B, Foodtech & Aggregators",
    "Aviation, Hospitality & TravelTech",
    "Real Estate & Proptech",
    "Luxury, Fashion & RetailTech",
    "Renewable Energy, Oil & Gas",
    "Business Services, Auditing & Consultancy",
    "Government",
    "Automotive & Autotech",
    "Tech & Cybersecurity",
    "Pharmaceutical, Medical & MedTech"
];

export default function EmployeeModal({ show, onClose, onSave, employee = null }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "Business Development Executive",
        sector: [],
    });

    useEffect(() => {
        if (employee) {
            // Intelligent parsing of the sector string by matching against known sectors
            const savedSectors = typeof employee.sector === "string"
                ? SECTORS.filter(s => employee.sector.includes(s))
                : (Array.isArray(employee.sector) ? employee.sector : []);

            setFormData({
                name: employee.name || "",
                email: employee.email || "",
                phone: employee.phone || "",
                role: employee.role || "Business Development Executive",
                sector: savedSectors,
            });
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                role: "Business Development Executive",
                sector: [],
            });
        }
    }, [employee, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSectorChange = (sector) => {
        setFormData((prev) => {
            const currentSectors = Array.isArray(prev.sector) ? prev.sector : [];
            const newSectors = currentSectors.includes(sector)
                ? currentSectors.filter((s) => s !== sector)
                : [...currentSectors, sector];
            return { ...prev, sector: newSectors };
        });
    };

    const handleSelectAllSectors = (e) => {
        if (e.target.checked) {
            setFormData((prev) => ({ ...prev, sector: [...SECTORS] }));
        } else {
            setFormData((prev) => ({ ...prev, sector: [] }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Join sectors with a distinct delimiter for saving/displaying
        // Using "; " to avoid confusion with commas inside names
        const submissionData = {
            ...formData,
            sector: formData.sector.join(", ")
        };
        onSave(submissionData);
    };

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!show || !isMounted) return null;

    const selectedSectors = Array.isArray(formData.sector) ? formData.sector : [];
    const isAllSelected = selectedSectors.length === SECTORS.length;

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
                    <div className="modal-content border-0">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {employee ? "Edit Employee" : "Add New Employee"}
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
                                                <option value="Head Department">Head Department</option>
                                                <option value="Senior Business Development Manager">Senior Business Development Manager</option>
                                                <option value="Business Development Manager">Business Development Manager</option>
                                                <option value="Senior Business Development Executive">Senior Business Development Executive</option>
                                                <option value="Business Development Executive">Business Development Executive</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group mb-3">
                                            <label className="form-label d-block mb-3">Sector</label>

                                            <div className="form-check mb-3">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="selectAllSectors"
                                                    checked={isAllSelected}
                                                    onChange={handleSelectAllSectors}
                                                />
                                                <label className="form-check-label fsz-13" htmlFor="selectAllSectors">
                                                    Select All Sectors
                                                </label>
                                            </div>

                                            <hr className="mb-4 text-muted opacity-25" />

                                            <div className="checks-modal">
                                                {SECTORS.map((sector, index) => (
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`sector-${index}`}
                                                            checked={selectedSectors.includes(sector)}
                                                            onChange={() => handleSectorChange(sector)}
                                                        />
                                                        <label
                                                            className="form-check-label fsz-12"
                                                            htmlFor={`sector-${index}`}
                                                        >
                                                            {sector}
                                                        </label>
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
                                    {employee ? "Update" : "Save"}
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
