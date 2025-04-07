"use client";

import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

interface ViewToggleProps {
  view: 'list' | 'calendar';
  onChange: (view: 'list' | 'calendar') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onChange }) => {
  return (
    <div className="flex justify-end mb-4 items-center space-x-2 rtl:space-x-reverse">
      <span className="text-sm text-gray-600">عرض كـ:</span>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onChange('list')}
          className={`
            px-3 py-1 rounded-md text-sm font-medium transition-colors
            ${view === 'list' 
              ? 'bg-white shadow-sm text-gray-800' 
              : 'text-gray-500 hover:text-gray-700'}
          `}
        >
          <div className="flex items-center gap-1">
            <ListBulletIcon className="h-4 w-4" />
            <span>قائمة</span>
          </div>
        </button>
        <button
          onClick={() => onChange('calendar')}
          className={`
            px-3 py-1 rounded-md text-sm font-medium transition-colors
            ${view === 'calendar' 
              ? 'bg-white shadow-sm text-gray-800' 
              : 'text-gray-500 hover:text-gray-700'}
          `}
        >
          <div className="flex items-center gap-1">
            <Squares2X2Icon className="h-4 w-4" />
            <span>تقويم</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ViewToggle; 