// components/ui/date-range-picker.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/utils";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { type DateRange } from "react-day-picker";

interface DatePickerWithRangeProps {
  className?: string;
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  value,
  onChange,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="space-y-3 p-3">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={value?.from}
              selected={value}
              onSelect={onChange}
              numberOfMonths={2}
            />
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onChange?.(undefined)}
              >
                Clear
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const today = new Date();
                  onChange?.({
                    from: addDays(today, -7),
                    to: today,
                  });
                }}
              >
                Last 7 days
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const today = new Date();
                  onChange?.({
                    from: addDays(today, -30),
                    to: today,
                  });
                }}
              >
                Last 30 days
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
