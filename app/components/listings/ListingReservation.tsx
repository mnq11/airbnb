"use client";

import { Range } from "react-date-range";

import Button from "../Button";
import Calendar from "../inputs/Calendar";

/**
 * Interface for ListingReservation component props
 *
 * @interface ListingReservationProps
 * @property {number} price - Per-night price of the property
 * @property {Range} dateRange - Currently selected date range (startDate and endDate)
 * @property {number} totalPrice - Calculated total price for the selected dates
 * @property {(value: Range) => void} onChangeDate - Callback function when date selection changes
 * @property {() => void} onSubmit - Callback function when the booking is submitted
 * @property {boolean} [disabled] - Whether the booking functionality is disabled
 * @property {Date[]} disabledDates - Array of dates that are unavailable for booking
 */
interface ListingReservationProps {
  price: number;
  dateRange: Range;
  totalPrice: number;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Date[];
}

/**
 * ListingReservation Component
 *
 * Displays the reservation panel for a property listing, allowing users to:
 * - Select check-in and check-out dates
 * - See the nightly rate
 * - View the total price for their stay
 * - Submit a booking request
 *
 * This component is displayed in the sidebar of the listing detail page
 * and handles all the booking-related functionality.
 *
 * Features:
 * - Date range selection calendar
 * - Automatic price calculation based on selected dates
 * - Arabic number formatting and RTL text support
 * - Disabled dates for unavailable booking periods
 * - Loading state during booking submission
 *
 * @component
 * @param {ListingReservationProps} props - Component props
 * @returns {JSX.Element} Rendered reservation panel
 */
const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
}) => {
  return (
    <div
      className="
      bg-white 
        rounded-xl 
        border-[1px]
      border-neutral-200 
        overflow-hidden
      "
    >
      <div
        className="
      flex flex-row items-center gap-1 p-4"
      >
        <div className="text-2xl font-semibold text-right">
          {price.toLocaleString("ar-EG")}
        </div>
        <div className="font-light text-neutral-600">ريال / اليوم</div>
      </div>
      <hr />
      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => onChangeDate(value.selection)}
      />
      <hr />
      <div className="p-4">
        <Button disabled={disabled} label="حجز" onClick={onSubmit} />
      </div>
      <hr />
      <div
        className="
          p-4 
          flex 
          flex-row 
          items-center 
          justify-between
          font-semibold
          text-lg
        "
      >
        <div>السعر الكلي</div>
        <div>{totalPrice.toLocaleString("ar-EG")}ريال</div>
      </div>
    </div>
  );
};

export default ListingReservation;
