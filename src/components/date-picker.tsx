'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from './ui/confirm-modal';
import { normalizeDate } from '@/utils/common';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  progress: {
    percentage: number;
    completed: number;
    total: number;
  };
}

export const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange, progress }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(() => normalizeDate(selectedDate));
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showStartOverModal, setShowStartOverModal] = useState(false);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Create date from input value and adjust for timezone
    const [year, month, day] = event.target.value.split('-').map(Number);
    const localDate = new Date(year, month - 1, day); // month is 0-based in Date constructor
    setTempDate(normalizeDate(localDate));
  };

  const handleApplyDate = () => {
    if (tempDate.getTime() !== selectedDate.getTime()) {
      setShowConfirmModal(true);
    } else {
      setIsExpanded(false);
    }
  };

  const handleConfirmDateChange = () => {
    onDateChange(normalizeDate(tempDate));
    setIsExpanded(false);
  };

  const handleStartOver = () => {
    const today = normalizeDate(new Date());
    setTempDate(today);
    onDateChange(today);
    setIsExpanded(false);
    setShowStartOverModal(false);
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateForInput = (date: Date) => {
    // Ensure we're using local timezone for the input value
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Card className="p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between text-left"
      >
        <span className="text-sm font-medium mb-1 sm:mb-0">
          Program Start Date: {formatDateForDisplay(selectedDate)}
        </span>
        <div className="text-sm text-gray-600">
          Progress: {progress.percentage}% ({progress.completed}/{progress.total} days)
        </div>
        <div className="absolute right-4 top-4">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {isExpanded && (
        <div className="space-y-2 mt-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="date"
                id="start-date"
                value={formatDateForInput(tempDate)}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onClick={(e) => e.stopPropagation()}
              />
              <div 
                className="absolute inset-0 cursor-pointer"
                onClick={() => {
                  const input = document.getElementById('start-date') as HTMLInputElement;
                  input?.showPicker();
                }}
              />
            </div>
            <button
              onClick={handleApplyDate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Set Date
            </button>
            <button
              onClick={() => setShowStartOverModal(true)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              Start Over
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Select a date and click Apply to start your 8-week program from that date
          </p>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDateChange}
        title="Program Date Change"
        message="Changing the start date will reset all progress. Are you sure you want to continue?"
        confirmText="Change Date"
        cancelText="Keep Current Progress"
      />

      <ConfirmModal
        isOpen={showStartOverModal}
        onClose={() => setShowStartOverModal(false)}
        onConfirm={handleStartOver}
        title="Start Program Over"
        message="This will reset all progress and set the start date to today. Are you sure you want to continue?"
        confirmText="Start Over"
        cancelText="Keep Current Progress"
      />
    </Card>
  );
};