"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Select from "react-select";

const ROLE_OPTIONS = [
    { value: "Head Department", label: "Head Department" },
    { value: "Senior Business Development Manager", label: "Senior Business Development Manager" },
    { value: "Business Development Manager", label: "Business Development Manager" },
    { value: "Senior Business Development Executive", label: "Senior Business Development Executive" },
    { value: "Business Development Executive", label: "Business Development Executive" },
];

const PERMISSIONS = [
    "Dashboard Access",
    "User Management",
    "Admin Management",
    "Settings",
    "Reports & Analytics",
    "Content Management"
];

const PERMISSION_OPTIONS = PERMISSIONS.map(p => ({ value: p, label: p }));

export default function EmployeeModal({ show, onClose, onSave, employee = null }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "Business Development Executive",
        password: "",
        confirmPassword: "",
        permissions: [],
    });

    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name || "",
                email: employee.email || "",
                phone: employee.phone || "",
                role: employee.role || "Business Development Executive",
                password: "",
                confirmPassword: "",
                permissions: Array.isArray(employee.permissions) ? employee.permissions : [],
            });
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                role: "Business Development Executive",
                password: "",
                confirmPassword: "",
                permissions: [],
            });
        }
        setPasswordError("");
    }, [employee, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "password" || name === "confirmPassword") {
            setPasswordError("");
        }
    };

    const handleRoleChange = (selectedOption) => {
        setFormData((prev) => ({ ...prev, role: selectedOption?.value || "" }));
    };

    const handlePermissionChange = (selectedOptions) => {
        const permissions = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData((prev) => ({ ...prev, permissions }));
    };

    const handleSelectAllPermissions = (e) => {
        if (e.target.checked) {
            setFormData((prev) => ({ ...prev, permissions: [...PERMISSIONS] }));
        } else {
            setFormData((prev) => ({ ...prev, permissions: [] }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        if (!employee && !formData.password) {
            setPasswordError("Password is required for new employees");
            return;
        }

        const { confirmPassword, ...submissionData } = formData;
        onSave(submissionData);
    };

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!show || !isMounted) return null;

    const selectedPermissions = Array.isArray(formData.permissions) ? formData.permissions : [];
    const isAllPermissionsSelected = selectedPermissions.length === PERMISSIONS.length;

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
                                            <label htmlFor="name" className="form-label">Name</label>
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
                                            <label htmlFor="phone" className="form-label">Phone</label>
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
                                            <label htmlFor="email" className="form-label">Email</label>
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
                                            <label htmlFor="role" className="form-label">Role</label>
                                            <Select
                                                instanceId="employee-role-select"
                                                options={ROLE_OPTIONS}
                                                value={ROLE_OPTIONS.find(opt => opt.value === formData.role)}
                                                onChange={handleRoleChange}
                                                placeholder="Select Role"
                                                classNamePrefix="react-select"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group mb-3">
                                            <label htmlFor="password" className="form-label">
                                                {employee ? "New Password (Optional)" : "Password"}
                                            </label>
                                            <input
                                                type="password"
                                                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required={!employee}
                                            />
                                            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group mb-3">
                                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                            <input
                                                type="password"
                                                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required={!employee && formData.password}
                                            />
                                        </div>
                                    </div>

                                    {/* Permissions Select */}
                                    <div className="col-lg-12">
                                        <div className="form-group mb-3">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <label className="form-label mb-0">Permissions</label>
                                                <div className="form-check m-0">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="selectAllPermissions"
                                                        checked={isAllPermissionsSelected}
                                                        onChange={handleSelectAllPermissions}
                                                    />
                                                    <label className="form-check-label fsz-12" htmlFor="selectAllPermissions">
                                                        Select All
                                                    </label>
                                                </div>
                                            </div>

                                            <Select
                                                isMulti
                                                name="permissions"
                                                options={PERMISSION_OPTIONS}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                placeholder="Select Permissions..."
                                                value={PERMISSION_OPTIONS.filter(option => selectedPermissions.includes(option.value))}
                                                onChange={handlePermissionChange}
                                            />
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
