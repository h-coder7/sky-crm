"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function DealsModal({ show, onClose, onSave, deal = null }) {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    employee: "",
    product: "",
    contact_list: "",
    company: "",
    status: "",
    amount: "",
    month: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || "",
        description: deal.description || "",
        start_date: deal.start_date || "",
        end_date: deal.end_date || "",
        employee: deal.employee || "",
        product: deal.product || "",
        contact_list: deal.contact_list || "",
        company: deal.company || "",
        status: deal.status || "",
        amount: deal.amount || "",
        month: deal.month || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        employee: "",
        product: "",
        contact_list: "",
        company: "",
        status: "",
        amount: "",
        month: "",
      });
    }
  }, [deal, show]);

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
      <div className="modal fade show d-block" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{deal ? "Edit Deal" : "Add New Deal"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Amount</label>
                    <input type="number" className="form-control" name="amount" value={formData.amount} onChange={handleChange} required />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="3"></textarea>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Start Date</label>
                    <input type="date" className="form-control" name="start_date" value={formData.start_date} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">End Date</label>
                    <input type="date" className="form-control" name="end_date" value={formData.end_date} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Employee</label>
                    <input type="text" className="form-control" name="employee" value={formData.employee} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product</label>
                    <input type="text" className="form-control" name="product" value={formData.product} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Contact List</label>
                    <input type="text" className="form-control" name="contact_list" value={formData.contact_list} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Company</label>
                    <input type="text" className="form-control" name="company" value={formData.company} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select form-control" name="status" value={formData.status} onChange={handleChange} required>
                      <option value="">Select Status</option>
                      <option value="1">Brief Submitted</option>
                      <option value="2">Amending Brief</option>
                      <option value="3">Moodboard Requested</option>
                      <option value="4">Moodboard Submitted</option>
                      <option value="5">Amending Moodboard</option>
                      <option value="6">3D Render Requested</option>
                      <option value="7">Proposal Submitted</option>
                      <option value="8">Amending Proposal</option>
                      <option value="9">Quotation Requested</option>
                      <option value="10">Quotation Submitted</option>
                      <option value="11">Confirmed</option>
                      <option value="12">Rejected</option>
                      <option value="13">Payment Received</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Month</label>
                    <select className="form-select form-control" name="month" value={formData.month} onChange={handleChange} required>
                      <option value="">Select Month</option>
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="butn-st2 butn-md line-butn" onClick={onClose}>Close</button>
                <button type="submit" className="butn-st2 butn-md">{deal ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
