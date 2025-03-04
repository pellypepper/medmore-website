import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./country.css";
import { countryStateData } from "./countryStateData";

export default function Country({ onCountrySelect, onStateSelect }) {
    const [search, setSearch] = useState("");
    const [filteredCountries, setFilteredCountries] = useState(Object.keys(countryStateData));
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [stateDropdownVisible, setStateDropdownVisible] = useState(false);


    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        setFilteredCountries(
            Object.keys(countryStateData).filter((country) =>
                country.toLowerCase().includes(value)
            )
        );
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };


    const handleCountrySelect = (country) => {
        setSearch(country);
        setStates(countryStateData[country] || []);
        setSelectedState("");
        setDropdownVisible(false);
        setStateDropdownVisible(false); 

        onCountrySelect(country);
    };


    const handleStateSelect = (state) => {
        setSelectedState(state);
        setStateDropdownVisible(false);

     
        onStateSelect(state);
    };


    const toggleStateDropdown = () => {
        setStateDropdownVisible(!stateDropdownVisible);
    };

    return (
        <div className="dropdown-wrapper">
            {/* Country Dropdown */}
            <div className="input-container">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    onFocus={() => setDropdownVisible(true)}
                    onBlur={() => setTimeout(() => setDropdownVisible(false), 100)}
                    placeholder="Search for a country..."
                    className="dropdown-input p-2"
                />
                <button
                    onClick={toggleDropdown}
                    type="button"
                    className="dropdown-toggle"
                >
                    {dropdownVisible ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>
            {dropdownVisible && filteredCountries.length > 0 && (
                <ul className="dropdown-list">
                    {filteredCountries.map((country, index) => (
                        <li
                            key={index}
                            onClick={() => handleCountrySelect(country)}
                            className="dropdown-item"
                        >
                            {country}
                        </li>
                    ))}
                </ul>
            )}

            {/* State Dropdown */}
            <div className="input-container mt-2">
                <input
                    type="text"
                    value={selectedState}
                    onClick={toggleStateDropdown}
                    placeholder="Select a state/region..."
                    readOnly
                    className="dropdown-input p-2"
                />
                <button
                    onClick={toggleStateDropdown}
                    type="button"
                    className="dropdown-toggle"
                >
                    {stateDropdownVisible ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>

            {stateDropdownVisible && states.length > 0 && (
                <ul className="dropdown-list">
                    {states.map((state, index) => (
                        <li
                            key={index}
                            onClick={() => handleStateSelect(state)}
                            className="dropdown-item"
                        >
                            {state}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
