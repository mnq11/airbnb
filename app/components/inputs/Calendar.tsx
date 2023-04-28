'use client';
import {
    DateRange,
    Range,
  RangeKeyDict
} from 'react-date-range';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { ar } from 'date-fns/locale';

interface DatePickerProps {
    value: Range,
    onChange: (value: RangeKeyDict) => void;
    disabledDates?: Date[];
}

const DatePicker: React.FC<DatePickerProps> = ({
                                                   value,
                                                   onChange,
                                                   disabledDates
                                               }) => {
    return (
        <div className="dateContainer">
            <DateRange
                rangeColors={['#f23f5d']}
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
}

export default DatePicker;
