"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  addYears,
  subYears,
  getYear,
  getMonth,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  setYear,
  setMonth,
  add,
  sub,
  getDaysInMonth,
} from "date-fns";

type SmartDatePickerProps = {
  value: Date | null | undefined;
  onChange: (date: Date | undefined) => void;
  toDate?: Date;
};

type View = "days" | "months" | "years";

const yearsInView = 12;

export function SmartDatePicker({ value, onChange, toDate }: SmartDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [view, setView] = React.useState<View>("days");
  const [viewDate, setViewDate] = React.useState(value || new Date());

  const startOfVisibleYears = getYear(viewDate) - (getYear(viewDate) % yearsInView);

  const handleDayClick = (day: Date) => {
    onChange(day);
    setIsOpen(false);
  };

  const handleMonthClick = (monthIndex: number) => {
    setViewDate(setMonth(viewDate, monthIndex));
    setView("days");
  };

  const handleYearClick = (year: number) => {
    setViewDate(setYear(viewDate, year));
    setView("months");
  };

  const renderHeader = () => {
    const headerText = {
      days: format(viewDate, "MMMM yyyy"),
      months: format(viewDate, "yyyy"),
      years: `${startOfVisibleYears} - ${startOfVisibleYears + yearsInView - 1}`,
    };

    const onPrev = () => {
      if (view === "days") setViewDate(subMonths(viewDate, 1));
      if (view === "months") setViewDate(subYears(viewDate, 1));
      if (view === "years") setViewDate(sub(viewDate, { years: yearsInView }));
    };
    
    const onNext = () => {
      if (view === "days") setViewDate(addMonths(viewDate, 1));
      if (view === "months") setViewDate(addYears(viewDate, 1));
      if (view === "years") setViewDate(add(viewDate, { years: yearsInView }));
    };

    const onTitleClick = () => {
      if (view === "days") setView("months");
      if (view === "months") setView("years");
    };

    return (
      <div className="flex items-center justify-between px-2 py-2">
        <Button variant="ghost" size="icon" onClick={onPrev}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button variant="ghost" className="text-lg font-semibold" onClick={onTitleClick}>
          {headerText[view]}
        </Button>
        <Button variant="ghost" size="icon" onClick={onNext}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    return (
      <>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
          {weekdays.map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-2">
          {days.map(day => {
            const isDisabled = (toDate && day > toDate) || !isSameMonth(day, viewDate);
            return (
              <Button
                key={day.toString()}
                variant="ghost"
                size="icon"
                onClick={() => handleDayClick(day)}
                disabled={isDisabled}
                className={cn("h-9 w-9 rounded-full", {
                  "text-gray-500": !isSameMonth(day, viewDate),
                  "bg-[#FF6B00] text-white hover:bg-orange-700": value && isSameDay(day, value),
                  "border border-[#FF6B00]": isSameDay(day, new Date()) && !(value && isSameDay(day, value)),
                  "hover:bg-gray-700": !isDisabled,
                  "cursor-not-allowed opacity-30": isDisabled,
                })}
              >
                {format(day, "d")}
              </Button>
            );
          })}
        </div>
      </>
    );
  };

  const renderMonths = () => {
    const months = Array.from({ length: 12 }, (_, i) => format(new Date(0, i), "MMM"));
    return (
      <div className="grid grid-cols-3 gap-2 p-2">
        {months.map((month, i) => (
          <Button key={month} variant="ghost" className="h-14 text-base hover:bg-gray-700" onClick={() => handleMonthClick(i)}>
            {month}
          </Button>
        ))}
      </div>
    );
  };

  const renderYears = () => {
    const years = Array.from({ length: yearsInView }, (_, i) => startOfVisibleYears + i);
    return (
      <div className="grid grid-cols-3 gap-2 p-2">
        {years.map(year => (
          <Button key={year} variant="ghost" className="h-14 text-base hover:bg-gray-700" onClick={() => handleYearClick(year)}>
            {year}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 hover:bg-gray-700 hover:text-white",
            !value && "text-gray-400"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 bg-neutral-900 border-gray-700 text-white rounded-lg shadow-lg">
        {renderHeader()}
        {view === "days" && renderDays()}
        {view === "months" && renderMonths()}
        {view === "years" && renderYears()}
      </PopoverContent>
    </Popover>
  );
}
