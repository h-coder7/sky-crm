"use client";

import Image from "next/image";

export default function StatisticsSection() {
    return (
        <div className="statics-sec pt-0">
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
    );
}
