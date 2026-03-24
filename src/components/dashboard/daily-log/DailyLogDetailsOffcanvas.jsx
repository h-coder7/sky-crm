"use client";

import { useEffect, useState } from "react";

export default function DailyLogDetailsOffcanvas({ show, log, onClose }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <div
        className={`offcanvas offcanvas-end border-0 shadow ${show ? "show" : ""}`}
        tabIndex="-1"
        id="dailyLogDetailsOffcanvas"
        aria-labelledby="dailyLogDetailsOffcanvasLabel"
        style={{ visibility: show ? "visible" : "hidden", width: "500px" }}
      >
        <div className="offcanvas-header border-bottom py-3">
          <h5 className="offcanvas-title fsz-16" id="dailyLogDetailsOffcanvasLabel">
            <i className="fal fa-calendar-alt me-2"></i> Daily Log Details
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body p-4 custom-scroll">
          {log ? (
            <div className="daily-log-details">
              <div className="text-center mb-4">
                <div className="icon-60 rounded-circle border mx-auto mb-3 bg-light d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                  <i className="fas fa-clipboard-list fa-2x text-muted"></i>
                </div>
                <h6 className="fsz-18 mb-1">{log.employee}</h6>
                <span className="badge bg-primary-soft text-primary border border-primary-soft fsz-11 text-uppercase">{log.type}</span>
              </div>

              <div className="details-list mb-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Employee</label>
                      <div className="fsz-14 fw-500">{log.employee}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Date</label>
                      <div className="fsz-14 fw-500">{log.date}</div>
                    </div>
                  </div>

                  <div className="col-12 pt-2 border-top">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Company</label>
                      <div className="fsz-14 fw-600">{log.company}</div>
                    </div>
                  </div>

                  <div className="col-md-6 pt-2 border-top">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Job Title</label>
                      <div className="fsz-14 fw-500">{log.job_title}</div>
                    </div>
                  </div>
                  <div className="col-md-6 pt-2 border-top">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Contact List</label>
                      <div className="fsz-14 fw-500">{log.contact_list}</div>
                    </div>
                  </div>

                  <div className="col-12 pt-2 border-top">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Objective</label>
                      <div className="fsz-14 fw-500">{log.objective}</div>
                    </div>
                  </div>

                  <div className="col-md-6 pt-2 border-top">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Estimated Sale</label>
                      <div className="fsz-16 fw-600 text-success">{log.estimated_sale}</div>
                    </div>
                  </div>
                  <div className="col-md-6 pt-2 border-top">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Contact Status</label>
                      <div className="fsz-14 fw-500">{log.contact_status}</div>
                    </div>
                  </div>

                  <div className="col-md-6 pt-3 border-top bg-light p-3 rounded-start">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1 text-primary">Next Action</label>
                      <div className="fsz-14 fw-600">{log.next_action}</div>
                    </div>
                  </div>
                  <div className="col-md-6 pt-3 border-top bg-light p-3 rounded-end">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1 text-primary">Next Contact</label>
                      <div className="fsz-14 fw-600">{log.next_contact}</div>
                    </div>
                  </div>

                  <div className="col-12 pt-3 border-top text-end">
                    <div className="detail-item">
                      <label className="text-muted fsz-11 text-uppercase d-block mb-1">Created On</label>
                      <div className="fsz-12">
                        {log.created_at ? new Date(log.created_at).toLocaleString() : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="fal fa-spinner fa-spin fa-2x mb-3"></i>
              <p>Loading log details...</p>
            </div>
          )}
        </div>
      </div>
      {show && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={onClose}
          style={{ zIndex: 1040 }}
        ></div>
      )}
    </>
  );
}
