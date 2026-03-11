import React, { useState } from "react";
import classNames from "classnames";
import CTextfield from "@/core/components/form/textfield/Textfield";
import { CButton } from "@/core/components/button/button";
import CCheckbox from "@/core/components/form/checkbox/Checkbox";
import type { ManageColumnsPanelProps, TableColumn } from "@/core/types/more-options.type";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import SearchIcon from "@/assets/icons/common-icons/search.svg?react";
import ChevronLeftIcon from "@/assets/icons/arrow/chevron-left-large.svg?react";
import LockIcon from "@/assets/icons/common-icons/lock.svg?react";
import UnlockIcon from "@/assets/icons/common-icons/unlock.svg?react";
import DragIcon from "@/assets/icons/common-icons/draggable-dots.svg?react";

interface SortableItemProps {
  col: TableColumn;
  toggleFreeze: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ col, toggleFreeze }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: col.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    boxShadow: isDragging ? "0px 4px 12px rgba(0, 0, 0, 0.15)" : "none",
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={classNames("manage-columns__drag-item", {
        "manage-columns__drag-item--frozen": col.frozen,
        "manage-columns__drag-item--dragging": isDragging,
      })}
    >
      <div className="manage-columns__drag-item-label" title={col.label}>
        {col.label}
      </div>
      <div className="manage-columns__drag-item-actions">
        <button type="button" onClick={() => toggleFreeze(col.id)} aria-label={col.frozen ? "Unlock" : "Lock"}>
          {col.frozen ? <LockIcon /> : <UnlockIcon />}
        </button>
        <div
          {...attributes}
          {...listeners}
          style={{ cursor: "grab", display: "flex", padding: "4px" }}
        >
          <DragIcon />
        </div>
      </div>
    </div>
  );
};

const ManageColumnsPanel: React.FC<ManageColumnsPanelProps> = ({
  onClose,
  onBack,
  columns,
  onColumnsChange,
}) => {
  const [internalCols, setInternalCols] = useState<TableColumn[]>(columns);
  const [search, setSearch] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleReset = () => {
    // Ideally this would reset to standard defaults. Mocked to columns passed.
    setInternalCols(columns);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSave = () => {
    onColumnsChange?.(internalCols);
    onClose();
  };

  const toggleVisibility = (id: string, checked: boolean) => {
    setInternalCols(prev => prev.map(c => c.id === id ? { ...c, visible: checked } : c));
  };

  const toggleFreeze = (id: string) => {
    setInternalCols(prev => prev.map(c => c.id === id ? { ...c, frozen: !c.frozen } : c));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setInternalCols((items) => {
        const activeIndex = items.findIndex((item) => item.id === active.id);
        const overIndex = items.findIndex((item) => item.id === over.id);
        
        // Prevent moving an element to before frozen columns (or frozen below unfrozen)
        // For simplicity, we just use standard arrayMove unless specific constraints are needed
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

  const filteredCols = internalCols.filter(col => 
    col.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="manage-columns">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="manage-columns__header">
        <button type="button" className="manage-columns__back-btn" onClick={onBack}>
          <ChevronLeftIcon />
          <span>Manage Column</span>
        </button>
        <button type="button" className="manage-columns__reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="manage-columns__body">
        
        {/* Left Pane: Choose Columns */}
        <div className="manage-columns__left-pane">
          <CTextfield
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            startIcon={<SearchIcon />}
            className="manage-columns__search"
            fullWidth
          />
          <h4 className="manage-columns__list-title">Choose Columns</h4>
          <div className="manage-columns__scroll-list">
            {filteredCols.map(col => (
              <label key={col.id} className="manage-columns__checkbox-item">
                <CCheckbox
                  checked={col.visible}
                  onChange={(e) => toggleVisibility(col.id, (e.target as HTMLInputElement).checked)}
                />
                <span>{col.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Right Pane: Column Order */}
        <div className="manage-columns__right-pane">
          <div className="manage-columns__right-header">
            <h4 className="manage-columns__list-title">Column Order</h4>
            <div className="manage-columns__list-hint">
              drag to reorder<br/>
              lock to freeze the columns
            </div>
          </div>
          <div className="manage-columns__scroll-list">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={internalCols.filter(c => c.visible).map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {internalCols.filter(c => c.visible).map((col) => (
                  <SortableItem key={col.id} col={col} toggleFreeze={toggleFreeze} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────── */}
      <div className="manage-columns__footer">
        <CButton severity="secondary" variant="solid" size="medium" onClick={handleCancel}>
          Cancel
        </CButton>
        <CButton severity="primary" variant="solid" size="medium" onClick={handleSave}>
          Save
        </CButton>
      </div>
    </div>
  );
};

export default ManageColumnsPanel;
