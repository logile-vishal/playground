import { useState, useRef, useEffect } from "react";
import CSvgIcon from "@/core/components/icon/Icon";
import { CalendarBlank, ChevronLeft, ChevronRight } from "@/core/constants/icons";
import type { WeekPickerProps } from "@/core/types/date-picker.type";
import "./DatePicker.scss";
import "./WeekPicker.scss";

// ─── Constants ─────────────────────────────────────────────────────────────────

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
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Returns the Monday of the week containing `date`. Week starts on Monday. */
function getWeekStart(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

/** Returns Sunday (last day) of a week given its Monday. */
function getWeekEnd(weekStart: Date): Date {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + 6);
  return d;
}

/** Format the trigger label: M/D/YY - M/D/YY */
function formatWeekRange(weekStart: Date): string {
  const weekEnd = getWeekEnd(weekStart);
  const fmt = (d: Date) =>
    `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(2)}`;
  return `${fmt(weekStart)} - ${fmt(weekEnd)}`;
}

/**
 * Parse a date string typed by the user and return the Monday of that week.
 * Accepts MM/DD/YYYY or M/D/YY (2-digit year: 26 → 2026).
 * Returns null if the string is empty or invalid.
 */
function parseWeekInput(str: string): Date | null {
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
  if (date.getMonth() !== m - 1) return null;
  return getWeekStart(date); // snap to Monday of that week
}

function getDecadeStart(year: number): number {
  return Math.floor(year / 10) * 10;
}

// ─── Types ─────────────────────────────────────────────────────────────────────

type View = "calendar" | "month" | "year";

type CalendarCell = {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function WeekPicker({
  value,
  onChange,
  disabled = false,
  label,
  showArrows = true,
}: WeekPickerProps) {
  const today = new Date();
  const weekStart = value ? getWeekStart(value) : null;

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("calendar");
  const [yearOrigin, setYearOrigin] = useState<"calendar" | "month">("calendar");

  const initRef = weekStart ?? today;
  const [viewYear, setViewYear] = useState(() => initRef.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => initRef.getMonth());
  const [decadeStart, setDecadeStart] = useState(() =>
    getDecadeStart(initRef.getFullYear())
  );

  // Controlled text value — shows "M/D/YY - M/D/YY" when committed, raw text while typing
  const [inputValue, setInputValue] = useState(() =>
    weekStart ? formatWeekRange(weekStart) : ""
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync input text when value prop changes from outside
  useEffect(() => {
    setInputValue(weekStart ? formatWeekRange(weekStart) : "");
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset calendar view when popup closes
  useEffect(() => {
    if (!open) {
      const ref = weekStart ?? new Date();
      setViewYear(ref.getFullYear());
      setViewMonth(ref.getMonth());
      setDecadeStart(getDecadeStart(ref.getFullYear()));
      setView("calendar");
    }
  }, [open, value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // ── Commit helper ──────────────────────────────────────────────────────────
  // Parse the current input text: find the Monday of that week and fire onChange.
  // Reverts to the last known value if the text is invalid.
  const commitInput = () => {
    const monday = parseWeekInput(inputValue);
    if (monday) {
      onChange?.(monday);
      setInputValue(formatWeekRange(monday));
    } else {
      // Revert to last valid value
      setInputValue(weekStart ? formatWeekRange(weekStart) : "");
    }
  };

  // ── Input event handlers ───────────────────────────────────────────────────

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputFocus = () => {
    if (disabled || open) return;
    const ref = weekStart ?? today;
    setViewYear(ref.getFullYear());
    setViewMonth(ref.getMonth());
    setDecadeStart(getDecadeStart(ref.getFullYear()));
    setView("calendar");
    setOpen(true);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Stay open if focus moved to something inside the picker (e.g. calendar cell)
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    commitInput();
    setOpen(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitInput();
      setOpen(false);
    } else if (e.key === "Escape") {
      setInputValue(weekStart ? formatWeekRange(weekStart) : "");
      setOpen(false);
    }
  };

  // ── Calendar icon — toggles popup ─────────────────────────────────────────
  const handleTriggerClick = () => {
    if (disabled) return;
    if (open) {
      setOpen(false);
    } else {
      const ref = weekStart ?? today;
      setViewYear(ref.getFullYear());
      setViewMonth(ref.getMonth());
      setDecadeStart(getDecadeStart(ref.getFullYear()));
      setView("calendar");
      setOpen(true);
    }
  };

  /** Step selected week by ±1. */
  const stepWeek = (delta: 1 | -1) => {
    if (disabled) return;
    const base = weekStart ?? getWeekStart(today);
    const next = new Date(base);
    next.setDate(next.getDate() + delta * 7);
    onChange?.(next);
    setOpen(false);
  };

  /** Select the week whose Monday is `monday`. */
  const handleSelectWeek = (monday: Date) => {
    onChange?.(monday);
    setOpen(false);
    setView("calendar");
  };

  // ── Calendar navigation ───────────────────────────────────────────────────

  const goPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const goNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  // ── Month / Year picker ───────────────────────────────────────────────────

  const handleSelectMonth = (monthIndex: number) => {
    setViewMonth(monthIndex);
    setView("calendar");
  };

  const openYearView = (from: "calendar" | "month") => {
    setYearOrigin(from);
    setDecadeStart(getDecadeStart(viewYear));
    setView("year");
  };

  const handleSelectYear = (year: number) => {
    setViewYear(year);
    setDecadeStart(getDecadeStart(year));
    setView(yearOrigin);
  };

  // ── Build calendar rows ───────────────────────────────────────────────────

  const buildRows = (): CalendarCell[][] => {
    const firstWeekday = (getFirstWeekday(viewYear, viewMonth) + 6) % 7;
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;

    const cells: CalendarCell[] = [];
    for (let i = firstWeekday - 1; i >= 0; i--)
      cells.push({ day: daysInPrevMonth - i, month: prevMonth, year: prevYear, isCurrentMonth: false });
    for (let d = 1; d <= daysInMonth; d++)
      cells.push({ day: d, month: viewMonth, year: viewYear, isCurrentMonth: true });
    const totalCells = Math.ceil(cells.length / 7) * 7;
    let nextDay = 1;
    while (cells.length < totalCells)
      cells.push({ day: nextDay++, month: nextMonth, year: nextYear, isCurrentMonth: false });

    const rows: CalendarCell[][] = [];
    for (let i = 0; i < cells.length; i += 7)
      rows.push(cells.slice(i, i + 7));
    return rows;
  };

  const rows = buildRows();
  const yearGrid = Array.from({ length: 10 }, (_, i) => decadeStart + i);

  // ── Shared sub-elements ───────────────────────────────────────────────────

  // Matches DatePicker's editable input pattern — commit on blur/Enter, revert on Escape
  const dateInput = (
    <input
      type="text"
      className="date-picker__trigger-input week-picker__trigger-input"
      value={inputValue}
      onChange={handleInputChange}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      onKeyDown={handleInputKeyDown}
      placeholder="MM/DD/YYYY"
      disabled={disabled}
      aria-label="Week start date"
      aria-haspopup="dialog"
      aria-expanded={open}
    />
  );

  const calendarIconBtn = (
    <button
      type="button"
      className="date-picker__trigger-icon-btn"
      onClick={handleTriggerClick}
      disabled={disabled}
      tabIndex={-1}
      aria-hidden="true"
    >
      <CSvgIcon component={CalendarBlank} size={18} />
    </button>
  );

  // ── Trigger — arrows vs standard ─────────────────────────────────────────

  const trigger = showArrows ? (
    <div
      className={[
        "date-picker__trigger-group",
        disabled ? "date-picker__trigger-group--disabled" : "",
      ].filter(Boolean).join(" ")}
    >
      <button
        type="button"
        className="date-picker__arrow-btn"
        onClick={() => stepWeek(-1)}
        disabled={disabled}
        aria-label="Previous week"
      >
        <CSvgIcon component={ChevronLeft} size={16} />
      </button>

      <div
        className={[
          "date-picker__date-input",
          open ? "date-picker__date-input--open" : "",
        ].filter(Boolean).join(" ")}
      >
        {dateInput}
        {calendarIconBtn}
      </div>

      <button
        type="button"
        className="date-picker__arrow-btn"
        onClick={() => stepWeek(1)}
        disabled={disabled}
        aria-label="Next week"
      >
        <CSvgIcon component={ChevronRight} size={16} />
      </button>
    </div>
  ) : (
    // Standard trigger — no onClick on the div; input onFocus and icon onClick handle opening.
    // This matches DatePicker's interaction exactly.
    <div
      className={[
        "date-picker__trigger",
        open ? "date-picker__trigger--open" : "",
        disabled ? "date-picker__trigger--disabled" : "",
      ].filter(Boolean).join(" ")}
    >
      {dateInput}
      {calendarIconBtn}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className={[
        "date-picker week-picker",
        showArrows ? "week-picker--with-arrows" : "week-picker--no-arrows",
      ].join(" ")}
    >
      {label && <label className="date-picker__label">{label}</label>}

      {trigger}

      {/* ── Popup ───────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="date-picker__popup week-picker__popup"
          role="dialog"
          aria-label="Week picker"
        >
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
                    onClick={() => setView("month")}
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

              {/* Day-of-week labels */}
              <div className="date-picker__day-labels" aria-hidden="true">
                {DAY_LABELS.map((lbl, i) => (
                  <div key={i} className="date-picker__day-label">{lbl}</div>
                ))}
              </div>

              {/* Calendar grid — rows of 7, only Monday is interactive */}
              <div
                className="week-picker__day-grid"
                role="grid"
                aria-label="Calendar"
              >
                {rows.map((row, rowIdx) => {
                  const monday = new Date(row[0].year, row[0].month, row[0].day);
                  const isSelectedRow = weekStart ? isSameDay(monday, weekStart) : false;

                  return (
                    <div
                      key={rowIdx}
                      className={[
                        "week-picker__week-row",
                        isSelectedRow ? "week-picker__week-row--selected" : "",
                      ].filter(Boolean).join(" ")}
                    >
                      {row.map((cell, cellIdx) => {
                        const isMonday = cellIdx === 0;
                        const date = new Date(cell.year, cell.month, cell.day);
                        const isToday = isSameDay(date, today);

                        if (isMonday) {
                          return (
                            <button
                              key={cellIdx}
                              role="gridcell"
                              className={[
                                "date-picker__day-cell",
                                "week-picker__day-cell",
                                "week-picker__day-cell--monday",
                                !cell.isCurrentMonth ? "week-picker__day-cell--outside" : "",
                                isSelectedRow ? "week-picker__day-cell--selected-monday" : "",
                              ].filter(Boolean).join(" ")}
                              onClick={() => handleSelectWeek(monday)}
                              aria-label={`Week of ${cell.day} ${MONTH_FULL[cell.month]} ${cell.year}`}
                              aria-selected={isSelectedRow}
                            >
                              <span className="date-picker__day-text">{cell.day}</span>
                              {isToday && (
                                <span className="date-picker__today-dot" aria-hidden="true" />
                              )}
                            </button>
                          );
                        }

                        // Tue–Sun: non-interactive — rendered as <span>, never clickable
                        return (
                          <span
                            key={cellIdx}
                            role="gridcell"
                            aria-disabled="true"
                            className={[
                              "date-picker__day-cell",
                              "week-picker__day-cell",
                              "week-picker__day-cell--non-monday",
                              isSelectedRow ? "week-picker__day-cell--in-selected-week" : "",
                            ].filter(Boolean).join(" ")}
                          >
                            <span className="date-picker__day-text">{cell.day}</span>
                            {isToday && (
                              <span className="date-picker__today-dot" aria-hidden="true" />
                            )}
                          </span>
                        );
                      })}
                    </div>
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
                {MONTH_SHORT.map((name, idx) => (
                  <button
                    key={name}
                    className={[
                      "date-picker__grid-cell",
                      idx === today.getMonth() && viewYear === today.getFullYear()
                        ? "date-picker__grid-cell--current"
                        : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() => handleSelectMonth(idx)}
                    aria-label={MONTH_FULL[idx]}
                  >
                    {name}
                  </button>
                ))}
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
                {yearGrid.map((year) => (
                  <button
                    key={year}
                    className={[
                      "date-picker__grid-cell",
                      year === today.getFullYear() ? "date-picker__grid-cell--current" : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() => handleSelectYear(year)}
                    aria-label={String(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
