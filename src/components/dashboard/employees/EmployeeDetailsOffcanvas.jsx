"use client";

import { useEffect, useState } from "react";
import { useSectors } from "@/hooks/useSectors";

const MODULE_PERMISSIONS = {
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
        "Get Contact lists", "Create Contact list", "Edit Contact list", "Delete & Restore Contact list", "Show Contact list", "Export Contact Lists"
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
        "Show Statistics", "Show Own Statistics", "Export Statistics"
    ],
    "Categories": [
        "Get Categories", "Create Category", "Edit Category", "Delete & Restore Category", "Show Category", "Export Categories"
    ],
    "Daily Log": [
        "Get Logs", "Create Log", "Edit Log", "Delete & Restore Log", "Show Log", "Export Daily Logs"
    ],
    "Regions": [
        "Get Regions", "Create Region", "Edit Region", "Delete & Restore Region", "Export Regions"
    ]
};

export default function EmployeeDetailsOffcanvas({ show, employee, onClose }) {
    const [isMounted, setIsMounted] = useState(false);
    const { data: allSectors = [] } = useSectors();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    // Group selected permissions by module
    const userPermissions = employee?.permissions || [];
    const groupedPermissions = Object.entries(MODULE_PERMISSIONS).reduce((acc, [moduleName, perms]) => {
        const selectedInModule = perms.filter(p => userPermissions.includes(p));
        if (selectedInModule.length > 0) {
            acc[moduleName] = selectedInModule;
        }
        return acc;
    }, {});

    // Resolve sectors (handle both string from mock and ID array from API/future)
    let employeeSectors = [];
    if (typeof employee?.sector === "string" && employee.sector.trim() !== "") {
        // Handle comma-separated string from mock data
        employeeSectors = employee.sector.split(",").map(part => ({
            id: part.trim(),
            title: part.trim()
        }));
    } else if (Array.isArray(employee?.sectors)) {
        // Handle ID array (existing logic)
        employeeSectors = allSectors.filter(s => employee.sectors.includes(s.id));
    }

    return (
        <>
            <div
                className={`offcanvas offcanvas-end border-0 shadow ${show ? "show" : ""}`}
                tabIndex="-1"
                id="employeeDetailsOffcanvas"
                aria-labelledby="employeeDetailsOffcanvasLabel"
                style={{ visibility: show ? "visible" : "hidden" }}
            >
                <div className="offcanvas-header border-bottom py-3">
                    <h5 className="offcanvas-title fsz-16" id="employeeDetailsOffcanvasLabel">
                        <i className="fal fa-user-tie me-2 "></i> Employee Details
                    </h5>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body p-4 custom-scroll">
                    {employee ? (
                        <div className="employee-details">
                            <div className="details-list mb-4 d-flex flex-wrap gap-2">
                                <div className="detail-item d-flex align-items-center w-100 mb-2">
                                    <div>
                                        <label className="text-muted fsz-11 text-uppercase d-block mb-0">Profile</label>
                                        <div className="fsz-14 fw-600 ">{employee.name}</div>
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <label className="text-muted fsz-12 text-uppercase d-block mb-2">Position / Role</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-user-shield me-2"></i>
                                        <span className="fw-500">
                                            {employee.role || "N/A"}
                                        </span>
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <label className="text-muted fsz-12 text-uppercase d-block mb-2">Email Address</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-envelope me-2"></i>
                                        {employee.email || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <label className="text-muted fsz-12 text-uppercase d-block mb-2">Phone Number</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-phone me-2"></i>
                                        {employee.phone || "N/A"}
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <label className="text-muted fsz-12 text-uppercase d-block mb-2">Joined On</label>
                                    <div className="fsz-13">
                                        <i className="fal fa-calendar-alt me-2"></i>
                                        {employee.created_at || "N/A"}
                                    </div>
                                </div>
                            </div>

                            {/* Sectors Section */}
                            <div className="sectors-details mb-4">
                                <h6 className="fsz-13 mb-3 pb-2 border-bottom fw-600">
                                    <i className="fal fa-th-large me-2"></i>
                                    Assigned Sectors
                                </h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {employeeSectors.length > 0 ? (
                                        employeeSectors.map(s => (
                                            <span key={s.id} className="bg-light text-dark border fsz-11 py-2 px-3 rounded-pill">
                                                {s.title}
                                            </span>
                                        ))
                                    ) : (
                                        <div className="text-center py-3 bg-light rounded-3 border w-100">
                                            <span className="text-muted fsz-12">No sectors assigned</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Permissions Section */}
                            <div className="permissions-details">
                                <h6 className="fsz-13 mb-3 pb-2 border-bottom fw-600">
                                    <i className="fal fa-lock-alt me-2"></i>
                                    Module Permissions
                                </h6>

                                {Object.keys(groupedPermissions).length > 0 ? (
                                    <div className="modules-list">
                                        {Object.entries(groupedPermissions).map(([moduleName, perms]) => (
                                            <div key={moduleName} className="module-group mb-2 p-3 border rounded-3 bg-white">
                                                <div className="border-bottom fsz-13 pb-2 mb-3 text-dark fw-600">{moduleName}</div>
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
                                    <div className="text-center py-3 bg-light rounded-3 border w-100">
                                        <span className="text-muted fsz-12">No permissions assigned</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <i className="fal fa-spinner fa-spin fa-2x mb-3"></i>
                            <p>Loading employee details...</p>
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
