"use client";

import Select from "react-select";

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        minWidth: "150px",
        minHeight: "40px",
        height: "40px",
        borderRadius: "10px",
        fontSize: "12px",
        backgroundColor: "#fff",
        borderColor: state.isFocused ? "transparent" : "transparent",
        boxShadow: state.isFocused ? "none" : "none",
        "&:hover": {
            borderColor: "transparent",
        },
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: "0 8px",
        height: "40px",
    }),
    input: (provided) => ({
        ...provided,
        margin: "0",
        padding: "0",
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        height: "40px",
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        padding: "4px",
    }),
    clearIndicator: (provided) => ({
        ...provided,
        padding: "4px",
    }),
    menu: (provided) => ({
        ...provided,
        fontSize: "12px",
        zIndex: 1050,
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#0d6efd" : state.isFocused ? "#e9ecef" : "#fff",
        color: state.isSelected ? "#fff" : "#212529",
        "&:active": {
            backgroundColor: "#0d6efd",
            color: "#fff",
        },
    }),
};

export default function SearchableSelect({
    options = [],
    value,
    onChange,
    placeholder = "Select...",
    isClearable = true,
    className = "",
}) {
    // Map existing value to react-select format { value, label }
    const selectedOption = options.find((opt) => opt.value === value) || null;

    return (
        <Select
            className={className}
            options={options}
            value={selectedOption}
            onChange={(selected) => onChange(selected ? selected.value : "")}
            placeholder={placeholder}
            isClearable={isClearable}
            styles={customStyles}
            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
            menuPosition="fixed"
        />
    );
}
