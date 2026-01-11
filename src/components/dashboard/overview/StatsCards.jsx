"use client";

import Image from "next/image";

export default function StatisticsSection() {
    return (
        <div className="statics-sec">
            <div className="row">
                {/* Statics */}
                <div className="col-lg-8">
                    <div className="statics">
                        <div className="row">

                            {/* Item */}
                            <div className="col-lg-4">
                                <div className="item">
                                    <div className="icon">
                                        <Image src="/images/icons/st1.svg" alt="" width={40} height={40} />
                                    </div>
                                    <div className="cont">
                                        <div className="text">Total profit</div>
                                        <h5>$29,435.00</h5>
                                        <div className="btm-txt">
                                            <span className="alert alert-success">+0.32%</span>
                                            <span className="txt">Higher than last month</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="item">
                                    <div className="icon">
                                        <Image src="/images/icons/st2.svg" alt="" width={40} height={40} />
                                    </div>
                                    <div className="cont">
                                        <div className="text">Avg Sales</div>
                                        <h5>$29,435.00</h5>
                                        <div className="btm-txt">
                                            <span className="alert alert-danger">-0.12%</span>
                                            <span className="txt">Higher than last month</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="item">
                                    <div className="icon">
                                        <Image src="/images/icons/st3.svg" alt="" width={40} height={40} />
                                    </div>
                                    <div className="cont">
                                        <div className="text">Total Sales</div>
                                        <h5>$29,435.00</h5>
                                        <div className="btm-txt">
                                            <span className="alert alert-success">+0.32%</span>
                                            <span className="txt">Higher than last month</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="item">
                                    <div className="icon">
                                        <Image src="/images/icons/st4.svg" alt="" width={40} height={40} />
                                    </div>
                                    <div className="cont">
                                        <div className="text">Annual Target</div>
                                        <h5>$29,435.00</h5>
                                        <div className="btm-txt">
                                            <span className="alert alert-success">+0.32%</span>
                                            <span className="txt">Higher than last month</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="item">
                                    <div className="icon">
                                        <Image src="/images/icons/st5.svg" alt="" width={40} height={40} />
                                    </div>
                                    <div className="cont">
                                        <div className="text">Communication Rate</div>
                                        <h5>$29,435.00</h5>
                                        <div className="btm-txt">
                                            <span className="alert alert-success">+0.32%</span>
                                            <span className="txt">Higher than last month</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="item">
                                    <div className="icon">
                                        <Image src="/images/icons/st6.svg" alt="" width={40} height={40} />
                                    </div>
                                    <div className="cont">
                                        <div className="text">New Customer</div>
                                        <h5>$29,435.00</h5>
                                        <div className="btm-txt">
                                            <span className="alert alert-success">+0.32%</span>
                                            <span className="txt">Higher than last month</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Performance */}
                <div className="col-lg-4">
                    <div className="preformance-table">
                        <div className="btn-title d-flex align-items-center justify-content-between">
                            <h5>Top performance</h5>
                            <button type="button" className="butn-st2 line-butn butn-md">
                                <span>View All</span>
                            </button>
                        </div>

                        <div className="users">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div className="item" key={item}>
                                    <div className="row align-items-center">
                                        <div className="col-7">
                                            <div className="user-wrapper">
                                                <div className="avatar">
                                                    <Image
                                                        src={`/images/av${item}.png`}
                                                        alt=""
                                                        width={40}
                                                        height={40}
                                                    />
                                                </div>
                                                <div className="inf">
                                                    <h6>Yasmin Ali</h6>
                                                    <small>YasminAli@gmail.com</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-5">
                                            <h6 className="text-end">$9,249.00</h6>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
