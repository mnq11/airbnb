// import countries from 'world-countries';
import countries from "../../app/components/inputs/yemenAreas.json";

const formattedCountries = countries.map((country) => ({
  value: country.value,
  label: country.label,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region,
}));

const useCountries = () => {
  const getAll = () => formattedCountries;

  const getByValue = (value: string) => {
    return formattedCountries.find((item) => item.value === value);
  };

  return {
    getAll,
    getByValue,
  };
};

export default useCountries;
