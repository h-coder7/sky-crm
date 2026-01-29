"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";

export default function SettingsClient() {
    const [formData, setFormData] = useState({
        websiteName: "CMS",
        keywords: "WR8P1tSli3jz7io7",
        metaDescription: "6AXT8i5B1OOybOHR",
        mailDriver: "smtp",
        mailHost: "skybridgeworld.com",
        mailPort: "587",
        mailUsername: "notification.crm@skybridgeworld.com",
        mailPassword: "",
        mailEncryption: "tls",
        mailFromAddress: "info@cms.com",
        mailFromName: "CMS",
        websitePhone: "123456789",
        websiteEmail: "info@cms.com",
    });

    const [activeTab, setActiveTab] = useState("website");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const modules = [
        "Statistics", "Admins", "Employees", "Sector", "Countries",
        "Contact Lists", "Deals", "Companies", "Products",
        "Targets", "Categories", "Daily Logs", "Regions", "Settings"
    ];

    const tabs = [
        { id: "website", label: "Website Configuration", icon: "fal fa-globe" },
        { id: "mail", label: "Mail Configuration (SMTP)", icon: "fal fa-envelope" },
        { id: "videos", label: "Intro Videos Configuration", icon: "fal fa-video" },
    ];

    return (
        <>
            <PageHeader title="Settings" icon="fal fa-gear" />

            <div className="row mt-4">
                <div className="col-lg-12">
                    {/* --- Bootstrap Tabs Navigation --- */}
                    <ul className="nav nav-tabs mb-4" id="settingsTabs" role="tablist">
                        {tabs.map((tab) => (
                            <li className="nav-item" role="presentation" key={tab.id}>
                                <button
                                    className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab.id)}
                                    type="button"
                                    role="tab"
                                >
                                    <i className={`${tab.icon} me-2`}></i>
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="table-content p-4 mt-0">
                        <form>
                            {/* --- WEBSITE INFO --- */}
                            {activeTab === "website" && (
                                <div className="tab-pane fade show active">
                                    <h6 className="mb-4 cr-blue d-flex align-items-center gap-2">
                                        <i className="fal fa-globe fsz-14"></i>
                                        Website Configuration
                                    </h6>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fsz-12 text-muted">Website Name</label>
                                            <input type="text" className="form-control" name="websiteName" value={formData.websiteName} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fsz-12 text-muted">Keywords</label>
                                            <input type="text" className="form-control" name="keywords" value={formData.keywords} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fsz-12 text-muted">Meta Description</label>
                                            <input type="text" className="form-control" name="metaDescription" value={formData.metaDescription} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label fsz-12 text-muted">Website Phone</label>
                                            <input type="text" className="form-control" name="websitePhone" value={formData.websitePhone} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label fsz-12 text-muted">Website Email</label>
                                            <input type="email" className="form-control" name="websiteEmail" value={formData.websiteEmail} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- MAIL SETTINGS --- */}
                            {activeTab === "mail" && (
                                <div className="tab-pane fade show active">
                                    <h6 className="mb-4 cr-blue d-flex align-items-center gap-2">
                                        <i className="fal fa-envelope fsz-14"></i>
                                        Mail Configuration (SMTP)
                                    </h6>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label fsz-12 text-muted">Mail Driver</label>
                                            <input type="text" className="form-control" name="mailDriver" value={formData.mailDriver} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fsz-12 text-muted">Mail Host</label>
                                            <input type="text" className="form-control" name="mailHost" value={formData.mailHost} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fsz-12 text-muted">Mail Port</label>
                                            <input type="text" className="form-control" name="mailPort" value={formData.mailPort} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fsz-12 text-muted">Mail Username</label>
                                            <input type="text" className="form-control" name="mailUsername" value={formData.mailUsername} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fsz-12 text-muted">Mail Password</label>
                                            <input type="password" className="form-control" name="mailPassword" placeholder="••••••••••••••••" onChange={handleChange} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fsz-12 text-muted">Mail Encryption</label>
                                            <input type="text" className="form-control" name="mailEncryption" value={formData.mailEncryption} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fsz-12 text-muted">Mail From Address</label>
                                            <input type="email" className="form-control" name="mailFromAddress" value={formData.mailFromAddress} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fsz-12 text-muted">Mail From Name</label>
                                            <input type="text" className="form-control" name="mailFromName" value={formData.mailFromName} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- VIDEO INTRODUCTIONS --- */}
                            {activeTab === "videos" && (
                                <div className="tab-pane fade show active">
                                    <h6 className="mb-4 cr-blue d-flex align-items-center gap-2">
                                        <i className="fal fa-video fsz-14"></i>
                                        Intro Videos Configuration
                                    </h6>
                                    <div className="row gx-5">
                                        {modules.map((mod) => (
                                            <div className="col-lg-6" key={mod}>
                                                <div className="form-group mb-3">
                                                    <label className="form-label fsz-12 text-muted">Intro {mod} Module Video</label>
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <input type="file" className="form-control" style={{ minHeight: "40px", padding: "12px" }} />
                                                        <button type="button" className="alert alert-info pt-10 pb-10 px-3 fsz-10 border-0 mb-0 rounded-3 flex-shrink-0">
                                                            Show Video
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-5 mb-4 text-center">
                                <button type="submit" className="butn-st2 d-inline-flex align-items-center gap-2 after-none">
                                    <i className="fal fa-check-circle"></i>
                                    <span>Save Settings</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
