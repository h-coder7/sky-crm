"use client";

export default function PageHeader({
  title,
  onFilterChange,
  children
}) {
  return (
    <div className="page-header">
      <div className="row align-items-center">

        {/* Title */}
        <div className="col-lg-6">
          <h5 className="mb-0 fsz-24">{title}</h5>
        </div>

        {/* Controls */}
        <div className="col-lg-6">
          <div className="nav-butns d-flex flex-wrap justify-content-lg-end mt-3 mt-lg-0 align-items-center">

            {/* Filter Dropdown */}
            {/* <div className="dropdown ms-2">
              <button
                className="butn-st2 line-butn py-2 px-3 dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <i className="fal fa-filter me-2"></i> Filter
              </button>

              <ul className="dropdown-menu p-2">
                {["name", "phone"].map((item) => (
                  <li key={item}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={item}
                        onChange={(e) =>
                          onFilterChange?.(item, e.target.checked)
                        }
                      />
                      <label
                        className="form-check-label fsz-13"
                        htmlFor={item}
                      >
                        {item}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Actions Buttons */}
            {children}

          </div>
        </div>
      </div>
    </div>
  );
}
