/**
 * FULL PAGE MOCKUP
 * A complete page prototype using PageTemplate, filters, tabs, modal, and a data table.
 * Shows how a real app page is assembled from components.
 * Import this into PlaygroundCanvas to see a complete page layout.
 */
import { useState } from "react";
import { Stack, Box, Typography, Divider, Chip } from "@mui/material";
import type { MRT_ColumnDef } from "material-react-table";

import { CButton } from "@/core/components/button/button";
import CTextfield from "@/core/components/form/textfield/Textfield";
import CSelect from "@/core/components/form/select/Select";
import CModal, { ModalBody } from "@/core/components/modal/Modal";
import { CDataTable } from "@/core/components/table/DataTable";
import CSvgIcon from "@/core/components/icon/Icon";
import CIconButton from "@/core/components/button/IconButton";
import PageTemplate from "@/layouts/page-template/PageTemplate";
import {
  AddIcon, Search, Filter, Delete, Edit, Download, Check, Close
} from "@/core/constants/icons";
import type { Pagination } from "@/core/types/pagination.type";

type Task = {
  id: number;
  title: string;
  assignee: string;
  priority: "high" | "medium" | "low";
  status: "open" | "in-progress" | "done";
  dueDate: string;
};

const MOCK_TASKS: Task[] = [
  { id: 1, title: "Update store safety protocols", assignee: "Sarah J.", priority: "high", status: "open", dueDate: "Mar 10, 2026" },
  { id: 2, title: "Monthly inventory audit", assignee: "Marcus W.", priority: "medium", status: "in-progress", dueDate: "Mar 15, 2026" },
  { id: 3, title: "Employee onboarding checklist", assignee: "Emily C.", priority: "low", status: "done", dueDate: "Feb 28, 2026" },
  { id: 4, title: "Q1 compliance review", assignee: "David T.", priority: "high", status: "open", dueDate: "Mar 31, 2026" },
  { id: 5, title: "Staff scheduling review", assignee: "Priya P.", priority: "medium", status: "in-progress", dueDate: "Mar 20, 2026" },
  { id: 6, title: "Equipment maintenance log", assignee: "James L.", priority: "low", status: "open", dueDate: "Apr 5, 2026" },
];

const PRIORITY_COLORS = { high: "#e53e3e", medium: "#dd6b20", low: "#38a169" } as const;
const STATUS_CHIP: Record<Task["status"], { label: string; color: "success" | "warning" | "default" }> = {
  "open": { label: "Open", color: "default" },
  "in-progress": { label: "In Progress", color: "warning" },
  "done": { label: "Done", color: "success" },
};

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in-progress" },
  { label: "Done", value: "done" },
];

const PRIORITY_OPTIONS = [
  { label: "All Priorities", value: "" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const columns: MRT_ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Task",
    size: 280,
    Cell: ({ cell, row }) => (
      <Box>
        <Typography variant="body2" fontWeight={500}>{cell.getValue<string>()}</Typography>
        <Typography variant="caption" color="text.secondary">
          Assigned to {row.original.assignee}
        </Typography>
      </Box>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    size: 110,
    Cell: ({ cell }) => {
      const p = cell.getValue<Task["priority"]>();
      return (
        <Stack direction="row" alignItems="center" gap={0.75}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: PRIORITY_COLORS[p] }} />
          <Typography variant="body2" textTransform="capitalize">{p}</Typography>
        </Stack>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 140,
    Cell: ({ cell }) => {
      const s = cell.getValue<Task["status"]>();
      const cfg = STATUS_CHIP[s];
      return <Chip label={cfg.label} color={cfg.color} size="small" />;
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    size: 140,
  },
  {
    id: "actions",
    header: "",
    size: 80,
    Cell: ({ row }) => (
      <Stack direction="row" gap={0.5}>
        <CIconButton size="small" walkMeId={["full-page", "edit", String(row.original.id)]}>
          <CSvgIcon component={Edit} size={16} />
        </CIconButton>
        <CIconButton size="small" walkMeId={["full-page", "delete", String(row.original.id)]}>
          <CSvgIcon component={Delete} size={16} />
        </CIconButton>
      </Stack>
    ),
  },
];

export default function FullPageMockup() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1, pageSize: 5, totalPages: 2, totalItems: MOCK_TASKS.length,
  });

  const filtered = MOCK_TASKS.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.assignee.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || t.status === statusFilter;
    const matchPriority = !priorityFilter || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const pageData = filtered.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize
  );

  const stats = {
    total: MOCK_TASKS.length,
    open: MOCK_TASKS.filter(t => t.status === "open").length,
    inProgress: MOCK_TASKS.filter(t => t.status === "in-progress").length,
    done: MOCK_TASKS.filter(t => t.status === "done").length,
  };

  return (
    <PageTemplate>
      <PageTemplate.Header>
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          <Box>
            <Typography variant="h6" fontWeight={600}>Task Management</Typography>
            <Typography variant="caption" color="text.secondary">
              Store Operations — March 2026
            </Typography>
          </Box>
          <Stack direction="row" gap={1}>
            <CButton severity="secondary" variant="outline">
              <CSvgIcon component={Download} color="primary" size={16} />
              Export
            </CButton>
            <CButton severity="primary" variant="solid" onClick={() => setModalOpen(true)}>
              <CSvgIcon component={AddIcon} color="white" size={16} />
              New Task
            </CButton>
          </Stack>
        </Stack>
      </PageTemplate.Header>

      <PageTemplate.Content>
        <Stack gap={3}>

          {/* Stats Cards */}
          <Stack direction="row" gap={2} flexWrap="wrap">
            {[
              { label: "Total Tasks", value: stats.total, icon: Filter },
              { label: "Open", value: stats.open, icon: Close },
              { label: "In Progress", value: stats.inProgress, icon: Edit },
              { label: "Completed", value: stats.done, icon: Check },
            ].map((stat) => (
              <Box
                key={stat.label}
                sx={{
                  flex: "1 1 140px",
                  p: 2,
                  borderRadius: "var(--radius-m)",
                  bgcolor: "var(--logile-bg-container-1)",
                  border: "1px solid var(--logile-border-secondary)",
                  minWidth: 140,
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h5" fontWeight={700}>{stat.value}</Typography>
                    <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                  </Box>
                  <CSvgIcon component={stat.icon} size={20} color="secondary" />
                </Stack>
              </Box>
            ))}
          </Stack>

          <Divider />

          {/* Filters */}
          <Stack direction="row" gap={2} flexWrap="wrap" alignItems="flex-end">
            <Box flex="1" minWidth={200}>
              <CTextfield
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startIcon={<CSvgIcon component={Search} size={18} color="secondary" />}
              />
            </Box>
            <Box minWidth={160}>
              <CSelect
                placeholder="Status"
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as string)}
                walkMeIdPrefix={["full-page", "status-filter"]}
              />
            </Box>
            <Box minWidth={160}>
              <CSelect
                placeholder="Priority"
                options={PRIORITY_OPTIONS}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as string)}
                walkMeIdPrefix={["full-page", "priority-filter"]}
              />
            </Box>
            {(search || statusFilter || priorityFilter) && (
              <CButton
                severity="secondary"
                variant="text"
                onClick={() => { setSearch(""); setStatusFilter(""); setPriorityFilter(""); }}
              >
                Clear Filters
              </CButton>
            )}
          </Stack>

          {/* Table */}
          <CDataTable
            tableProps={{
              columns,
              data: pageData,
              enableColumnActions: false,
              enableColumnFilters: false,
              enablePagination: false,
              enableSorting: false,
              enableBottomToolbar: false,
              enableTopToolbar: false,
              muiTableBodyRowProps: { hover: false },
            }}
            pagination={{
              ...pagination,
              totalPages: Math.ceil(filtered.length / pagination.pageSize),
              totalItems: filtered.length,
            }}
            handlePaginationChange={setPagination}
            walkMeIdPrefix={["full-page", "pagination"]}
            showPagination={filtered.length > pagination.pageSize}
          />

        </Stack>
      </PageTemplate.Content>

      {/* New Task Modal */}
      <CModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Task"
        size="medium"
        showActions
        confirmText="Create Task"
        cancelText="Cancel"
        onConfirm={() => setModalOpen(false)}
      >
        <ModalBody>
          <Stack gap={2}>
            <CTextfield label="Task Title" placeholder="Enter task title" required />
            <CSelect
              label="Priority"
              options={PRIORITY_OPTIONS.slice(1)}
              value=""
              onChange={() => {}}
              walkMeIdPrefix={["full-page", "new-task-priority"]}
            />
            <CSelect
              label="Assignee"
              options={[
                { label: "Sarah J.", value: "sarah" },
                { label: "Marcus W.", value: "marcus" },
                { label: "Emily C.", value: "emily" },
              ]}
              value=""
              onChange={() => {}}
              walkMeIdPrefix={["full-page", "new-task-assignee"]}
            />
            <CTextfield label="Due Date" type="date" />
          </Stack>
        </ModalBody>
      </CModal>

      {/* Delete Confirm Modal */}
      <CModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Task"
        size="small"
        showActions
        confirmText="Delete"
        severity="destructive"
        onConfirm={() => setDeleteTarget(null)}
      >
        <ModalBody>
          <Typography>
            Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>?
            This action cannot be undone.
          </Typography>
        </ModalBody>
      </CModal>
    </PageTemplate>
  );
}
