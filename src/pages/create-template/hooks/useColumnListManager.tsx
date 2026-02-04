import { v4 as uuidv4 } from "uuid";

import useCreateTemplateForm from "./useCreateTemplateForm";
import type { ColumnProps } from "../types/columns.type";
import { newColumnDefaultData } from "../constants/questions";

export const addColumn = (data: ColumnProps[]) => {
  const newColumn = { ...newColumnDefaultData, columnId: uuidv4(), title: "" };
  return {
    updatedColumnList: [...data, newColumn],
    columnId: newColumn.columnId,
  };
};

export const addColumnAfter = (
  columnList: ColumnProps[],
  afterColumnId: string
): { updatedColumns: ColumnProps[]; newColumnId: string } => {
  const columnIndex = columnList.findIndex(
    (column) => column.columnId === afterColumnId
  );

  if (columnIndex === -1) {
    return { updatedColumns: columnList, newColumnId: "" };
  }

  const newColumn: ColumnProps = {
    ...newColumnDefaultData,
    columnId: uuidv4(),
    title: "",
  };

  // Insert the new empty column right after the specified column
  const updatedColumns: ColumnProps[] = [
    ...columnList.slice(0, columnIndex + 1),
    newColumn,
    ...columnList.slice(columnIndex + 1),
  ];

  return { updatedColumns, newColumnId: newColumn.columnId };
};

export const deleteColumn = (data: ColumnProps[], columnId: string) => {
  const updatedColumnList = data.filter(
    (column) => column.columnId !== columnId
  );
  return updatedColumnList;
};

export const copyColumn = (
  columnList: ColumnProps[],
  columnId: string
): { updatedColumns: ColumnProps[]; newColumnId: string; isValid: boolean } => {
  const columnIndex = columnList.findIndex(
    (column) => column.columnId === columnId
  );

  if (columnIndex === -1) {
    return { updatedColumns: columnList, newColumnId: "", isValid: false };
  }

  const columnToCopy = columnList[columnIndex];

  // Validate that the column has a title before copying
  if (!columnToCopy.title || columnToCopy.title.trim() === "") {
    return { updatedColumns: columnList, newColumnId: "", isValid: false };
  }

  const newColumn: ColumnProps = {
    ...columnToCopy,
    columnId: uuidv4(),
  };

  // Insert the new column right after the source column
  const updatedColumns: ColumnProps[] = [
    ...columnList.slice(0, columnIndex + 1),
    newColumn,
    ...columnList.slice(columnIndex + 1),
  ];

  return { updatedColumns, newColumnId: newColumn.columnId, isValid: true };
};

const useColumnListManager = () => {
  const { setFormValue, getFormValues, resetForm, triggerValidation } =
    useCreateTemplateForm();

  const addNewColumn = () => {
    const columnList = getFormValues("columns") as ColumnProps[];
    const { updatedColumnList, columnId } = addColumn(columnList);
    setFormValue("columns", updatedColumnList);
    return columnId;
  };

  const addNewColumnAfter = (afterColumnId: string): string => {
    const columnList = getFormValues("columns") as ColumnProps[];
    const { updatedColumns, newColumnId } = addColumnAfter(
      columnList,
      afterColumnId
    );
    setFormValue("columns", updatedColumns);
    return newColumnId;
  };

  const removeColumn = (columnId: string) => {
    const columnList = getFormValues("columns") as ColumnProps[];
    const updatedColumnList = deleteColumn(columnList, columnId);
    setFormValue("columns", updatedColumnList);
    resetForm({
      ...getFormValues(),
      columns: updatedColumnList,
    } as { columns: ColumnProps[] });
  };

  const copyExistingColumn = (columnId: string) => {
    const columnList = getFormValues("columns") as ColumnProps[];
    const { updatedColumns, newColumnId, isValid } = copyColumn(
      columnList,
      columnId
    );

    if (!isValid) {
      triggerValidation("columns");
      return "";
    }
    setFormValue("columns", updatedColumns);
    return newColumnId;
  };

  return {
    addNewColumn,
    removeColumn,
    copyExistingColumn,
    addNewColumnAfter,
  };
};

export default useColumnListManager;
