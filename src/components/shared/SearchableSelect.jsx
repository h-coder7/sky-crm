"use client";

import Select from 'react-select';

export default function SearchableSelect({
    options = [],
    value,
    onChange,
    placeholder = "Select...",
    isLoading = false,
    isClearable = true,
    className = "",
    ...props
}) {
    // Custom styles to match the application theme
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#fff',
            borderColor: state.isFocused ? '#4b4b4b' : '#ced4da',
            boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)' : null,
            '&:hover': {
                borderColor: '#4b4b4b'
            },
            minHeight: '38px',
            fontSize: '13px',
            borderRadius: '0.375rem',
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
            fontSize: '13px',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? '#0d6efd'
                : state.isFocused
                    ? '#e9ecef'
                    : null,
            color: state.isSelected ? 'white' : '#212529',
            cursor: 'pointer',
            ':active': {
                backgroundColor: '#0d6efd',
                color: 'white',
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#6c757d',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#212529',
        }),
    };

    return (
        <Select
            classNamePrefix="react-select"
            className={className}
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            isLoading={isLoading}
            isClearable={isClearable}
            styles={customStyles}
            {...props}
        />
    );
}
