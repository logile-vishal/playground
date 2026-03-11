// date-picker.type.ts
// Shared prop types for DatePicker, RangeDatePicker, and WeekPicker components.

// ─── DatePicker ────────────────────────────────────────────────────────────────

export type DatePickerProps = {
  /** Currently selected date. */
  value?: Date | null;
  /** Called when the user selects a new date. */
  onChange?: (date: Date) => void;
  /** Input placeholder text (e.g. "MM/DD/YY"). */
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  /** Renders left/right arrow buttons to step through days without opening the popup. */
  showArrows?: boolean;
};

// ─── RangeDatePicker ───────────────────────────────────────────────────────────

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export type RangeDatePickerProps = {
  /** Currently committed start date. */
  startDate?: Date | null;
  /** Currently committed end date. */
  endDate?: Date | null;
  /** Called with { start, end } when the user clicks Apply. */
  onChange?: (range: DateRange) => void;
  disabled?: boolean;
  label?: string;
  /** Show left/right step-range arrow buttons. Defaults to true. */
  showArrows?: boolean;
};

// ─── WeekPicker ────────────────────────────────────────────────────────────────

export type WeekPickerProps = {
  /** Monday of the currently selected week. */
  value?: Date | null;
  /** Called with the Monday of the newly selected week. */
  onChange?: (weekStart: Date) => void;
  disabled?: boolean;
  label?: string;
  /** Show left/right step-week arrow buttons. Defaults to true. */
  showArrows?: boolean;
};
