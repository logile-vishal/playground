import { useState, useRef, useEffect } from "react";
import CSvgIcon from "@/core/components/icon/Icon";
import { CalendarBlank, ChevronLeft, ChevronRight } from "@/core/constants/icons";
import type { DatePickerProps } from "@/core/types/date-picker.type";
import "./DatePicker.scss";

// ─── Constants ─────────────────────────────────────────────────────────────────

// Monday-first order — matches Figma (M T W T F S S)
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTH_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstWeekday(year: number, month: number): number {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(date: Date): string {
  // MM/DD/YY — Logile standard display format for all date pickers.
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

/** Parse a date string typed by the user.
 *  Accepts MM/DD/YY or MM/DD/YYYY.
 *  Returns null if the string is empty or invalid. */
function parseInputDate(str: string): Date | null {
  const trimmed = str.trim();
  if (!trimmed) return null;
  const parts = trimmed.split("/");
  if (parts.length !== 3) return null;
  const [m, d, y] = parts.map(Number);
  if (isNaN(m) || isNaN(d) || isNaN(y)) return null;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const year = y > 0 && y < 100 ? 2000 + y : y;
  if (year < 1000 || year > 9999) return null;
  const date = new Date(year, m - 1, d);
  // Guard against roll-over (e.g. Feb 30 → Mar 2)
  if (date.getMonth() !== m - 1) return null;
  return date;
}

function getDecadeStart(year: number): number {
  return Math.floor(year / 10) * 10;
}

// ─── Types ──────────────────────────────────────────────────────────────────────

type View = "calendar" | "month" | "year";

type CalendarCell = {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function DatePicker({
  value,
  onChange,
  placeholder = "MM/DD/YY",
  disabled = false,
  label,
  showArrows = false,
}: DatePickerProps) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("calendar");
  // "year" view needs to know where to return: calendar or month picker
  const [yearOrigin, setYearOrigin] = useState<"calendar" | "month">("calendar");
  const [viewYear, setViewYear] = useState(() => value?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => value?.getMonth() ?? today.getMonth());
  const [decadeStart, setDecadeStart] = useState(() =>
    getDecadeStart(value?.getFullYear() ?? today.getFullYear())
  );

  // Controlled text value for the input field — synced from value prop
  const [inputValue, setInputValue] = useState(() => (value ? formatDate(value) : ""));

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync input text whenever the parent updates the value prop
  useEffect(() => {
    setInputValue(value ? formatDate(value) : "");
  }, [value]);

  // When the popup closes, reset the calendar view to the selected value (or today).
  // This prevents a stale viewYear/viewMonth (from browsing) from appearing the next
  // time the popup opens — which would show an unexpected old date like "December 2021".
  useEffect(() => {
    if (!open) {
      const ref = value ?? new Date();
      setViewYear(ref.getFullYear());
      setViewMonth(ref.getMonth());
      setDecadeStart(getDecadeStart(ref.getFullYear()));
      setView("calendar");
    }
  }, [open, value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close popup on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setView("calendar");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // ── Commit helper ─────────────────────────────────────────────────────────
  // Parse the current input text and fire onChange; revert on invalid input.
  const commitInput = () => {
    const parsed = parseInputDate(inputValue);
    if (parsed) {
      onChange?.(parsed);
      setInputValue(formatDate(parsed));
    } else {
      // Revert to the last known valid value
      setInputValue(value ? formatDate(value) : "");
    }
  };

  // ── Input event handlers ──────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputFocus = () => {
    if (disabled) return;
    if (!open) {
      const ref = value ?? today;
      setViewYear(ref.getFullYear());
      setViewMonth(ref.getMonth());
      setDecadeStart(getDecadeStart(ref.getFullYear()));
      setView("calendar");
      setOpen(true);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // If focus is staying inside the picker (e.g. clicking a calendar cell), don't close yet
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    commitInput();
    setOpen(false);
    setView("calendar");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitInput();
      setOpen(false);
      setView("calendar");
    } else if (e.key === "Escape") {
      setInputValue(value ? formatDate(value) : "");
      setOpen(false);
      setView("calendar");
    }
  };

  // ── Calendar icon — toggles popup ─────────────────────────────────────────
  const handleTriggerClick = () => {
    if (disabled) return;
    if (open) {
      setOpen(false);
      setView("calendar");
    } else {
      const ref = value ?? today;
      setViewYear(ref.getFullYear());
      setViewMonth(ref.getMonth());
      setDecadeStart(getDecadeStart(ref.getFullYear()));
      setView("calendar");
      setOpen(true);
    }
  };

  // ── Arrow nav: step by one day ────────────────────────────────────────────
  const stepDay = (delta: 1 | -1) => {
    if (disabled) return;
    const base = value ?? today;
    const next = new Date(base);
    next.setDate(next.getDate() + delta);
    onChange?.(next);
    // Always close popup and reset to calendar view — the day-step arrows are a
    // quick navigation mechanism separate from the calendar. If the popup happened
    // to be open (e.g. in month/year sub-view), clicking an arrow should dismiss it.
    setOpen(false);
    setView("calendar");
  };

  // ── Calendar navigation ───────────────────────────────────────────────────
  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // ── Day selection ─────────────────────────────────────────────────────────
  const handleSelectDay = (cell: CalendarCell) => {
    const date = new Date(cell.year, cell.month, cell.day);
    onChange?.(date);
    setInputValue(formatDate(date)); // keep input in sync immediately
    setOpen(false);
    setView("calendar");
  };

  // ── Month view ────────────────────────────────────────────────────────────
  const openMonthView = () => setView("month");

  // Selecting a month: navigates the calendar AND updates the selected date value
  const handleSelectMonth = (monthIndex: number) => {
    setViewMonth(monthIndex);
    if (value) {
      const maxDay = getDaysInMonth(viewYear, monthIndex);
      const day = Math.min(value.getDate(), maxDay);
      onChange?.(new Date(viewYear, monthIndex, day));
    }
    setView("calendar");
  };

  // ── Year view ─────────────────────────────────────────────────────────────
  const openYearView = (from: "calendar" | "month") => {
    setYearOrigin(from);
    setDecadeStart(getDecadeStart(viewYear));
    setView("year");
  };

  // Selecting a year: navigates the calendar AND updates the selected date value
  const handleSelectYear = (year: number) => {
    setViewYear(year);
    setDecadeStart(getDecadeStart(year));
    if (value) {
      const month = value.getMonth();
      const maxDay = getDaysInMonth(year, month);
      const day = Math.min(value.getDate(), maxDay);
      onChange?.(new Date(year, month, day));
    }
    setView(yearOrigin);
  };

  // ── Build calendar cells ──────────────────────────────────────────────────
  const buildCells = (): CalendarCell[] => {
    // Convert Sunday-based getDay() to Monday-based index (Mon=0 … Sun=6)
    const firstWeekday = (getFirstWeekday(viewYear, viewMonth) + 6) % 7;
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;

    const cells: CalendarCell[] = [];

    for (let i = firstWeekday - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, month: prevMonth, year: prevYear, isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, month: viewMonth, year: viewYear, isCurrentMonth: true });
    }
    const totalCells = Math.ceil(cells.length / 7) * 7;
    let nextDay = 1;
    while (cells.length < totalCells) {
      cells.push({ day: nextDay++, month: nextMonth, year: nextYear, isCurrentMonth: false });
    }

    return cells;
  };

  const cells = buildCells();
  const yearGrid = Array.from({ length: 10 }, (_, i) => decadeStart + i);

  // ── Shared input element (used by both trigger variants) ──────────────────
  // Padding is handled by the parent container (date-picker__trigger or date-picker__date-input)
  const dateInput = (
    <input
      type="text"
      className="date-picker__trigger-input"
      value={inputValue}
      onChange={handleInputChange}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      onKeyDown={handleInputKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      aria-label="Date"
      aria-haspopup="dialog"
      aria-expanded={open}
    />
  );

  // ── Shared calendar icon button ────────────────────────────────────────────
  const calendarIconBtn = (size: number) => (
    <button
      type="button"
      className="date-picker__trigger-icon-btn"
      onClick={handleTriggerClick}
      disabled={disabled}
      tabIndex={-1}
      aria-hidden="true"
    >
      <CSvgIcon
        component={CalendarBlank}
        size={size}
      />
    </button>
  );

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="date-picker">
      {label && <label className="date-picker__label">{label}</label>}

      {/* ── Trigger — arrows variant ─────────────────────────────────── */}
      {showArrows ? (
        <div
          className={[
            "date-picker__trigger-group",
            disabled ? "date-picker__trigger-group--disabled" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* Left arrow — step back one day */}
          <button
            type="button"
            className="date-picker__arrow-btn"
            onClick={() => stepDay(-1)}
            disabled={disabled}
            title="Previous day"
            aria-label="Previous day"
          >
            <CSvgIcon component={ChevronLeft} size={16} />
          </button>

          {/* Inner date-input box — has its own border that creates the visual dividers.
              The border changes to brand-primary-subtle when the calendar is open (Figma). */}
          <div
            className={[
              "date-picker__date-input",
              open ? "date-picker__date-input--open" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {dateInput}
            {calendarIconBtn(18)}
          </div>

          {/* Right arrow — step forward one day */}
          <button
            type="button"
            className="date-picker__arrow-btn"
            onClick={() => stepDay(1)}
            disabled={disabled}
            title="Next day"
            aria-label="Next day"
          >
            <CSvgIcon component={ChevronRight} size={16} />
          </button>
        </div>
      ) : (
        /* ── Trigger — standard variant ────────────────────────────── */
        <div
          className={[
            "date-picker__trigger",
            open ? "date-picker__trigger--open" : "",
            disabled ? "date-picker__trigger--disabled" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {dateInput}
          {calendarIconBtn(16)}
        </div>
      )}

      {/* ── Popup ───────────────────────────────────────────────────────── */}
      {open && (
        <div className="date-picker__popup" role="dialog" aria-label="Date picker">

          {/* ── Calendar view ──────────────────────────────────────────── */}
          {view === "calendar" && (
            <>
              <div className="date-picker__nav">
                <button
                  className="date-picker__nav-arrow"
                  onClick={goPrevMonth}
                  aria-label="Previous month"
                >
                  <CSvgIcon component={ChevronLeft} size={14} />
                </button>

                <div className="date-picker__nav-center">
                  <button
                    className="date-picker__nav-btn"
                    onClick={openMonthView}
                    aria-label={`Select month, currently ${MONTH_FULL[viewMonth]}`}
                  >
                    {MONTH_FULL[viewMonth]}
                  </button>
                  <button
                    className="date-picker__nav-btn"
                    onClick={() => openYearView("calendar")}
                    aria-label={`Select year, currently ${viewYear}`}
                  >
                    {viewYear}
                  </button>
                </div>

                <button
                  className="date-picker__nav-arrow"
                  onClick={goNextMonth}
                  aria-label="Next month"
                >
                  <CSvgIcon component={ChevronRight} size={14} />
                </button>
              </div>

              {/* Day labels */}
              <div className="date-picker__day-labels" aria-hidden="true">
                {DAY_LABELS.map((lbl, i) => (
                  <div key={i} className="date-picker__day-label">{lbl}</div>
                ))}
              </div>

              {/* Day cells */}
              <div className="date-picker__day-grid" role="grid" aria-label="Calendar">
                {cells.map((cell, idx) => {
                  const date = new Date(cell.year, cell.month, cell.day);
                  const isToday = isSameDay(date, today);
                  const isSelected = value ? isSameDay(date, value) : false;

                  return (
                    <button
                      key={idx}
                      role="gridcell"
                      className={[
                        "date-picker__day-cell",
                        isSelected ? "date-picker__day-cell--selected" : "",
                        !cell.isCurrentMonth ? "date-picker__day-cell--outside" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => handleSelectDay(cell)}
                      disabled={!cell.isCurrentMonth}
                      aria-label={`${cell.day} ${MONTH_FULL[cell.month]} ${cell.year}`}
                      aria-selected={isSelected}
                      tabIndex={cell.isCurrentMonth ? 0 : -1}
                    >
                      <span className="date-picker__day-text">{cell.day}</span>
                      {isToday && <span className="date-picker__today-dot" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Month picker view ───────────────────────────────────────── */}
          {view === "month" && (
            <>
              <div className="date-picker__nav">
                <button
                  className="date-picker__nav-arrow"
                  onClick={() => setViewYear((y) => y - 1)}
                  aria-label="Previous year"
                >
                  <CSvgIcon component={ChevronLeft} size={14} />
                </button>

                <div className="date-picker__nav-center">
                  <button
                    className="date-picker__nav-btn"
                    onClick={() => openYearView("month")}
                    aria-label={`Select year, currently ${viewYear}`}
                  >
                    {viewYear}
                  </button>
                </div>

                <button
                  className="date-picker__nav-arrow"
                  onClick={() => setViewYear((y) => y + 1)}
                  aria-label="Next year"
                >
                  <CSvgIcon component={ChevronRight} size={14} />
                </button>
              </div>

              <div className="date-picker__grid-view" role="grid" aria-label="Month selection">
                {MONTH_SHORT.map((name, idx) => {
                  const isSelected =
                    value != null &&
                    idx === value.getMonth() &&
                    viewYear === value.getFullYear();
                  const isCurrent =
                    idx === today.getMonth() && viewYear === today.getFullYear();

                  return (
                    <button
                      key={name}
                      className={[
                        "date-picker__grid-cell",
                        isSelected ? "date-picker__grid-cell--selected" : "",
                        isCurrent && !isSelected ? "date-picker__grid-cell--current" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => handleSelectMonth(idx)}
                      aria-label={MONTH_FULL[idx]}
                      aria-selected={isSelected}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Year picker view ────────────────────────────────────────── */}
          {view === "year" && (
            <>
              <div className="date-picker__nav">
                <button
                  className="date-picker__nav-arrow"
                  onClick={() => setDecadeStart((d) => d - 10)}
                  aria-label="Previous decade"
                >
                  <CSvgIcon component={ChevronLeft} size={14} />
                </button>

                <div className="date-picker__nav-center">
                  <span className="date-picker__nav-range" aria-live="polite">
                    {decadeStart} – {decadeStart + 9}
                  </span>
                </div>

                <button
                  className="date-picker__nav-arrow"
                  onClick={() => setDecadeStart((d) => d + 10)}
                  aria-label="Next decade"
                >
                  <CSvgIcon component={ChevronRight} size={14} />
                </button>
              </div>

              <div className="date-picker__grid-view" role="grid" aria-label="Year selection">
                {yearGrid.map((year) => {
                  const isSelected = value != null && year === value.getFullYear();
                  const isCurrent = year === today.getFullYear();

                  return (
                    <button
                      key={year}
                      className={[
                        "date-picker__grid-cell",
                        isSelected ? "date-picker__grid-cell--selected" : "",
                        isCurrent && !isSelected ? "date-picker__grid-cell--current" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => handleSelectYear(year)}
                      aria-label={String(year)}
                      aria-selected={isSelected}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
