"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
// import axios from "axios"; // 🔜 Uncomment when API is ready

export default function StatisticsSection() {
    const [stats, setStats] = useState([
        {
            title: "Average Deal Closing Time",
            value: "14 Days",
            percent: "-12%",
            trend: "Faster than last month",
            icon: "/crm-skybridge/images/icons/st1.svg",
            trendColor: "success"
        },
        {
            title: "Pipeline Value",
            value: "$1,250,500.00",
            percent: "+15.5%",
            trend: "Growing pipeline",
            icon: "/crm-skybridge/images/icons/st2.svg",
            trendColor: "success"
        },
        {
            title: "Best Conversion Communication Type",
            value: "Phone call",
            percent: "45%",
            trend: "Highest conversion",
            icon: "/crm-skybridge/images/icons/st5.svg",
            trendColor: "info"
        }
    ]);

    /* 
    // 🔜 API Integration logic:
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // const res = await axios.get("/api/dashboard/stats");
                // setStats(res.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);
    */

    return (
        <div className="statics-sec pt-0">
            <div className="statics">
                <div className="row">
                    {stats.map((item, index) => (
                        <div className="col-lg-4" key={index}>
                            <div className="item mt-4">
                                <div className="icon">
                                    <Image src={item.icon} alt={item.title} width={40} height={40} />
                                </div>
                                <div className="cont">
                                    <div className="text text-nowrap">{item.title}</div>
                                    <h5 className="mb-2">{item.value}</h5>
                                    <div className="btm-txt d-flex align-items-center gap-2">
                                        <span className={`alert alert-${item.trendColor} py-1 px-2 mb-0 fsz-12 border-0`}>
                                            {item.percent}
                                        </span>
                                        <span className="txt fsz-12 text-muted">{item.trend}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
