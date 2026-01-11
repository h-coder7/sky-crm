"use client";

import Image from "next/image";

export default function TitleWrapper() {
    return (
        <div className="title-wrapper">
            <div className="row align-items-center justify-content-between">
                <div className="col-lg-4">
                    <div className="form-group position-relative">
                        <input type="text" className="form-control" placeholder="Search" />
                        <button className="border-0 bg-transparent position-absolute top-50 translate-middle-y znd-10 end-0 me-2"> <i className="fal fa-search"></i> </button>
                    </div>
                </div>

                <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                    <div className="title-aside d-flex justify-content-lg-end mt-4 mt-lg-0 align-items-center">
                        <div className="dropdown ms-2">
                            <button className="btn bg-transparent border-0 p-0 dropdown-toggle after-none fsz-14" type="button" data-bs-toggle="dropdown" aria-expanded="false" > <span className="txt"> Super Admin </span> <i className="fas fa-angle-down ms-2"></i> </button>
                            <ul className="dropdown-menu">
                                <li>
                                    <button className="dropdown-item" type="button">
                                        <i className="fal fa-sign-out me-1"></i> Sign Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
