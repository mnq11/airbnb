'use client';
import React from "react";
import Select from "react-select";
import yemenAreas from "./yemenAreas.json";

export type CountrySelectValue = {
    flag: string;
    label: string;
    latlng: number[];
    region: string;
    value: string;
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
    }));
};

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
    const convertedYemenAreas = convertJsonToYemenAreas(yemenAreas);

    return (
        <div>
            <Select
                placeholder="أي منطقة ؟"
                isClearable
                options={convertedYemenAreas}
                value={value}
                onChange={(value) => onChange(value as CountrySelectValue)}
                formatOptionLabel={(option: any) => (
                    <div className="flex flex-row items-center gap-3">
                        <div>{option.flag}</div>
                        <div>
                            {option.label},
                            <span className="text-neutral-500 ml-1">{option.region}</span>
                        </div>
                    </div>
                )}
                classNames={{
                    control: () => "p-3 border-2",
                    input: () => "text-lg",
                    option: () => "text-lg",
                }}
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
        </div>
    );
};

export default CountrySelect;
