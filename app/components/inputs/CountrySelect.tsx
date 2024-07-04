import React, { useState } from "react";
import Select, { StylesConfig } from "react-select";
import { CSSObject } from "@emotion/serialize";
import yemenAreas from "./yemenAreas.json";
import { LatLngTuple } from "leaflet";

export type RegionSelectValue = {
  label: string;
  value: string;
  latlng?: LatLngTuple;
};

interface CountrySelectProps {
  value?: RegionSelectValue;
  onChange: (value: RegionSelectValue) => void;
}

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

const regions: RegionSelectValue[] = Array.from(
  new Set(yemenAreas.map((area) => area.region)),
).map((region) => ({
  label: region,
  value: region,
}));

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [filteredAreas, setFilteredAreas] = useState<any[]>([]);

  const handleRegionChange = (value: string | null) => {
    setSelectedRegion(value);
    onChange({ label: "", value: "" }); // Reset selected area when changing region
    if (value) {
      const newFilteredAreas = yemenAreas.filter(
        (area) => area.region === value,
      );
      setFilteredAreas(newFilteredAreas);

      // Automatically select the only available option in the second dropdown
      if (newFilteredAreas.length === 1) {
        const singleArea = newFilteredAreas[0];
        onChange({
          label: singleArea.label,
          value: singleArea.value,
          latlng: singleArea.latlng as LatLngTuple,
        });
      }
    } else {
      setFilteredAreas([]);
    }
  };

  return (
    <div>
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
