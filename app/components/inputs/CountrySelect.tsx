'use client';
import React, { useState } from "react";
import Select, {StylesConfig} from "react-select";
import yemenAreas from "./yemenAreas.json";
import {CSSObject} from "@emotion/serialize";

export type CountrySelectValue = {
    flag: string;
    label: string;
    latlng: number[];
    region: string;
    value: string;
    district?: string;
};

interface CountrySelectProps {
    value?: CountrySelectValue;
    onChange: (value: CountrySelectValue) => void;
}

const convertJsonToYemenAreas = (jsonData: any[]): CountrySelectValue[] => {
    return jsonData.map((area) => ({
        flag: area.flag,
        label: area.label,
        latlng: area.latlng,
        region: area.region,
        value: area.value,
        district: area.district,
    }));
};


const centeredStyles: StylesConfig<CountrySelectValue, false> = {
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
export type AreaSelectOption = CountrySelectValue & RegionSelectValue;
export type RegionSelectValue = {
    label: string;
    value: string;
    flag?: string;
    latlng?: number[];
    region?: string;
};

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
    const convertedYemenAreas = convertJsonToYemenAreas(yemenAreas);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [filteredAreas, setFilteredAreas] = useState<CountrySelectValue[]>([]);

    const handleRegionChange = (value: string | null) => {
        setSelectedRegion(value);
        if (value) {
            setFilteredAreas(convertedYemenAreas.filter((area) => area.region === value));
        } else {
            setFilteredAreas([]);
        }
    };


    const regions: AreaSelectOption[] = Array.from(
        new Set(convertedYemenAreas.map((area) => area.region))
    ).map((region) => ({
        label: region,
        value: region,
        flag: "",
        latlng: [0, 0],
        region: region,
    }));
    return (
        <div>
            <Select
                placeholder="أي محافظة ؟"
                isClearable
                options={regions}
                value={selectedRegion ? { label: selectedRegion, value: selectedRegion } as CountrySelectValue : null}
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
                    placeholder="اختر المنطقة"
                    isClearable
                    options={filteredAreas}
                    value={value}
                    onChange={(value) => onChange(value as CountrySelectValue)}
                    formatOptionLabel={(option: CountrySelectValue) => (
                        <div className="flex w-full justify-center">
                            <div>
                                {option.label}
                            </div>
                        </div>
                    )}
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
