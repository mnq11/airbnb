"use client";
import { DateRange, Range, RangeKeyDict } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ar } from "date-fns/locale";

/**
 * Interface for DatePicker component props
 *
 * @interface DatePickerProps
 * @property {Range} value - Current date range selection with startDate and endDate properties
 * @property {(value: RangeKeyDict) => void} onChange - Callback function when date selection changes
 * @property {Date[]} [disabledDates] - Array of dates that should be disabled/unselectable
 */
interface DatePickerProps {
  value: Range;
  onChange: (value: RangeKeyDict) => void;
  disabledDates?: Date[];
}

/**
 * DatePicker Component
 *
 * A date range picker component used for booking reservations and filtering listings by date.
 * This component wraps the react-date-range library with consistent styling and
 * configuration for the application.
 *
 * Features:
 * - Range selection with start and end dates
 * - Arabic language localization
 * - Custom theme with Airbnb-styled accent colors (#f23f5d)
 * - Vertical calendar display
 * - Disabled dates support for unavailable booking dates
 * - Minimum date constraint (prevents selecting dates in the past)
 *
 * Used in:
 * - ListingReservation component for booking properties
 * - SearchModal for filtering listings by date range
 *
 * @component
 * @param {DatePickerProps} props - Component props
 * @returns {JSX.Element} Rendered date picker calendar
 */
const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabledDates,
}) => {
  return (
    <div className="dateContainer">
      <DateRange
        rangeColors={["#f23f5d"]}
        ranges={[value]}
        date={new Date()}
        onChange={onChange}
        direction="vertical"
        showDateDisplay={false}
        minDate={new Date()}
        disabledDates={disabledDates}
        locale={ar}
      />
    </div>
  );
};

export default DatePicker;
