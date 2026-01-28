"use client";

export default function LogItem({ log }) {
    const getActionStyle = (action) => {
        switch (action.toLowerCase()) {
            case "created":
                return {
                    icon: "fal fa-plus-circle",
                    colorClass: "cr-green",
                    bgColorClass: "bg-green-light"
                };
            case "updated":
                return {
                    icon: "fal fa-pen-to-square",
                    colorClass: "cr-blue",
                    bgColorClass: "bg-blue-light"
                };
            case "deleted":
                return {
                    icon: "fal fa-trash-can",
                    colorClass: "cr-red",
                    bgColorClass: "bg-red-light"
                };
            case "restored":
                return {
                    icon: "fal fa-arrow-rotate-left",
                    colorClass: "main-color",
                    bgColorClass: "bg-main-light"
                };
            default:
                return {
                    icon: "fal fa-info-circle",
                    colorClass: "cr-999",
                    bgColorClass: "bg-f1"
                };
        }
    };

    const style = getActionStyle(log.action);

    return (
        <div className="col-lg-12 mb-3">
            <div className="log-item p-3 bg-white radius-10 border-light d-flex align-items-center hover-translate-y">
                <div className={`icon-40 rounded-circle df-center me-3 ${style.colorClass}`} style={{ backgroundColor: 'rgba(0,0,0,0.03)', fontSize: '20px' }}>
                    <i className={style.icon}></i>
                </div>

                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="fsz-14 mb-0 fw-600">{log.user}</h6>
                        <small className="cr-999 fsz-12"><i className="fal fa-clock me-1"></i>{log.timestamp}</small>
                    </div>
                    <div className="fsz-13">
                        <span className={`fw-600 ${style.colorClass}`}>{log.action}</span>
                        {" "}
                        <span className="fw-600 cr-333">{log.item}</span>
                        {" in "}
                        <span className="badge bg-f1 cr-666 border fw-500">{log.module}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
