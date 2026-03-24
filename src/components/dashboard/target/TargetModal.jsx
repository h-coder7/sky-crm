"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Select from "react-select";
import { useEmployees } from "@/hooks/useEmployees";
import { useProducts } from "@/hooks/useProducts";

const LENGTH_OPTIONS = [
    { value: "Select All Year", label: "Select All Year" },
    { value: "First Quarter", label: "First Quarter" },
    { value: "Second Quarter", label: "Second Quarter" },
    { value: "Third Quarter", label: "Third Quarter" },
    { value: "Fourth Quarter", label: "Fourth Quarter" },
];

export default function TargetModal({ show, onClose, onSave, target = null }) {
    const { data: employees = [] } = useEmployees();
    const { data: products = [] } = useProducts();

    const employeeOptions = employees.map(e => ({ value: e.name, label: e.name }));
    const productOptions = products.map(p => ({ value: p.title, label: p.title }));

    const [isMounted, setIsMounted] = useState(false);
    const [formData, setFormData] = useState({
        employee: "",
        product: [], // Now an array for multi-select
        year: "",
        length: [], // Now an array for multiple selection
        values: "",
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (target) {
            setFormData({
                employee: target.employee || "",
                year: target.year || "",
                product: target.product ? target.product.split(", ") : [],
                length: target.length ? target.length.split(", ") : [],
                values: target.values || "",
            });
        } else {
            setFormData({
                employee: "",
                year: "",
                product: [],
                length: [],
                values: "",
            });
        }
    }, [target, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLengthToggle = (val) => {
        setFormData((prev) => {
            let newList = [...prev.length];
            const quarters = LENGTH_OPTIONS.filter(o => o.value !== "Select All Year").map(o => o.value);

            if (val === "Select All Year") {
                const isAllSelected = quarters.every(q => newList.includes(q));
                if (isAllSelected) {
                    newList = [];
                } else {
                    newList = LENGTH_OPTIONS.map(o => o.value);
                }
            } else {
                if (newList.includes(val)) {
                    newList = newList.filter(i => i !== val && i !== "Select All Year");
                } else {
                    newList.push(val);
                    const isAllQuartersSelected = quarters.every(q => newList.includes(q));
                    if (isAllQuartersSelected) {
                        newList.push("Select All Year");
                    }
                }
            }
            return { ...prev, length: newList };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            product: formData.product.join(", "),
            length: formData.length.join(", ")
        };
        onSave(submissionData);
    };

    if (!show || !isMounted) return null;

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
                                {target ? "Edit Target" : "Add Target"}
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
                                    {/* --- Group 1: Target Details --- */}
                                    <div className="col-12 mb-4">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Target Details</h6>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label className="form-label">Employee</label>
                                                <Select
                                                    instanceId="target-employee-select"
                                                    options={employeeOptions}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Employee..."
                                                    isClearable
                                                    value={employeeOptions.find(o => o.value === formData.employee) || null}
                                                    onChange={(o) => setFormData(p => ({ ...p, employee: o ? o.value : "" }))}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Year</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="year"
                                                    value={formData.year}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-12 mt-3">
                                                <label className="form-label">Product</label>
                                                <Select
                                                    instanceId="target-product-select"
                                                    options={productOptions}
                                                    isMulti
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Products..."
                                                    isClearable
                                                    value={productOptions.filter(o => formData.product.includes(o.value))}
                                                    onChange={(opts) => setFormData(p => ({ 
                                                        ...p, 
                                                        product: opts ? opts.map(o => o.value) : [] 
                                                    }))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Group 2: Target Duration --- */}
                                    <div className="col-12 mb-4">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Target Duration</h6>
                                        <div className="row">
                                            <div className="col-12">
                                                <label className="form-label">Length</label>
                                                <div className="d-flex flex-wrap gap-3 p-3 rounded-3 bg-white">
                                                    {LENGTH_OPTIONS.map((opt) => (
                                                        <div key={opt.value} className="form-check">
                                                            <input
                                                                className="form-check-input custom-check"
                                                                type="checkbox"
                                                                id={`check-${opt.value.replace(/\s+/g, "-")}`}
                                                                checked={formData.length.includes(opt.value)}
                                                                onChange={() => handleLengthToggle(opt.value)}
                                                            />
                                                            <label
                                                                className="form-check-label fsz-12 fw-500 cursor-pointer"
                                                                htmlFor={`check-${opt.value.replace(/\s+/g, "-")}`}
                                                            >
                                                                {opt.label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Group 3: Target Metric --- */}
                                    <div className="col-12 mb-4">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Target Metric</h6>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label className="form-label">Values</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="values"
                                                    value={formData.values}
                                                    onChange={handleChange}
                                                    required
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
                                <button type="submit" className="butn-st2 butn-md">
                                    {target ? "Update" : "Save"}
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
