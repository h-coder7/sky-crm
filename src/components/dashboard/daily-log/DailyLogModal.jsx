"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function DailyLogModal({ show, onClose, onSave, log = null }) {
    const [isMounted, setIsMounted] = useState(false);
    const [formData, setFormData] = useState({
        contact_list: "",
        date: "",
        employee: "",
        objective: "",
        type: "",
        estimated_sale: "",
        next_contact: "",
        next_action: "",
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (log) {
            setFormData({
                contact_list: log.contact_list || "",
                date: log.date || "",
                employee: log.employee || "",
                objective: log.objective || "",
                type: log.type || "",
                estimated_sale: log.estimated_sale || "",
                next_contact: log.next_contact || "",
                next_action: log.next_action || "",
            });
        } else {
            setFormData({
                contact_list: "",
                date: "",
                employee: "",
                objective: "",
                type: "",
                estimated_sale: "",
                next_contact: "",
                next_action: "",
            });
        }
    }, [log, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!show || !isMounted) return null;

    return createPortal(
        <>
            <div className="modal-backdrop fade show" onClick={onClose}></div>
            <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => e.target === e.currentTarget && onClose()}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{log ? "Edit Daily Log" : "Add Daily Log"}</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Contact List</label>
                                        <input type="text" className="form-control" name="contact_list" value={formData.contact_list} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Date</label>
                                        <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Employee</label>
                                        <input type="text" className="form-control" name="employee" value={formData.employee} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Objective</label>
                                        <select className="form-select" name="objective" value={formData.objective} onChange={handleChange} required>
                                            <option value="">Select Objective</option>
                                            <option value="Conference/Seminar">Conference/Seminar</option>
                                            <option value="Product launch">Product launch</option>
                                            <option value="Corporate teambuilding">Corporate teambuilding</option>
                                            <option value="Exhibition">Exhibition</option>
                                            <option value="Workshops">Workshops</option>
                                            <option value="Graduation">Graduation</option>
                                            <option value="Round table meeting">Round table meeting</option>
                                            <option value="Celebration">Celebration</option>
                                            <option value="Public Event">Public Event</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Type</label>
                                        <select className="form-select" name="type" value={formData.type} onChange={handleChange} required>
                                            <option value="">Select Type</option>
                                            <option value="Phone call">Phone call</option>
                                            <option value="Zoom meeting">Zoom meeting</option>
                                            <option value="Face to face">Face to face</option>
                                            <option value="Email">Email</option>
                                            <option value="Linkedin message">Linkedin message</option>
                                            <option value="Acquaintance">Acquaintance</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Estimated Sale</label>
                                        <input type="text" className="form-control" name="estimated_sale" value={formData.estimated_sale} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Next Contact</label>
                                        <input type="date" className="form-control" name="next_contact" value={formData.next_contact} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Next Action</label>
                                        <select className="form-select" name="next_action" value={formData.next_action} onChange={handleChange} required>
                                            <option value="">Select Action</option>
                                            <option value="Meeting">Meeting</option>
                                            <option value="Pitch">Pitch</option>
                                            <option value="Call">Call</option>
                                            <option value="Follow-up">Follow-up</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="butn-st2 butn-md line-butn" onClick={onClose}>Close</button>
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
