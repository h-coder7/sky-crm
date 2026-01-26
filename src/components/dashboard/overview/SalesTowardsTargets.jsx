"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import SearchableSelect from "@/components/shared/SearchableSelect";

// Use dynamic import for ApexCharts to avoid SSR issues in Next.js
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function SalesTowardsTargets() {
    const [series] = useState([75]); // 75% towards target
    const [period, setPeriod] = useState("monthly");

    const periodOptions = [
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
        { value: "yearly", label: "Yearly" },
    ];

    const [options] = useState({
        // ... (rest of options)
        chart: {
            height: 350,
            type: 'radialBar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 225,
                hollow: {
                    margin: 0,
                    size: '70%',
                    background: '#fff',
                    image: undefined,
                    imageOffsetX: 0,
                    imageOffsetY: 0,
                    position: 'front',
                    dropShadow: {
                        enabled: true,
                        top: 3,
                        left: 0,
                        blur: 4,
                        opacity: 0.24
                    }
                },
                track: {
                    background: '#f2f2f2',
                    strokeWidth: '67%',
                    margin: 0, // margin is in pixels
                    dropShadow: {
                        enabled: true,
                        top: -3,
                        left: 0,
                        blur: 4,
                        opacity: 0.35
                    }
                },

                dataLabels: {
                    show: true,
                    name: {
                        offsetY: -10,
                        show: true,
                        color: '#888',
                        fontSize: '17px'
                    },
                    value: {
                        formatter: function (val) {
                            return parseInt(val) + "%";
                        },
                        color: '#111',
                        fontSize: '36px',
                        show: true,
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: ['#ABE5A1'],
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
            }
        },
        stroke: {
            lineCap: 'round'
        },
        labels: ['Sales Target'],
    });

    return (
        <div className="card border radius-15 p-4">
            <div className="card-body">
                <div className="card-title pb-1 mb-3 border-bottom">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h5 className="card-title mb-0">Sales Towards Targets</h5>
                        <div style={{ minWidth: "120px" }}>
                            <SearchableSelect
                                options={periodOptions}
                                value={period}
                                onChange={setPeriod}
                                isClearable={false}
                            />
                        </div>
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <div id="chart">
                            <Chart options={options} series={series} type="radialBar" height={350} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="p-3">
                            <div className="mb-4">
                                <h2 className="fw-bold mb-1">$45,285.00</h2>
                                <p className="text-muted mb-0">Current Sales Volume</p>
                            </div>
                            <div className="mb-4">
                                <h4 className="text-success fw-bold mb-1">$60,000.00</h4>
                                <p className="text-muted mb-0">Target Sales Volume</p>
                            </div>
                            <div className="progress rounded-pill mb-2" style={{ height: '8px' }}>
                                <div className="progress-bar bg-success" role="progressbar" style={{ width: '75%' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <small className="text-muted">You are <span className="text-success fw-bold">75%</span> towards your goal. Keep it up!</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
