/**
 * TABLE SHOWCASE
 * Demonstrates CDataTable with mock employee data, column definitions, and pagination.
 * Import this into PlaygroundCanvas to see the data table.
 */
import { useState } from "react";
import { Stack, Box, Typography, Chip } from "@mui/material";
import type { MRT_ColumnDef } from "material-react-table";

import { CDataTable } from "@/core/components/table/DataTable";
import { CButton } from "@/core/components/button/button";
import CTextfield from "@/core/components/form/textfield/Textfield";
import CIconButton from "@/core/components/button/IconButton";
import CSvgIcon from "@/core/components/icon/Icon";
import { AddIcon, Edit, Delete, Download, Search } from "@/core/constants/icons";
import PageTemplate from "@/layouts/page-template/PageTemplate";
import type { Pagination } from "@/core/types/pagination.type";

type Employee = {
  id: number;
  name: string;
  department: string;
  role: string;
  status: "active" | "inactive" | "pending";
  location: string;
  joinDate: string;
};

const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, name: "Sarah Johnson", department: "Engineering", role: "Senior Engineer", status: "active", location: "New York", joinDate: "Jan 15, 2022" },
  { id: 2, name: "Marcus Williams", department: "Operations", role: "Operations Lead", status: "active", location: "Chicago", joinDate: "Mar 8, 2021" },
  { id: 3, name: "Emily Chen", department: "HR", role: "HR Manager", status: "active", location: "San Francisco", joinDate: "Jun 22, 2020" },
  { id: 4, name: "David Torres", department: "Finance", role: "Finance Analyst", status: "pending", location: "Austin", joinDate: "Feb 1, 2024" },
  { id: 5, name: "Priya Patel", department: "Engineering", role: "Junior Engineer", status: "active", location: "Seattle", joinDate: "Sep 10, 2023" },
  { id: 6, name: "James Lee", department: "Marketing", role: "Marketing Director", status: "inactive", location: "Boston", joinDate: "Apr 5, 2019" },
  { id: 7, name: "Olivia Brown", department: "Operations", role: "Store Manager", status: "active", location: "Denver", joinDate: "Jul 30, 2022" },
  { id: 8, name: "Amir Hassan", department: "Engineering", role: "Team Lead", status: "active", location: "Miami", joinDate: "Nov 11, 2021" },
  { id: 9, name: "Claire Martin", department: "Finance", role: "Controller", status: "active", location: "Dallas", joinDate: "Aug 20, 2020" },
  { id: 10, name: "Kevin Park", department: "HR", role: "Recruiter", status: "pending", location: "Atlanta", joinDate: "Jan 3, 2024" },
];

const STATUS_COLORS: Record<Employee["status"], "success" | "warning" | "error"> = {
  active: "success",
  pending: "warning",
  inactive: "error",
};

const columns: MRT_ColumnDef<Employee>[] = [
  {
    accessorKey: "name",
    header: "Employee Name",
    size: 200,
  },
  {
    accessorKey: "department",
    header: "Department",
    size: 150,
  },
  {
    accessorKey: "role",
    header: "Role",
    size: 180,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    Cell: ({ cell }) => {
      const status = cell.getValue<Employee["status"]>();
      return (
        <Chip
          label={status.charAt(0).toUpperCase() + status.slice(1)}
          color={STATUS_COLORS[status]}
          size="small"
          variant="outlined"
        />
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    size: 140,
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
    size: 130,
  },
  {
    id: "actions",
    header: "Actions",
    size: 100,
    Cell: () => (
      <Stack direction="row" gap={0.5}>
        <CIconButton size="small" walkMeId={["table-showcase", "edit"]}>
          <CSvgIcon component={Edit} size={16} />
        </CIconButton>
        <CIconButton size="small" walkMeId={["table-showcase", "delete"]}>
          <CSvgIcon component={Delete} size={16} />
        </CIconButton>
      </Stack>
    ),
  },
];

export default function TableShowcase() {
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    pageSize: 5,
    totalPages: 2,
    totalItems: MOCK_EMPLOYEES.length,
  });

  const filteredData = MOCK_EMPLOYEES.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase()) ||
    emp.role.toLowerCase().includes(search.toLowerCase())
  );

  const pageData = filteredData.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize
  );

  const tableProps = {
    columns,
    data: pageData,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    muiTableBodyRowProps: { hover: false },
  };

  return (
    <PageTemplate>
      <PageTemplate.Header>
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          <Box>
            <Typography variant="h6" fontWeight={600}>Employees</Typography>
            <Typography variant="caption" color="text.secondary">
              {filteredData.length} total employees
            </Typography>
          </Box>
          <Stack direction="row" gap={1}>
            <CButton severity="secondary" variant="outline">
              <CSvgIcon component={Download} color="primary" size={16} />
              Export
            </CButton>
            <CButton severity="primary" variant="solid">
              <CSvgIcon component={AddIcon} color="white" size={16} />
              Add Employee
            </CButton>
          </Stack>
        </Stack>
      </PageTemplate.Header>

      <PageTemplate.Content>
        <Stack gap={2}>
          {/* Search */}
          <Box maxWidth={320}>
            <CTextfield
              placeholder="Search employees..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
              startIcon={<CSvgIcon component={Search} size={18} color="secondary" />}
            />
          </Box>

          {/* Table */}
          <CDataTable
            tableProps={tableProps}
            pagination={{
              ...pagination,
              totalPages: Math.ceil(filteredData.length / pagination.pageSize),
              totalItems: filteredData.length,
            }}
            handlePaginationChange={(newPagination) => setPagination(newPagination)}
            walkMeIdPrefix={["table-showcase", "pagination"]}
            showPagination={filteredData.length > pagination.pageSize}
          />
        </Stack>
      </PageTemplate.Content>
    </PageTemplate>
  );
}
