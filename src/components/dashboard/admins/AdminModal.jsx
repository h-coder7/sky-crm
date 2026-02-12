"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Select from "react-select";
import FileUpload from "../../shared/FileUpload";

const ROLE_OPTIONS = [
    { value: "Admin", label: "Admin" },
    { value: "Super Admin", label: "Super Admin" },
    { value: "Sub Admin", label: "Sub Admin" }
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

const PHOTO_ACCEPT_TYPES = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
};

const MAX_UPLOAD_FILES = 1;

export default function AdminModal({ show, onClose, onSave, admin = null }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "Admin",
        password: "",
        confirmPassword: "",
        permissions: [],
        attachments: [], // Array of files
    });

    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        if (admin) {
            setFormData({
                name: admin.name || "",
                email: admin.email || "",
                phone: admin.phone || "",
                role: admin.role || "Admin",
                password: "",
                confirmPassword: "",
                permissions: Array.isArray(admin.permissions) ? admin.permissions : [],
                attachments: Array.isArray(admin.attachments) ? admin.attachments : (admin.image ? [{ preview: admin.image, type: 'image/jpeg', name: 'Admin Image' }] : []),
            });
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                role: "Admin",
                password: "",
                confirmPassword: "",
                permissions: [],
                attachments: [],
            });
        }
        setPasswordError("");
    }, [admin, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "password" || name === "confirmPassword") {
            setPasswordError("");
        }
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

    const handleFilesChange = (newFiles) => {
        setFormData((prev) => ({ ...prev, attachments: newFiles }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        if (!admin && !formData.password) {
            setPasswordError("Password is required for new admins");
            return;
        }

        const { confirmPassword, attachments, ...rest } = formData;
        const submissionData = { ...rest };

        // Link the photo to admin.image
        if (attachments && attachments.length > 0) {
            // For UI display, we use the preview URL (blob:...).
            // For the API, we usually need the File object, so we save it as imageFile.
            submissionData.image = attachments[0].preview;
            if (attachments[0].file) {
                submissionData.imageFile = attachments[0].file;
            }
        } else {
            submissionData.image = ""; // Clear image if no attachments
            submissionData.imageFile = null;
        }

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
                                            <label htmlFor="role" className="form-label">Role</label>
                                            <Select
                                                name="role"
                                                options={ROLE_OPTIONS}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                value={ROLE_OPTIONS.find(option => option.value === formData.role)}
                                                onChange={(option) => setFormData(prev => ({ ...prev, role: option.value }))}
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
                                            <label htmlFor="password" className="form-label">
                                                {admin ? "New Password (Optional)" : "Password"}
                                            </label>
                                            <input
                                                type="password"
                                                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required={!admin}
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
                                                required={!admin && formData.password}
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

                                    <div className="col-lg-12">
                                        <div className="form-group mb-3">
                                            <FileUpload
                                                files={formData.attachments}
                                                onFilesChange={handleFilesChange}
                                                maxFiles={MAX_UPLOAD_FILES}
                                                accept={PHOTO_ACCEPT_TYPES}
                                                title="Photo"
                                                hint="Image (Max 1)"
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
