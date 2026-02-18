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

const MODULE_PERMISSIONS = {
    "Admins": [
        "Get Users", "Create User", "Edit User", "Delete & Restore User", "Show User", "Export Users"
    ],
    "Employees": [
        "Get Employees", "Create Employee", "Edit Employee", "Delete & Restore Employee", "Employees Target", "Show Employees", "Export Employees"
    ],
    "Sectors": [
        "Get Sectors", "Create Sector", "Edit Sector", "Delete & Restore Sector", "Export Sectors", "Show Sector"
    ],
    "Countries": [
        "Get Countries", "Create Country", "Edit Country", "Delete & Restore Country", "Show Country", "Export Countries"
    ],
    "Contact Lists": [
        "Get Contact lists", "Create Contact list", "Edit Contact list", "Delete & Restore contact list", "Show contact list", "Export Contact Lists"
    ],
    "Deals": [
        "Get Deals", "Create Deal", "Edit Deal", "Delete & Restore Deal", "Show Deal", "Export Deals"
    ],
    "Companies": [
        "Get Companies", "Create Company", "Edit Company", "Delete & Restore Company", "Show Company", "Export Companies"
    ],
    "Products": [
        "Get Products", "Create Product", "Edit Product", "Delete & Restore Product", "Show Product", "Export Products"
    ],
    "Target": [
        "Get Targets", "Create Target", "Edit Target", "Delete & Restore Target", "Export Targets", "Show Target", "Update Target", "Export Chart Targets"
    ],
    "Home": [
        "Show Statistics", "Export Statistics"
    ],
    "Categories": [
        "Get Categories", "Create Category", "Edit Category", "Delete & Restore Category", "Show Category", "Export Categories"
    ],
    "Daily Log": [
        "Get Logs", "Create Log", "Edit Log", "Delete & Restore Log", "Show Log", "Export Daily Logs"
    ],
    "Regions": [
        "Get Regions", "Create Region", "Edit Region", "Delete & Restore Region", "Export Regions"
    ],
    "Settings": [
        "Get Settings", "Edit Setting"
    ],
    "Logs": [
        "Get Logs", "Export Logs"
    ]
};

const ALL_PERMISSION_KEYS = Object.values(MODULE_PERMISSIONS).flat();

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

    const handlePermissionToggle = (permission) => {
        setFormData((prev) => {
            const permissions = prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission];
            return { ...prev, permissions };
        });
    };

    const handleSelectModule = (moduleName, isChecked) => {
        const modulePerms = MODULE_PERMISSIONS[moduleName];
        setFormData((prev) => {
            const otherPerms = prev.permissions.filter(p => !modulePerms.includes(p));
            const permissions = isChecked ? [...otherPerms, ...modulePerms] : otherPerms;
            return { ...prev, permissions };
        });
    };

    const handleSelectAllModules = (isChecked) => {
        setFormData((prev) => ({
            ...prev,
            permissions: isChecked ? [...ALL_PERMISSION_KEYS] : []
        }));
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

                                    {/* Detailed Permissions Section */}
                                    <div className="col-lg-12">
                                        <div className="permissions-container mt-3 border rounded-3 p-3 bg-light">
                                            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                                                <h6 className="mb-0 fsz-16">Modules Permissions</h6>
                                                <div className="form-check m-0">
                                                    <input
                                                        className="form-check-input mt-1"
                                                        type="checkbox"
                                                        id="selectAllModules"
                                                        checked={formData.permissions.length === ALL_PERMISSION_KEYS.length}
                                                        onChange={(e) => handleSelectAllModules(e.target.checked)}
                                                    />
                                                    <label className="form-check-label fsz-13 cursor-pointer" htmlFor="selectAllModules">
                                                        Select All Modules
                                                    </label>
                                                </div>
                                            </div>
                                            <div className=" overflow-auto custom-scroll" style={{ maxHeight: "400px" }}>
                                                <div className="row g-3 w-100">
                                                    {Object.entries(MODULE_PERMISSIONS).map(([moduleName, perms]) => {
                                                        const isModuleFullySelected = perms.every(p => formData.permissions.includes(p));
                                                        const isModulePartiallySelected = perms.some(p => formData.permissions.includes(p)) && !isModuleFullySelected;

                                                        return (
                                                            <div key={moduleName} className="col-md-6 col-xl-4">
                                                                <div className="module-card bg-white p-3 rounded-3 h-100">
                                                                    <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                                                                        <span className="fsz-13">{moduleName}</span>
                                                                        <div className="form-check m-0">
                                                                            <input
                                                                                className="form-check-input mt-1"
                                                                                type="checkbox"
                                                                                id={`select-${moduleName}`}
                                                                                checked={isModuleFullySelected}
                                                                                ref={el => {
                                                                                    if (el) el.indeterminate = isModulePartiallySelected;
                                                                                }}
                                                                                onChange={(e) => handleSelectModule(moduleName, e.target.checked)}
                                                                            />
                                                                            <label className="form-check-label fsz-12 text-muted cursor-pointer" htmlFor={`select-${moduleName}`}>
                                                                                Select All
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="perms-list">
                                                                        {perms.map(p => (
                                                                            <div key={p} className="form-check mb-2">
                                                                                <input
                                                                                    className="form-check-input"
                                                                                    type="checkbox"
                                                                                    id={`perm-${p}-${moduleName}`}
                                                                                    checked={formData.permissions.includes(p)}
                                                                                    onChange={() => handlePermissionToggle(p)}
                                                                                />
                                                                                <label className="form-check-label fsz-12 cursor-pointer" htmlFor={`perm-${p}-${moduleName}`}>
                                                                                    {p}
                                                                                </label>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
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
