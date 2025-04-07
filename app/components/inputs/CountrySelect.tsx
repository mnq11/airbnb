import React, { useState } from "react";
import Select, { StylesConfig } from "react-select";
import { CSSObject } from "@emotion/serialize";
import yemenAreas from "./yemenAreas.json";
import { LatLngTuple } from "leaflet";

/**
 * Type definition for region/area selection value
 *
 * @typedef {Object} RegionSelectValue
 * @property {string} label - Display name of the region/area
 * @property {string} value - Unique identifier for the region/area
 * @property {LatLngTuple} [latlng] - Optional latitude/longitude coordinates for the region/area
 */
export type RegionSelectValue = {
  label: string;
  value: string;
  latlng?: LatLngTuple;
};

/**
 * Interface for CountrySelect component props
 *
 * @interface CountrySelectProps
 * @property {RegionSelectValue} [value] - Currently selected region/area
 * @property {(value: RegionSelectValue) => void} onChange - Callback function when selection changes
 */
interface CountrySelectProps {
  value?: RegionSelectValue;
  onChange: (value: RegionSelectValue) => void;
}

/**
 * Custom styles for the react-select component
 * Ensures text is properly centered for RTL support
 */
const centeredStyles: StylesConfig<RegionSelectValue, false> = {
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
};

/**
 * Extract unique regions from the Yemen areas data
 * Creates an array of region options for the first dropdown
 */
const regions: RegionSelectValue[] = Array.from(
  new Set(yemenAreas.map((area) => area.region)),
).map((region) => ({
  label: region,
  value: region,
}));

/**
 * CountrySelect Component
 *
 * A hierarchical location selector specifically designed for Yemen locations.
 * Implements a two-level selection process:
 * 1. First dropdown for selecting a region (e.g., صنعاء, عدن)
 * 2. Second dropdown for selecting a specific area within that region
 *
 * Features:
 * - Cascading dropdowns with parent-child relationship
 * - Auto-selection when only one area exists in a region
 * - Geolocation data (latitude/longitude) for map integration
 * - RTL support with centered text for Arabic
 * - Custom styling consistent with application design
 * - Clearable selections
 *
 * Used primarily in the property listing creation form to select property location.
 *
 * @component
 * @param {CountrySelectProps} props - Component props
 * @returns {JSX.Element} Rendered hierarchical location selector
 */
const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  // State for tracking the selected parent region
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  // State for tracking areas filtered by selected region
  const [filteredAreas, setFilteredAreas] = useState<any[]>([]);

  /**
   * Handle change in the parent region dropdown
   * Filters areas based on selected region and updates child dropdown options
   *
   * @param {string|null} value - Selected region value or null if cleared
   */
  const handleRegionChange = (value: string | null) => {
    setSelectedRegion(value);
    onChange({ label: "", value: "" }); // Reset selected area when changing region

    if (value) {
      // Filter areas to only show those in the selected region
      const newFilteredAreas = yemenAreas.filter(
        (area) => area.region === value,
      );
      setFilteredAreas(newFilteredAreas);

      // Auto-select if only one area exists in the region
      if (newFilteredAreas.length === 1) {
        const singleArea = newFilteredAreas[0];
        onChange({
          label: singleArea.label,
          value: singleArea.value,
          latlng: singleArea.latlng as LatLngTuple,
        });
      }
    } else {
      // Clear filtered areas when no region is selected
      setFilteredAreas([]);
    }
  };

  return (
    <div>
      {/* Region selection dropdown (first level) */}
      <Select
        placeholder="حدد المحافظة"
        isClearable
        options={regions}
        value={
          selectedRegion
            ? { label: selectedRegion, value: selectedRegion }
            : null
        }
        onChange={(value) => handleRegionChange(value ? value.value : null)}
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
        <Select
          placeholder="حدد المنطقة"
          isClearable
          options={filteredAreas.map((area) => ({
            label: area.label,
            value: area.value,
            latlng: area.latlng as LatLngTuple,
          }))}
          value={value}
          onChange={(value) => onChange(value as RegionSelectValue)}
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
