"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function ContactListModal({ show, onClose, onSave, contact = null }) {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    top_customer: false,
    decision_maker_status: "",
    status: "New Lead",
    employee: "",
    country: "",
    company: "",
    budget: "",
    avg_stands_year: "",
    avg_events_year: "",
    company_website_url: "",
    job_title: "",
    sector: "",
    notes: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        address: contact.address || "",
        phone: contact.phone || "",
        email: contact.email || "",
        top_customer: contact.top_customer || false,
        decision_maker_status: contact.decision_maker_status || "",
        status: contact.status || "New Lead",
        employee: contact.employee || "",
        country: contact.country || "",
        company: contact.company || "",
        budget: contact.budget || "",
        avg_stands_year: contact.avg_stands_year || "",
        avg_events_year: contact.avg_events_year || "",
        company_website_url: contact.company_website_url || "",
        job_title: contact.job_title || "",
        sector: contact.sector || "",
        notes: contact.notes || "",
      });
    } else {
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        top_customer: false,
        decision_maker_status: "",
        status: "New Lead",
        employee: "",
        country: "",
        company: "",
        budget: "",
        avg_stands_year: "",
        avg_events_year: "",
        company_website_url: "",
        job_title: "",
        sector: "",
        notes: "",
      });
    }
  }, [contact, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
                {contact ? "Edit Contact" : "Add New Contact"}
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
                  {/* Name */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">Name *</label>
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

                  {/* Email */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Address */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Company */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="company" className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-control"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Job Title */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="job_title" className="form-label">Job Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="job_title"
                      name="job_title"
                      value={formData.job_title}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Country */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="country" className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Sector */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="sector" className="form-label">Sector</label>
                    <input
                      type="text"
                      className="form-control"
                      id="sector"
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Status */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      className="form-select form-control"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="New Lead">New Lead</option>
                      <option value="1st Contact Done">1st Contact Done</option>
                      <option value="2nd Contact Done">2nd Contact Done</option>
                      <option value="Follow - Up">Follow - Up</option>
                      <option value="Meeting Scheduled">Meeting Scheduled</option>
                      <option value="Brief Received">Brief Received</option>
                      <option value="Proposal Submitted">Proposal Submitted</option>
                      <option value="Comments Received">Comments Received</option>
                      <option value="Quotation Submitted">Quotation Submitted</option>
                      <option value="Revising Quotation">Revising Quotation</option>
                      <option value="Final Proposal & Quotation Submitted">Final Proposal & Quotation Submitted</option>
                      <option value="Project Won">Project Won</option>
                      <option value="Project Lost">Project Lost</option>
                    </select>
                  </div>

                  {/* Employee */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="employee" className="form-label">Employee</label>
                    <select
                      className="form-select form-control"
                      id="employee"
                      name="employee"
                      value={formData.employee}
                      onChange={handleChange}
                    >
                      <option value="">Select Employee</option>
                      <option value="SKB Test">SKB Test</option>
                      <option value="Esslam Emad">Esslam Emad</option>
                      <option value="omar ibrahim elhosseny">omar ibrahim elhosseny</option>
                      <option value="Houssen Salman">Houssen Salman</option>
                      <option value="omar">omar</option>
                      <option value="Sedra Quraid">Sedra Quraid</option>
                      <option value="Christina Skentos">Christina Skentos</option>
                      <option value="Pretti Nayak">Pretti Nayak</option>
                      <option value="Nourel Moulay">Nourel Moulay</option>
                      <option value="Moustafa Sayed">Moustafa Sayed</option>
                    </select>
                  </div>

                  {/* Budget */}
                  <div className="col-md-4 mb-3">
                    <label htmlFor="budget" className="form-label">Budget</label>
                    <input
                      type="text"
                      className="form-control"
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Avg Stands/Year */}
                  <div className="col-md-4 mb-3">
                    <label htmlFor="avg_stands_year" className="form-label">Avg Stands/Year</label>
                    <input
                      type="text"
                      className="form-control"
                      id="avg_stands_year"
                      name="avg_stands_year"
                      value={formData.avg_stands_year}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Avg Events/Year */}
                  <div className="col-md-4 mb-3">
                    <label htmlFor="avg_events_year" className="form-label">Avg Events/Year</label>
                    <input
                      type="text"
                      className="form-control"
                      id="avg_events_year"
                      name="avg_events_year"
                      value={formData.avg_events_year}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Company Website URL */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="company_website_url" className="form-label">Company Website URL</label>
                    <input
                      type="url"
                      className="form-control"
                      id="company_website_url"
                      name="company_website_url"
                      value={formData.company_website_url}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Decision Maker Status */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="decision_maker_status" className="form-label">Decision Maker Status</label>
                    <select
                      className="form-select form-control"
                      id="decision_maker_status"
                      name="decision_maker_status"
                      value={formData.decision_maker_status}
                      onChange={handleChange}
                    >
                      <option value="">Select Status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* Top Customer */}
                  <div className="col-12 mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="top_customer"
                        name="top_customer"
                        checked={formData.top_customer}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="top_customer">
                        Top Customer
                      </label>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="col-12 mb-3">
                    <label htmlFor="notes" className="form-label">Notes</label>
                    <textarea
                      className="form-control"
                      id="notes"
                      name="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={handleChange}
                    />
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
                  {contact ? "Update" : "Save"}
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
