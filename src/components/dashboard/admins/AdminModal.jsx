"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import FileUpload from "../../shared/FileUpload";

const PERMISSIONS = [
    "Dashboard Access",
    "User Management",
    "Admin Management",
    "Settings",
    "Reports & Analytics",
    "Content Management"
];

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

    const handlePermissionChange = (permission) => {
        setFormData((prev) => {
            const currentPermissions = Array.isArray(prev.permissions) ? prev.permissions : [];
            const newPermissions = currentPermissions.includes(permission)
                ? currentPermissions.filter((p) => p !== permission)
                : [...currentPermissions, permission];
            return { ...prev, permissions: newPermissions };
        });
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

                                    {/* Permissions Checkboxes */}
                                    <div className="col-lg-12">
                                        <div className="form-group mb-3">
                                            <label className="form-label d-block mb-3">Permissions</label>

                                            <div className="form-check mb-3">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="selectAllPermissions"
                                                    checked={isAllPermissionsSelected}
                                                    onChange={handleSelectAllPermissions}
                                                />
                                                <label className="form-check-label fsz-13" htmlFor="selectAllPermissions">
                                                    Select All Permissions
                                                </label>
                                            </div>

                                            <hr className="mb-4 text-muted opacity-25" />

                                            <div className="checks-modal">
                                                {PERMISSIONS.map((permission, index) => (
                                                    <div className="form-check" key={index}>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`permission-${index}`}
                                                            checked={selectedPermissions.includes(permission)}
                                                            onChange={() => handlePermissionChange(permission)}
                                                        />
                                                        <label
                                                            className="form-check-label fsz-12"
                                                            htmlFor={`permission-${index}`}
                                                        >
                                                            {permission}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
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
