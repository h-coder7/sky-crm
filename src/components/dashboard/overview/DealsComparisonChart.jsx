"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamic import for ApexCharts to handle SSR properly
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// =======================
// Original Data
// =======================
const FULL_CATEGORIES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const FULL_WON = [7, 5, 6, 8, 10, 9, 12, 6, 8, 7, 9, 11];
const FULL_LOST = [3, 4, 2, 5, 4, 6, 3, 5, 4, 3, 5, 4];

const MOBILE_CATEGORIES = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];
const MOBILE_WON = [7, 6, 10, 12, 8, 9];
const MOBILE_LOST = [3, 2, 4, 3, 4, 5];

export default function DealsComparisonChart() {
    const [series, setSeries] = useState([
        { name: "Won Deals", data: FULL_WON },
        { name: "Lost Deals", data: FULL_LOST }
    ]);

    const [options, setOptions] = useState({
        chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 5,
                borderRadiusApplication: 'around',
                borderRadiusWhenStacked: 'last',
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: FULL_CATEGORIES,
        },
        yaxis: {
            title: {
                text: 'Number of Deals'
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
        },
        fill: {
            opacity: 1
        },
        colors: ["#59f49aff", "#ff8a65"],
        grid: {
            borderColor: '#f1f1f1',
        },
        tooltip: {
            y: {
                formatter: (val) => `${val} Deals`
            }
        }
    });

    // =======================
    // Responsive Logic
    // =======================
    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 768;

            setSeries([
                {
                    name: "Won Deals",
                    data: isMobile ? MOBILE_WON : FULL_WON
                },
                {
                    name: "Lost Deals",
                    data: isMobile ? MOBILE_LOST : FULL_LOST
                }
            ]);

            setOptions(prev => ({
                ...prev,
                xaxis: {
                    categories: isMobile ? MOBILE_CATEGORIES : FULL_CATEGORIES
                },
                plotOptions: {
                    bar: {
                        ...prev.plotOptions.bar,
                        columnWidth: isMobile ? '70%' : '55%',
                    }
                }
            }));
        };

        handleResize(); // on mount
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="card border-0 radius-15 p-4 mt-4">
            <div className="card-title py-2 pb-1 border-bottom">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5 className="mb-0 fsz-18">Won Deals & Lost Deals</h5>
                </div>
            </div>

            <div className="card-body">
                <Chart
                    options={options}
                    series={series}
                    type="bar"
                    height={350}
                />
            </div>
        </div>
    );
}
