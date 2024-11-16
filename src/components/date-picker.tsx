'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from './ui/confirm-modal';

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
  const [tempDate, setTempDate] = useState<Date>(selectedDate);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempDate(new Date(event.target.value));
  };

  const handleApplyDate = () => {
    if (tempDate.getTime() !== selectedDate.getTime()) {
      setShowConfirmModal(true);
    } else {
      setIsExpanded(false);
    }
  };

  const handleConfirmDateChange = () => {
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

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDateChange}
        title="Program Date Change"
        message="Changing the start date will reset all progress. Are you sure you want to continue?"
        confirmText="Change Date"
        cancelText="Keep Current Progress"
      />
    </Card>
  );
};