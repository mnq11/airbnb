"use client";

import React, { useState } from "react";
import Select, { StylesConfig } from "react-select";
import { CSSObject } from "@emotion/serialize";
import yemenAreas from "./yemenAreas.json";
import { LatLngTuple } from "leaflet";

/**
 * Type definition for region/area selection value used internally and for export.
 * This represents the final selected area with its details.
 *
 * @typedef {Object} CountrySelectValue
 * @property {string} label - Display name of the region/area
 * @property {string} value - Unique identifier for the region/area
 * @property {LatLngTuple} [latlng] - Optional latitude/longitude coordinates for the region/area
 * @property {string} [region] - Optional region the area belongs to
 * @property {string} [flag] - Optional flag (can be added if needed, currently unused by logic)
 */
export type CountrySelectValue = {
  label: string;
  value: string;
  latlng?: LatLngTuple;
  region?: string; // Added region back
  flag?: string;   // Keep flag for potential future use or compatibility
};

// Internal type for the first dropdown (Regions)
type RegionOption = {
  label: string;
  value: string;
};

/**
 * Interface for CountrySelect component props
 *
 * @interface CountrySelectProps
 * @property {CountrySelectValue} [value] - Currently selected area value
 * @property {(value: CountrySelectValue) => void} onChange - Callback function when final area selection changes
 */
interface CountrySelectProps {
  value?: CountrySelectValue;
  onChange: (value: CountrySelectValue) => void;
}

/**
 * Custom styles for the react-select component
 * Ensures text is properly centered for RTL support
 */
const centeredStyles: StylesConfig<any, false> = { // Use 'any' for flexibility with different option types
  menu: (provided: CSSObject): CSSObject => ({
    ...provided,
    textAlign: "center",
  }),
  control: (provided: CSSObject): CSSObject => ({
    ...provided,
    display: "flex",
    alignItems: "center",
  }),
  singleValue: (provided: CSSObject): CSSObject => ({
    ...provided,
    textAlign: "center",
  }),
  valueContainer: (provided: CSSObject): CSSObject => ({
    ...provided,
    justifyContent: "center",
  }),
  placeholder: (provided: CSSObject): CSSObject => ({
    ...provided,
    textAlign: "center",
  }),
  option: (provided: CSSObject): CSSObject => ({ // Added for options centering
    ...provided,
    textAlign: "center",
  }),
};

/**
 * Extract unique regions from the Yemen areas data
 * Creates an array of region options for the first dropdown
 */
const regions: RegionOption[] = Array.from(
  new Set(yemenAreas.map((area) => area.region))
).map((region) => ({
  label: region,
  value: region,
}));

/**
 * CountrySelect Component (Restored Yemen-specific logic)
 *
 * A hierarchical location selector specifically designed for Yemen locations.
 * Implements a two-level selection process:
 * 1. First dropdown for selecting a region (e.g., صنعاء, عدن)
 * 2. Second dropdown for selecting a specific area within that region
 *
 * @component
 * @param {CountrySelectProps} props - Component props
 * @returns {JSX.Element} Rendered hierarchical location selector
 */
const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  // State for tracking the selected parent region
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
     // Initialize with the region from the passed value if available
     value?.region || null
  );
  // State for tracking areas filtered by selected region
  const [filteredAreas, setFilteredAreas] = useState<CountrySelectValue[]>(() => {
      // Initialize filtered areas based on the initial value's region
      if (value?.region) {
          return yemenAreas
              .filter((area) => area.region === value.region)
              .map(area => ({ // Map to CountrySelectValue format
                  label: area.label,
                  value: area.value,
                  latlng: area.latlng as LatLngTuple,
                  region: area.region,
              }));
      }
      return [];
  });

  /**
   * Handle change in the parent region dropdown
   * Filters areas based on selected region and updates child dropdown options
   *
   * @param {string|null} regionValue - Selected region value or null if cleared
   */
  const handleRegionChange = (regionValue: string | null) => {
    setSelectedRegion(regionValue);
    onChange({ label: "", value: "" }); // Reset selected area when changing region

    if (regionValue) {
      // Filter areas to only show those in the selected region
      const newFilteredAreas = yemenAreas
          .filter((area) => area.region === regionValue)
          .map(area => ({ // Map to CountrySelectValue format
              label: area.label,
              value: area.value,
              latlng: area.latlng as LatLngTuple,
              region: area.region,
          }));

      setFilteredAreas(newFilteredAreas);

      // Auto-select if only one area exists in the region
      if (newFilteredAreas.length === 1) {
        const singleArea = newFilteredAreas[0];
        onChange(singleArea); // Pass the full CountrySelectValue
      }
    } else {
      // Clear filtered areas when no region is selected
      setFilteredAreas([]);
    }
  };

  return (
    <div className="flex flex-col gap-4"> {/* Added gap between selects */}
      {/* Region selection dropdown (first level) */}
      <Select<RegionOption> // Specify type for region options
        placeholder="حدد المحافظة"
        isClearable
        options={regions}
        value={
          selectedRegion
            ? { label: selectedRegion, value: selectedRegion }
            : null
        }
        onChange={(selectedOption) => handleRegionChange(selectedOption ? selectedOption.value : null)}
        styles={centeredStyles}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "black",
            primary25: "#ffe4e6",
          },
        })}
      />

      {/* Area selection dropdown (second level) - only shown when a region is selected */}
      {selectedRegion && (
        <Select<CountrySelectValue> // Specify type for area options
          placeholder="حدد المنطقة"
          isClearable
          options={filteredAreas} // Already in CountrySelectValue format
          value={value?.value ? value : null} // Ensure value matches an option object
          onChange={(selectedOption) => onChange(selectedOption as CountrySelectValue)} // Pass the full selected object
          styles={centeredStyles}
          theme={(theme) => ({
            ...theme,
            borderRadius: 6,
            colors: {
              ...theme.colors,
              primary: "black",
              primary25: "#ffe4e6",
            },
          })}
        />
      )}
    </div>
  );
};

export default CountrySelect;
