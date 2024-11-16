'use client';

import React, { useState } from 'react';
import { Card } from './ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(selectedDate);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempDate(new Date(event.target.value));
  };

  const handleApplyDate = () => {
    onDateChange(tempDate);
    setIsExpanded(false);
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <Card className="p-4 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-sm font-medium">
          Program Start Date: {formatDateForDisplay(selectedDate)}
        </span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isExpanded && (
        <div className="space-y-2 mt-4">
          <div className="flex gap-3">
            <input
              type="date"
              id="start-date"
              value={formatDateForInput(tempDate)}
              onChange={handleDateChange}
              className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleApplyDate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Set Date
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Select a date and click Apply to start your 8-week program from that date
          </p>
        </div>
      )}
    </Card>
  );
};