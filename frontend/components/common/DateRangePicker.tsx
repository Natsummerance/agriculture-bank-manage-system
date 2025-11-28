import { DateRange } from "react-day-picker";
import { useState } from "react";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../ui/utils";
import { format } from "date-fns";

interface DateRangePickerProps {
  value?: DateRange | undefined;
  onChange?: (range: DateRange | undefined) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [internalValue, setInternalValue] = useState<DateRange | undefined>(value);

  const range = value ?? internalValue;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "justify-start text-left font-normal border-white/20 bg-white/5 text-white/80",
            !range && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {range?.from ? (
            range.to ? (
              <>
                {format(range.from, "yyyy-MM-dd")} - {format(range.to, "yyyy-MM-dd")}
              </>
            ) : (
              format(range.from, "yyyy-MM-dd")
            )
          ) : (
            <span>选择日期范围</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-slate-900 border border-white/10" align="start">
        <Calendar
          mode="range"
          selected={range}
          onSelect={(r) => {
            setInternalValue(r);
            onChange?.(r);
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}


