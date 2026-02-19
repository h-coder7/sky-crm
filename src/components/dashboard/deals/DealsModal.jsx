"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Select from "react-select";
import FileUpload from "../../shared/FileUpload";
import { useCompanies } from "@/context/CompaniesContext";

const STATUS_OPTIONS = [
  { value: "1", label: "Brief Submitted" },
  { value: "2", label: "Amending Brief" },
  { value: "3", label: "Moodboard Requested" },
  { value: "4", label: "Moodboard Submitted" },
  { value: "5", label: "Amending Moodboard" },
  { value: "6", label: "3D Render Requested" },
  { value: "7", label: "Proposal Submitted" },
  { value: "8", label: "Amending Proposal" },
  { value: "9", label: "Quotation Requested" },
  { value: "10", label: "Quotation Submitted" },
  { value: "11", label: "Confirmed" },
  { value: "12", label: "Rejected" },
  { value: "13", label: "Payment Received" },
];

const SECTOR_OPTIONS = [
  { value: "Real Estate", label: "Real Estate" },
  { value: "Technology", label: "Technology" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Education", label: "Education" },
  { value: "Finance", label: "Finance" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Partial", label: "Partial" },
  { value: "Paid", label: "Paid" },
];

export default function DealsModal({ show, onClose, onSave, deal = null }) {
  const { companies } = useCompanies();
  const COMPANY_OPTIONS = companies.map((c) => ({ value: c.title, label: c.title }));

  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    sector: "",
    company: "",
    contact_list: "",
    employee: "",
    title: "",
    product: "",
    start_date: "",
    end_date: "",
    status: "",
    payment_status: "",
    amount: "",
    description: "",
    file_url: "",
    attachments: [],
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (deal) {
      setFormData({
        sector: deal.sector || "",
        company: deal.company || "",
        contact_list: deal.contact_list || "",
        employee: deal.employee || "",
        title: deal.title || "",
        product: deal.product || "",
        start_date: deal.start_date || "",
        end_date: deal.end_date || "",
        status: deal.status || "",
        payment_status: deal.payment_status || "",
        amount: deal.amount || "",
        description: deal.description || "",
        file_url: deal.file_url || "",
        attachments: deal.file ? [{ preview: deal.file, type: 'application/pdf', name: 'Deal File' }] : [],
      });
    } else {
      setFormData({
        sector: "",
        company: "",
        contact_list: "",
        employee: "",
        title: "",
        product: "",
        start_date: "",
        end_date: "",
        status: "",
        payment_status: "",
        amount: "",
        description: "",
        file_url: "",
        attachments: [],
      });
    }
  }, [deal, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFilesChange = (newFiles) => {
    setFormData((prev) => ({ ...prev, attachments: newFiles }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = { ...formData };

    // Derive month from start_date for DealsMatrix
    if (formData.start_date) {
      const dateParts = formData.start_date.split("-");
      if (dateParts.length === 3) {
        const month = parseInt(dateParts[1]); // 01 -> 1
        submissionData.month = String(month);
      }
    }

    if (formData.attachments && formData.attachments.length > 0) {
      submissionData.file = formData.attachments[0].preview;
    } else {
      submissionData.file = "";
    }
    delete submissionData.attachments;
    onSave(submissionData);
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
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {deal ? "Edit Deal" : "Add New Deal"}
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
                  {/* --- Group 1: General Info --- */}
                  <div className="col-12 mb-4">
                    <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">
                      General Info
                    </h6>
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Sector</label>
                        <Select
                          options={SECTOR_OPTIONS}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          value={SECTOR_OPTIONS.find(
                            (o) => o.value === formData.sector
                          )}
                          onChange={(o) =>
                            setFormData((p) => ({ ...p, sector: o.value }))
                          }
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Company</label>
                        <Select
                          options={COMPANY_OPTIONS}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="Select Company..."
                          isClearable
                          value={COMPANY_OPTIONS.find(
                            (o) => o.value === formData.company
                          ) || null}
                          onChange={(o) =>
                            setFormData((p) => ({ ...p, company: o ? o.value : "" }))
                          }
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Contact list</label>
                        <input
                          type="text"
                          className="form-control"
                          name="contact_list"
                          value={formData.contact_list}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Employee</label>
                        <input
                          type="text"
                          className="form-control"
                          name="employee"
                          value={formData.employee}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- Group 2: Product & Date --- */}
                  <div className="col-12 mb-4">
                    <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">
                      Product & Date
                    </h6>
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Product</label>
                        <input
                          type="text"
                          className="form-control"
                          name="product"
                          value={formData.product}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Start Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="start_date"
                          value={formData.start_date}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">End date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="end_date"
                          value={formData.end_date}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- Group 3: Financials & Status --- */}
                  <div className="col-12 mb-4">
                    <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">
                      Financials & Status
                    </h6>
                    <div className="row">
                      <div className="col-lg-4 mb-3">
                        <label className="form-label">Status</label>
                        <Select
                          options={STATUS_OPTIONS}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          value={STATUS_OPTIONS.find(
                            (o) => o.value === formData.status
                          )}
                          onChange={(o) =>
                            setFormData((p) => ({ ...p, status: o.value }))
                          }
                        />
                      </div>
                      <div className="col-lg-4 mb-3">
                        <label className="form-label">Payment status</label>
                        <Select
                          options={PAYMENT_STATUS_OPTIONS}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          value={PAYMENT_STATUS_OPTIONS.find(
                            (o) => o.value === formData.payment_status
                          )}
                          onChange={(o) =>
                            setFormData((p) => ({
                              ...p,
                              payment_status: o.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-lg-4 mb-3">
                        <label className="form-label">Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          name="amount"
                          value={formData.amount}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- Group 4: Details --- */}
                  <div className="col-12 mb-4">
                    <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">
                      Details
                    </h6>
                    <div className="row">
                      <div className="col-12">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="5"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* --- Group 5: Attachments --- */}
                  <div className="col-12 mb-4">
                    <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">
                      Attachments
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 mb-4">
                        <FileUpload
                          files={formData.attachments}
                          onFilesChange={handleFilesChange}
                          maxFiles={1}
                          title="Deal File"
                          hint="Drop file here or click to upload"
                        />
                      </div>
                      <div className="col-lg-12">
                        <label className="form-label">File URL</label>
                        <input
                          type="url"
                          className="form-control"
                          name="file_url"
                          value={formData.file_url}
                          onChange={handleChange}
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
                  {deal ? "Update" : "Save"}
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

