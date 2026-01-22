"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import api from "@/app/api/api";

// Dynamic import for ApexCharts to handle SSR properly
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function LeadConversionChart() {
    const [series, setSeries] = useState([
        {
            name: "Conversion Rate (%)",
            data: [45, 52, 38, 65, 72, 58, 80, 75, 68, 82, 78, 85],
        }
    ]);

    const [options] = useState({
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 10,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val + "%";
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#26b562"] // Darker Green for readability
            }
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        yaxis: {
            title: {
                text: 'Conversion Rate (%)'
            },
            max: 100
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: "vertical",
                shadeIntensity: 0.25,
                gradientToColors: ["#2DD975"], // Brand Green
                inverseColors: false,
                opacityFrom: 0.85,
                opacityTo: 0.55,
                stops: [0, 90, 100]
            },
        },
        colors: ["#2DD975"], // Base color (Brand Green)
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + "%"
                }
            }
        },
        grid: {
            borderColor: '#f1f1f1',
        }
    });

    /* ======================================================================
       🔌 API READY: Laravel Integration
       ====================================================================== */
    /*
    useEffect(() => {
        const fetchConversionData = async () => {
            try {
                const res = await api.get('/charts/lead-conversion');
                const data = res.data; // Expected format: [45, 52, ...]
                
                setSeries([{
                    name: "Conversion Rate (%)",
                    data: data
                }]);
            } catch (error) {
                console.error("Failed to fetch conversion data:", error);
            }
        };

        fetchConversionData();
    }, []);
    */

    return (
        <div className="card border-0 radius-15 p-4 mb-5 mt-5">
            <div className="card-body">
                <div className="card-title pb-1 mb-3 border-bottom">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h5 className="card-title mb-0">Lead Conversion Rate</h5>
                        {/* <div className="dropdown">
                            <button className="btn btn-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                Monthly
                            </button>
                            <ul className="dropdown-menu">
                                <li><button className="dropdown-item">Monthly</button></li>
                                <li><button className="dropdown-item">Yearly</button></li>
                            </ul>
                        </div> */}
                    </div>
                </div>
                <div id="chart">
                    <Chart options={options} series={series} type="bar" height={350} />
                </div>
            </div>
        </div>
    );
}
