"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Select from "react-select";

export default function DailyLogModal({ show, onClose, onSave, log = null }) {
    const [isMounted, setIsMounted] = useState(false);
    const [formData, setFormData] = useState({
        employee: "",
        contact_list: "",
        job_title: "",
        company: "",
        date: "",
        type: "",
        objective: "",
        estimated_sale: "",
        contact_status: "",
        next_action: "",
        next_contact: "",
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const typeOptions = [
        { value: "Phone call", label: "Phone call" },
        { value: "Zoom meeting", label: "Zoom meeting" },
        { value: "Face to face", label: "Face to face" },
        { value: "Email", label: "Email" },
        { value: "Linkedin message", label: "Linkedin message" },
        { value: "Acquaintance", label: "Acquaintance" },
    ];

    const objectiveOptions = [
        { value: "Conference/Seminar", label: "Conference/Seminar" },
        { value: "Product launch", label: "Product launch" },
        { value: "Corporate teambuilding", label: "Corporate teambuilding" },
        { value: "Exhibition", label: "Exhibition" },
        { value: "Workshops", label: "Workshops" },
        { value: "Graduation", label: "Graduation" },
        { value: "Round table meeting", label: "Round table meeting" },
        { value: "Celebration", label: "Celebration" },
        { value: "Public Event", label: "Public Event" },
        { value: "Other", label: "Other" },
    ];

    const nextActionOptions = [
        { value: "Meeting", label: "Meeting" },
        { value: "Pitch", label: "Pitch" },
        { value: "Call", label: "Call" },
        { value: "Follow-up", label: "Follow-up" },
    ];

    useEffect(() => {
        if (log) {
            setFormData({
                employee: log.employee || "",
                contact_list: log.contact_list || "",
                job_title: log.job_title || "",
                company: log.company || "",
                date: log.date || "",
                type: log.type || "",
                objective: log.objective || "",
                estimated_sale: log.estimated_sale || "",
                contact_status: log.contact_status || "",
                next_action: log.next_action || "",
                next_contact: log.next_contact || "",
            });
        } else {
            setFormData({
                employee: "",
                contact_list: "",
                job_title: "",
                company: "",
                date: new Date().toISOString().split("T")[0],
                type: "",
                objective: "",
                estimated_sale: "",
                contact_status: "",
                next_action: "",
                next_contact: "",
            });
        }
    }, [log, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, selectedOption) => {
        setFormData((prev) => ({ ...prev, [name]: selectedOption ? selectedOption.value : "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!show || !isMounted) return null;

    return createPortal(
        <>
            <div className="modal-backdrop fade show" onClick={onClose}></div>
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {log ? "Edit Daily Log" : "Add Daily Log"}
                            </h5>
                            <button type="button" className="btn-close fsz-12" onClick={onClose}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body p-4">
                                <div className="row">
                                    {/* --- Group 1: Identity & Case --- */}
                                    <div className="col-12 mb-4">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Identity & Case</h6>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fsz-12">Employee</label>
                                                <input type="text" className="form-control" name="employee" value={formData.employee} onChange={handleChange} required />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fsz-12">Contact List</label>
                                                <input type="text" className="form-control" name="contact_list" value={formData.contact_list} onChange={handleChange} required />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fsz-12">Job Title</label>
                                                <input type="text" className="form-control" name="job_title" value={formData.job_title} onChange={handleChange} required />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fsz-12">Company</label>
                                                <input type="text" className="form-control" name="company" value={formData.company} onChange={handleChange} required />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Group 2: Log Details --- */}
                                    <div className="col-12 mb-4">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Log Details</h6>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fsz-12">Date</label>
                                                <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fsz-12">Type</label>
                                                <Select
                                                    instanceId="daily-log-type-select"
                                                    options={typeOptions}
                                                    value={typeOptions.find(opt => opt.value === formData.type)}
                                                    onChange={(val) => handleSelectChange("type", val)}
                                                    placeholder="Select Type"
                                                    classNamePrefix="react-select"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fsz-12">Objective</label>
                                                <Select
                                                    instanceId="daily-log-objective-select"
                                                    options={objectiveOptions}
                                                    value={objectiveOptions.find(opt => opt.value === formData.objective)}
                                                    onChange={(val) => handleSelectChange("objective", val)}
                                                    placeholder="Select Objective"
                                                    classNamePrefix="react-select"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fsz-12">Estimated Sale</label>
                                                <input type="number" className="form-control" name="estimated_sale" value={formData.estimated_sale} onChange={handleChange} required />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Group 3: Status --- */}
                                    <div className="col-12 mb-4">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Status</h6>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fsz-12">Contact Status</label>
                                                <input type="text" className="form-control" name="contact_status" value={formData.contact_status} onChange={handleChange} required />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Group 4: Follow-up --- */}
                                    <div className="col-12 mb-4">
                                        <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Follow-up</h6>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fsz-12">Next Action</label>
                                                <Select
                                                    instanceId="daily-log-next-action-select"
                                                    options={nextActionOptions}
                                                    value={nextActionOptions.find(opt => opt.value === formData.next_action)}
                                                    onChange={(val) => handleSelectChange("next_action", val)}
                                                    placeholder="Select Next Action"
                                                    classNamePrefix="react-select"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fsz-12">Next Contact</label>
                                                <input type="date" className="form-control" name="next_contact" value={formData.next_contact} onChange={handleChange} required />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer p-3 border-top-0">
                                <button type="button" className="butn-st2 butn-md line-butn me-2" onClick={onClose}>Close</button>
                                <button type="submit" className="butn-st2 butn-md">{log ? "Update" : "Save"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
