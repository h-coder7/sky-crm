"use client";

import { useEffect, useState } from "react";

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

export default function AdminDetailsOffcanvas({ show, admin, onClose }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    // Group selected permissions by module
    const userPermissions = admin?.permissions || [];
    const groupedPermissions = Object.entries(MODULE_PERMISSIONS).reduce((acc, [moduleName, perms]) => {
        const selectedInModule = perms.filter(p => userPermissions.includes(p));
        if (selectedInModule.length > 0) {
            acc[moduleName] = selectedInModule;
        }
        return acc;
    }, {});

    return (
        <>
            <div
                className={`offcanvas offcanvas-end border-0 shadow ${show ? "show" : ""}`}
                tabIndex="-1"
                id="adminDetailsOffcanvas"
                aria-labelledby="adminDetailsOffcanvasLabel"
                style={{ visibility: show ? "visible" : "hidden" }}
            >
                <div className="offcanvas-header border-bottom py-3">
                    <h5 className="offcanvas-title fw-600 fsz-16" id="adminDetailsOffcanvasLabel">
                        <i className="fal fa-user-tie me-2 text-primary"></i> Admin Details
                    </h5>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body p-4 custom-scroll">
                    {admin ? (
                        <div className="admin-details">
                            <div className="details-list mb-4 d-flex flex-wrap gap-3">
                                <div className="detail-item py-3 px-4 border rounded-3 grow-1 d-flex align-items-center">
                                    <div className="icon-50 p-1 rounded-circle border bg-white me-3 overflow-hidden">
                                        <img
                                            src={admin.image || "/crm-skybridge/images/fav.png"}
                                            alt={admin.name}
                                            className="img-contain h-100 w-100 rounded-circle"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-muted fsz-11 text-uppercase d-block mb-0">Profile</label>
                                        <div className="fsz-14 fw-600">{admin.name}</div>
                                    </div>
                                </div>

                                <div className="detail-item py-3 px-4 border rounded-3 grow-1">
                                    <label className="text-muted fsz-12 text-uppercase d-block mb-2">Position / Role</label>
                                    <div className="fsz-14 fw-500">
                                        <i className="fal fa-user-shield me-2 text-primary"></i>
                                        <span className={`fw-600 ${admin.role === 'Super Admin' ? 'text-danger' : admin.role === 'Admin' ? 'text-primary' : 'text-info'}`}>
                                            {admin.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="detail-item py-3 px-4 border rounded-3 grow-1">
                                    <label className="text-muted fsz-12 text-uppercase d-block mb-2">Email Address</label>
                                    <div className="fsz-14 fw-500">
                                        <i className="fal fa-envelope me-2 text-primary"></i>
                                        {admin.email || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item py-3 px-4 border rounded-3 grow-1">
                                    <label className="text-muted fsz-12 text-uppercase d-block mb-2">Phone Number</label>
                                    <div className="fsz-14 fw-500">
                                        <i className="fal fa-phone me-2 text-primary"></i>
                                        {admin.phone || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item py-3 px-4 border rounded-3 grow-1">
                                    <label className="text-muted fsz-12 text-uppercase d-block mb-2">Created On</label>
                                    <div className="fsz-14 fw-500">
                                        <i className="fal fa-calendar-alt me-2 text-primary"></i>
                                        {admin.created_at || "N/A"}
                                    </div>
                                </div>
                            </div>

                            {/* Permissions Section */}
                            <div className="permissions-details">
                                <h6 className="fsz-14 mb-2 pb-2">
                                    <i className="fal fa-lock-alt me-2 text-primary"></i>
                                    Assigned Permissions
                                </h6>

                                {Object.keys(groupedPermissions).length > 0 ? (
                                    <div className="modules-list">
                                        {Object.entries(groupedPermissions).map(([moduleName, perms]) => (
                                            <div key={moduleName} className="module-group mb-2 p-3 border rounded-3">
                                                <div className="border-bottom fsz-13 pb-2 mb-3 text-dark">{moduleName}</div>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {perms.map(p => (
                                                        <span key={p} className="bg-white text-dark border fsz-11 py-2 px-3 rounded-pill">
                                                            {p}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-3 bg-light rounded-3 border">
                                        <span className="text-muted fsz-12">No permissions assigned</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <i className="fal fa-spinner fa-spin fa-2x mb-3"></i>
                            <p>Loading admin details...</p>
                        </div>
                    )}
                </div>
            </div>
            {show && (
                <div
                    className="offcanvas-backdrop fade show"
                    onClick={onClose}
                ></div>
            )}
        </>
    );
}
