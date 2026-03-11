import { useState, useRef, useEffect } from "react";
import CSvgIcon from "@/core/components/icon/Icon";
import { CalendarBlank, ChevronLeft, ChevronRight } from "@/core/constants/icons";
import type { DateRange, RangeDatePickerProps } from "@/core/types/date-picker.type";
import "./DatePicker.scss";
import "./RangeDatePicker.scss";

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

/** Returns true if date `a` is strictly before date `b` (day-level comparison). */
function isBeforeDay(a: Date, b: Date): boolean {
  if (a.getFullYear() !== b.getFullYear()) return a.getFullYear() < b.getFullYear();
  if (a.getMonth() !== b.getMonth()) return a.getMonth() < b.getMonth();
  return a.getDate() < b.getDate();
}

function formatDate(date: Date): string {
  // MM/DD/YY — Logile standard display format for all date pickers.
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

/**
 * Parse a date string typed by the user.
 * Accepts MM/DD/YY or MM/DD/YYYY (2-digit year: 26 → 2026).
 * Returns null if the string is empty or invalid.
 */
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

// ─── Types ─────────────────────────────────────────────────────────────────────

type View = "calendar" | "month" | "year";
type SelectingField = "start" | "end";

type CalendarCell = {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function RangeDatePicker({
  startDate = null,
  endDate = null,
  onChange,
  disabled = false,
  label,
  showArrows = true,
}: RangeDatePickerProps) {
  const today = new Date();

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("calendar");
  const [yearOrigin, setYearOrigin] = useState<"calendar" | "month">("calendar");

  const [viewYear, setViewYear] = useState(() => (startDate ?? today).getFullYear());
  const [viewMonth, setViewMonth] = useState(() => (startDate ?? today).getMonth());
  const [decadeStart, setDecadeStart] = useState(() =>
    getDecadeStart((startDate ?? today).getFullYear())
  );

  // In-progress selection — only committed to the parent on Apply.
  const [pendingStart, setPendingStart] = useState<Date | null>(startDate);
  const [pendingEnd, setPendingEnd] = useState<Date | null>(endDate);

  // Which field the next calendar click will target.
  const [selectingField, setSelectingField] = useState<SelectingField>("start");

  // Hover date — used to preview the range while the user mouses over cells.
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Whether the popup should open above the trigger (flips when there's not enough space below).
  const [popupAbove, setPopupAbove] = useState(false);

  // Raw text in each input field.
  const [startInputValue, setStartInputValue] = useState(
    () => startDate ? formatDate(startDate) : ""
  );
  const [endInputValue, setEndInputValue] = useState(
    () => endDate ? formatDate(endDate) : ""
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  // Sync text + pending state when props change from outside (e.g. parent resets value).
  useEffect(() => {
    setStartInputValue(startDate ? formatDate(startDate) : "");
    setPendingStart(startDate ?? null);
  }, [startDate]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setEndInputValue(endDate ? formatDate(endDate) : "");
    setPendingEnd(endDate ?? null);
  }, [endDate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset calendar view when the popup closes.
  useEffect(() => {
    if (!open) {
      const ref = startDate ?? today;
      setViewYear(ref.getFullYear());
      setViewMonth(ref.getMonth());
      setDecadeStart(getDecadeStart(ref.getFullYear()));
      setView("calendar");
      setHoverDate(null);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click — treat as Cancel (revert to last committed values).
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        cancelAndClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, startDate, endDate]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Open popup ────────────────────────────────────────────────────────────
  const openPopup = (field: SelectingField) => {
    if (disabled) return;
    const ref = startDate ?? today;
    setViewYear(ref.getFullYear());
    setViewMonth(ref.getMonth());
    setDecadeStart(getDecadeStart(ref.getFullYear()));
    setView("calendar");
    // Reset pending to last committed values.
    setPendingStart(startDate ?? null);
    setPendingEnd(endDate ?? null);
    setStartInputValue(startDate ? formatDate(startDate) : "");
    setEndInputValue(endDate ? formatDate(endDate) : "");
    setSelectingField(field);
    setHoverDate(null);
    // Flip popup above the trigger if there's not enough space below.
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const spaceBelow = window.innerHeight - containerRect.bottom;
      setPopupAbove(spaceBelow < 450);
    }
    setOpen(true);
  };

  // ── Cancel — revert and close ─────────────────────────────────────────────
  const cancelAndClose = () => {
    setStartInputValue(startDate ? formatDate(startDate) : "");
    setEndInputValue(endDate ? formatDate(endDate) : "");
    setPendingStart(startDate ?? null);
    setPendingEnd(endDate ?? null);
    setOpen(false);
    setView("calendar");
    setHoverDate(null);
  };

  // ── Apply — commit pending values ─────────────────────────────────────────
  const handleApply = () => {
    onChange?.({ start: pendingStart, end: pendingEnd });
    setOpen(false);
    setView("calendar");
    setHoverDate(null);
  };

  // ── Input change handlers ─────────────────────────────────────────────────
  const handleStartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStartInputValue(val);
    const parsed = parseInputDate(val);
    if (parsed) {
      setPendingStart(parsed);
      // If the new start is after the pending end, clear the end.
      if (pendingEnd && isBeforeDay(pendingEnd, parsed)) {
        setPendingEnd(null);
        setEndInputValue("");
      }
    }
  };

  const handleEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEndInputValue(val);
    const parsed = parseInputDate(val);
    if (parsed) setPendingEnd(parsed);
  };

  // ── Input focus handlers — open popup or update the active field ──────────
  const handleStartInputFocus = () => {
    if (disabled) return;
    setSelectingField("start");
    if (!open) openPopup("start");
  };

  const handleEndInputFocus = () => {
    if (disabled) return;
    setSelectingField("end");
    if (!open) openPopup("end");
  };

  // ── Keyboard handlers ─────────────────────────────────────────────────────
  const handleStartInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const parsed = parseInputDate(startInputValue);
      if (parsed) {
        setPendingStart(parsed);
        setStartInputValue(formatDate(parsed));
        // Clear end if it's now before the new start.
        if (pendingEnd && isBeforeDay(pendingEnd, parsed)) {
          setPendingEnd(null);
          setEndInputValue("");
        }
        // Advance focus to end input.
        setSelectingField("end");
        endInputRef.current?.focus();
      } else {
        // Revert to last valid value.
        setStartInputValue(startDate ? formatDate(startDate) : "");
      }
    } else if (e.key === "Escape") {
      cancelAndClose();
    }
  };

  const handleEndInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const parsed = parseInputDate(endInputValue);
      if (parsed) {
        setPendingEnd(parsed);
        setEndInputValue(formatDate(parsed));
      } else {
        // Revert to last valid value.
        setEndInputValue(endDate ? formatDate(endDate) : "");
      }
    } else if (e.key === "Escape") {
      cancelAndClose();
    }
  };

  // Blur: if focus leaves the entire picker container, treat as Cancel.
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    if (open) cancelAndClose();
  };

  // ── Calendar icon — toggle popup ─────────────────────────────────────────
  const handleTriggerIconClick = () => {
    if (disabled) return;
    if (open) cancelAndClose();
    else openPopup("start");
  };

  // ── Arrow nav — step the committed range by ±1 day ───────────────────────
  const stepRange = (delta: 1 | -1) => {
    if (disabled) return;
    const newStart = startDate ? new Date(startDate) : null;
    const newEnd = endDate ? new Date(endDate) : null;
    if (newStart) newStart.setDate(newStart.getDate() + delta);
    if (newEnd) newEnd.setDate(newEnd.getDate() + delta);
    onChange?.({ start: newStart, end: newEnd });
    setOpen(false);
  };

  // ── Calendar day click ────────────────────────────────────────────────────
  const handleDayClick = (cell: CalendarCell) => {
    const clicked = new Date(cell.year, cell.month, cell.day);

    if (selectingField === "start") {
      setPendingStart(clicked);
      setStartInputValue(formatDate(clicked));
      // If the new start is after the pending end, clear the end.
      if (pendingEnd && isBeforeDay(pendingEnd, clicked)) {
        setPendingEnd(null);
        setEndInputValue("");
      }
      // Advance to end.
      setSelectingField("end");
      endInputRef.current?.focus();
    } else {
      // Selecting end.
      if (pendingStart && isBeforeDay(clicked, pendingStart)) {
        // Clicked before current start — set clicked as new start and clear end.
        setPendingStart(clicked);
        setStartInputValue(formatDate(clicked));
        setPendingEnd(null);
        setEndInputValue("");
        setSelectingField("end");
      } else {
        // Valid end date.
        setPendingEnd(clicked);
        setEndInputValue(formatDate(clicked));
        // Cycle back to start for the next interaction.
        setSelectingField("start");
      }
    }
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

  // ── Month / Year views ────────────────────────────────────────────────────
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

  // ── Build calendar cells ──────────────────────────────────────────────────
  const buildCells = (): CalendarCell[] => {
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
    return cells;
  };

  const cells = buildCells();
  const yearGrid = Array.from({ length: 10 }, (_, i) => decadeStart + i);

  // ── Range cell helpers ────────────────────────────────────────────────────

  // Effective end: use pendingEnd if set, otherwise the hoverDate as a live preview
  // while the user is mousing over potential end dates.
  const effectiveStart = pendingStart;
  const effectiveEnd =
    pendingEnd ??
    (selectingField === "end" && hoverDate && effectiveStart && !isBeforeDay(hoverDate, effectiveStart)
      ? hoverDate
      : null);

  const isCellRangeStart = (cell: CalendarCell): boolean => {
    if (!effectiveStart) return false;
    return isSameDay(new Date(cell.year, cell.month, cell.day), effectiveStart);
  };

  const isCellRangeEnd = (cell: CalendarCell): boolean => {
    if (!effectiveEnd) return false;
    return isSameDay(new Date(cell.year, cell.month, cell.day), effectiveEnd);
  };

  const isCellInRange = (cell: CalendarCell): boolean => {
    if (!effectiveStart || !effectiveEnd) return false;
    const d = new Date(cell.year, cell.month, cell.day);
    return (
      !isSameDay(d, effectiveStart) &&
      !isSameDay(d, effectiveEnd) &&
      !isBeforeDay(d, effectiveStart) &&
      !isBeforeDay(effectiveEnd, d)
    );
  };

  // Apply is only enabled when both dates are selected.
  const canApply = pendingStart !== null && pendingEnd !== null;

  // ─────────────────────────────────────────────────────────────────────────────
  // Sub-elements
  // ─────────────────────────────────────────────────────────────────────────────

  const startInput = (
    <input
      ref={startInputRef}
      type="text"
      className="date-picker__trigger-input range-date-picker__field-input"
      value={startInputValue}
      onChange={handleStartInputChange}
      onFocus={handleStartInputFocus}
      onBlur={handleInputBlur}
      onKeyDown={handleStartInputKeyDown}
      placeholder="MM/DD/YY"
      disabled={disabled}
      aria-label="Start date"
      aria-haspopup="dialog"
      aria-expanded={open}
    />
  );

  const endInput = (
    <input
      ref={endInputRef}
      type="text"
      className="date-picker__trigger-input range-date-picker__field-input"
      value={endInputValue}
      onChange={handleEndInputChange}
      onFocus={handleEndInputFocus}
      onBlur={handleInputBlur}
      onKeyDown={handleEndInputKeyDown}
      placeholder="MM/DD/YY"
      disabled={disabled}
      aria-label="End date"
    />
  );

  const calendarIconBtn = (
    <button
      type="button"
      className="date-picker__trigger-icon-btn"
      onClick={handleTriggerIconClick}
      disabled={disabled}
      tabIndex={-1}
      aria-hidden="true"
    >
      <CSvgIcon component={CalendarBlank} size={18} />
    </button>
  );

  // The dual-input date area — used in both trigger variants.
  const dateArea = (
    <div
      className={[
        "range-date-picker__date-area",
        open ? "range-date-picker__date-area--open" : "",
      ].filter(Boolean).join(" ")}
    >
      {/* Start field — clicking anywhere in the field focuses the input, which opens the popup */}
      <div
        className={[
          "range-date-picker__field",
          open && selectingField === "start" ? "range-date-picker__field--active" : "",
        ].filter(Boolean).join(" ")}
        onClick={() => {
          setSelectingField("start");
          startInputRef.current?.focus();
        }}
      >
        {startInput}
      </div>

      <span className="range-date-picker__separator" aria-hidden="true">–</span>

      {/* End field — clicking anywhere in the field focuses the input, which opens the popup */}
      <div
        className={[
          "range-date-picker__field",
          open && selectingField === "end" ? "range-date-picker__field--active" : "",
        ].filter(Boolean).join(" ")}
        onClick={() => {
          setSelectingField("end");
          endInputRef.current?.focus();
        }}
      >
        {endInput}
      </div>

      {calendarIconBtn}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className={[
        "date-picker range-date-picker",
        showArrows ? "range-date-picker--with-arrows" : "range-date-picker--no-arrows",
      ].join(" ")}
    >
      {label && <label className="date-picker__label">{label}</label>}

      {/* ── Trigger — arrows variant ─────────────────────────────────── */}
      {showArrows ? (
        <div
          className={[
            "date-picker__trigger-group",
            disabled ? "date-picker__trigger-group--disabled" : "",
          ].filter(Boolean).join(" ")}
        >
          <button
            type="button"
            className="date-picker__arrow-btn"
            onClick={() => stepRange(-1)}
            disabled={disabled}
            aria-label="Previous day"
          >
            <CSvgIcon component={ChevronLeft} size={16} />
          </button>

          {dateArea}

          <button
            type="button"
            className="date-picker__arrow-btn"
            onClick={() => stepRange(1)}
            disabled={disabled}
            aria-label="Next day"
          >
            <CSvgIcon component={ChevronRight} size={16} />
          </button>
        </div>
      ) : (
        /* ── Trigger — standard variant (no arrows) ─────────────────── */
        <div
          className={[
            "date-picker__trigger",
            open ? "date-picker__trigger--open" : "",
            disabled ? "date-picker__trigger--disabled" : "",
          ].filter(Boolean).join(" ")}
        >
          {dateArea}
        </div>
      )}

      {/* ── Popup ───────────────────────────────────────────────────────── */}
      {open && (
        <div
          className={[
            "date-picker__popup range-date-picker__popup",
            popupAbove ? "range-date-picker__popup--above" : "",
          ].filter(Boolean).join(" ")}
          role="dialog"
          aria-label="Date range picker"
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

              <div className="date-picker__day-labels" aria-hidden="true">
                {DAY_LABELS.map((lbl, i) => (
                  <div key={i} className="date-picker__day-label">{lbl}</div>
                ))}
              </div>

              <div className="date-picker__day-grid" role="grid" aria-label="Calendar">
                {cells.map((cell, idx) => {
                  const date = new Date(cell.year, cell.month, cell.day);
                  const isToday = isSameDay(date, today);
                  const isStart = isCellRangeStart(cell);
                  const isEnd = isCellRangeEnd(cell);
                  const inRange = isCellInRange(cell);

                  return (
                    <button
                      key={idx}
                      role="gridcell"
                      className={[
                        "date-picker__day-cell",
                        isStart ? "range-date-picker__day-cell--range-start" : "",
                        isEnd ? "range-date-picker__day-cell--range-end" : "",
                        inRange ? "range-date-picker__day-cell--in-range" : "",
                        !cell.isCurrentMonth ? "date-picker__day-cell--outside" : "",
                      ].filter(Boolean).join(" ")}
                      onClick={() => handleDayClick(cell)}
                      disabled={!cell.isCurrentMonth}
                      onMouseEnter={() => setHoverDate(date)}
                      onMouseLeave={() => setHoverDate(null)}
                      aria-label={`${cell.day} ${MONTH_FULL[cell.month]} ${cell.year}`}
                      aria-selected={isStart || isEnd}
                      tabIndex={cell.isCurrentMonth ? 0 : -1}
                    >
                      <span className="date-picker__day-text">{cell.day}</span>
                      {isToday && (
                        <span className="date-picker__today-dot" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── Footer — Cancel + Apply ─────────────────────────── */}
              <div className="range-date-picker__footer">
                <button
                  type="button"
                  className="range-date-picker__cancel-btn"
                  onClick={cancelAndClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="range-date-picker__apply-btn"
                  onClick={handleApply}
                  disabled={!canApply}
                >
                  Apply
                </button>
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
