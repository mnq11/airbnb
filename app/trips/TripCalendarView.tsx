"use client";

import { useState, useEffect } from "react";
import { SafeReservation } from "@/app/types";
import { format, addDays, isSameDay, isWithinInterval, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

interface TripCalendarViewProps {
  reservations: SafeReservation[];
}

// Color palette for different properties
const colorPalette = [
  "bg-rose-200 border-rose-300",
  "bg-blue-200 border-blue-300",
  "bg-green-200 border-green-300",
  "bg-yellow-200 border-yellow-300",
  "bg-purple-200 border-purple-300",
  "bg-indigo-200 border-indigo-300",
  "bg-pink-200 border-pink-300",
  "bg-teal-200 border-teal-300",
  "bg-orange-200 border-orange-300",
  "bg-cyan-200 border-cyan-300",
];

const TripCalendarView: React.FC<TripCalendarViewProps> = ({ reservations }) => {
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [propertyColors, setPropertyColors] = useState<Record<string, string>>({});

  // Group reservations by listing and assign colors
  useEffect(() => {
    // Get unique listing IDs without using spread on Set
    const uniqueListingIdsSet = new Set(reservations.map(r => r.listing.id));
    const uniqueListingIds = Array.from(uniqueListingIdsSet);
    
    const colors: Record<string, string> = {};
    
    uniqueListingIds.forEach((id, index) => {
      colors[id] = colorPalette[index % colorPalette.length];
    });
    
    setPropertyColors(colors);
  }, [reservations]);

  // Generate calendar days (next 30 days)
  useEffect(() => {
    const days: Date[] = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      days.push(addDays(today, i));
    }
    
    setCalendarDays(days);
  }, []);

  // Check if a day has a reservation
  const getReservationsForDay = (day: Date) => {
    return reservations.filter((reservation) => {
      const startDate = parseISO(reservation.startDate);
      const endDate = parseISO(reservation.endDate);
      
      return isWithinInterval(day, { start: startDate, end: endDate });
    });
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-right">تقويم الحجوزات</h2>
      
      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-3 justify-end">
        {Object.entries(propertyColors).map(([listingId, colorClass]) => {
          const listing = reservations.find(r => r.listing.id === listingId)?.listing;
          if (!listing) return null;
          
          return (
            <div key={listingId} className="flex items-center gap-2 text-sm">
              <span className="text-gray-700">{listing.title}</span>
              <div className={`w-4 h-4 rounded-full ${colorClass.split(' ')[0]}`}></div>
            </div>
          );
        })}
      </div>
      
      {/* Calendar */}
      <div className="overflow-x-auto">
        <div className="min-w-max flex space-x-2 rtl:space-x-reverse">
          {calendarDays.map((day) => {
            const dayReservations = getReservationsForDay(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={day.toISOString()} 
                className={`
                  w-24 min-h-24 border rounded-md p-2 flex flex-col
                  ${isToday ? 'border-black border-2' : 'border-gray-200'}
                `}
              >
                <div className="text-center mb-2 font-medium">
                  {format(day, 'EEE', { locale: ar })}
                  <div className="text-sm">{format(day, 'd MMM', { locale: ar })}</div>
                </div>
                
                <div className="flex flex-col gap-1 flex-grow">
                  {dayReservations.length > 0 ? (
                    dayReservations.map((reservation) => {
                      const colorClass = propertyColors[reservation.listing.id] || "bg-gray-200 border-gray-300";
                      const isStartDay = isSameDay(parseISO(reservation.startDate), day);
                      const isEndDay = isSameDay(parseISO(reservation.endDate), day);
                      
                      return (
                        <div
                          key={reservation.id}
                          className={`
                            text-xs p-1 rounded-md ${colorClass} border
                            ${isStartDay ? 'rounded-r-none border-r-0 mr-0' : ''}
                            ${isEndDay ? 'rounded-l-none border-l-0 ml-0' : ''}
                            overflow-hidden whitespace-nowrap text-ellipsis
                          `}
                          title={`${reservation.listing.title}: ${format(parseISO(reservation.startDate), 'yyyy/MM/dd')} - ${format(parseISO(reservation.endDate), 'yyyy/MM/dd')}`}
                        >
                          {isStartDay && reservation.listing.title}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-gray-400 text-center mt-2">لا حجوزات</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TripCalendarView; 