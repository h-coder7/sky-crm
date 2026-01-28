"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamic import for ApexCharts to handle SSR properly
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DealsComparisonChart() {
    const [series] = useState([
        {
            name: "Won Deals",
            data: [7, 5, 6, 8, 10, 9, 12, 6, 8, 7, 9, 11]
        },
        {
            name: "Lost Deals",
            data: [3, 4, 2, 5, 4, 6, 3, 5, 4, 3, 5, 4]
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
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        yaxis: {
            title: {
                text: 'Number of Deals'
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            offsetY: 0
        },
        fill: {
            opacity: 1
        },
        colors: ["#59f49aff", "#ff8a65"], // Won (Green) and Lost (Orange)
        grid: {
            borderColor: '#f1f1f1',
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " Deals"
                }
            }
        }
    });

    return (
        <div className="card border-0 radius-15 p-4 mt-4">
            <div className="card-title py-2 pb-1 border-bottom">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5 className="mb-0 fsz-18">Won Deals & Lost Deals</h5>
                </div>
            </div>
            <div className="card-body">
                <div id="chart">
                    <Chart options={options} series={series} type="bar" height={350} />
                </div>
            </div>
        </div>
    );
}
