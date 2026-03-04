/**
 * FORMS SHOWCASE
 * Demonstrates form components: CTextfield, CSelect, CCheckbox, CSwitch, CRadio, CTextarea.
 * Import this into PlaygroundCanvas to see all form controls.
 */
import { useState } from "react";
import { Stack, Box, Typography, Divider, Grid } from "@mui/material";
import CTextfield from "@/core/components/form/textfield/Textfield";
import CTextarea from "@/core/components/form/textarea/Textarea";
import CCheckbox from "@/core/components/form/checkbox/Checkbox";
import CSwitch from "@/core/components/form/switch/Switch";
import CRadio from "@/core/components/form/radio/Radio";
import CSelect from "@/core/components/form/select/Select";
import { CButton } from "@/core/components/button/button";
import PageTemplate from "@/layouts/page-template/PageTemplate";
import { Search, User } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";

const DEPARTMENT_OPTIONS = [
  { label: "Engineering", value: "engineering" },
  { label: "Operations", value: "operations" },
  { label: "Human Resources", value: "hr" },
  { label: "Finance", value: "finance" },
  { label: "Marketing", value: "marketing" },
];

const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Employee", value: "employee" },
];

export default function FormsShowcase() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("employee");
  const [notes, setNotes] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    console.log({ name, email, department, role, notes, isActive, notifications, agreed });
    alert("Form submitted! Check console for values.");
  };

  return (
    <PageTemplate>
      <PageTemplate.Header>
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          <Typography variant="h6" fontWeight={600}>
            New Employee Form
          </Typography>
          <Stack direction="row" gap={1}>
            <CButton severity="secondary" variant="outline">Cancel</CButton>
            <CButton severity="primary" variant="solid" onClick={handleSubmit}>
              Save Employee
            </CButton>
          </Stack>
        </Stack>
      </PageTemplate.Header>

      <PageTemplate.Content>
        <Stack gap={4} maxWidth={720}>

          {/* Personal Info Section */}
          <Box>
            <Typography variant="body1" fontWeight={600} mb={2} color="text.primary">
              Personal Information
            </Typography>
            <Stack gap={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CTextfield
                    label="First Name"
                    placeholder="Enter first name"
                    required
                    value={name.split(" ")[0] || ""}
                    onChange={(e) => setName(e.target.value + " " + (name.split(" ")[1] || ""))}
                    startIcon={<CSvgIcon component={User} size={18} color="secondary" />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CTextfield
                    label="Last Name"
                    placeholder="Enter last name"
                    required
                    value={name.split(" ")[1] || ""}
                    onChange={(e) => setName((name.split(" ")[0] || "") + " " + e.target.value)}
                  />
                </Grid>
              </Grid>

              <CTextfield
                label="Email Address"
                placeholder="name@logile.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={email.length > 0 && !email.includes("@")}
                helperText={email.length > 0 && !email.includes("@") ? "Enter a valid email address" : ""}
                endIcon={<CSvgIcon component={Search} size={18} color="secondary" />}
              />
            </Stack>
          </Box>

          <Divider />

          {/* Role Section */}
          <Box>
            <Typography variant="body1" fontWeight={600} mb={2} color="text.primary">
              Role & Department
            </Typography>
            <Stack gap={2}>
              <CSelect
                label="Department"
                placeholder="Select department"
                options={DEPARTMENT_OPTIONS}
                value={department}
                onChange={(e) => setDepartment(e.target.value as string)}
                required
                walkMeIdPrefix={["forms-showcase", "department"]}
              />

              <Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Role
                </Typography>
                <Stack direction="row" gap={3}>
                  {ROLE_OPTIONS.map((opt) => (
                    <CRadio
                      key={opt.value}
                      label={opt.label}
                      value={opt.value}
                      checked={role === opt.value}
                      onChange={() => setRole(opt.value)}
                      size="small"
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Notes */}
          <Box>
            <Typography variant="body1" fontWeight={600} mb={2} color="text.primary">
              Additional Notes
            </Typography>
            <CTextarea
              label="Notes"
              placeholder="Add any relevant notes about this employee..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              helperText={`${notes.length} characters`}
            />
          </Box>

          <Divider />

          {/* Settings */}
          <Box>
            <Typography variant="body1" fontWeight={600} mb={2} color="text.primary">
              Settings
            </Typography>
            <Stack gap={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" fontWeight={500}>Active Account</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Allow this employee to log in
                  </Typography>
                </Box>
                <CSwitch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  size="medium"
                />
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" fontWeight={500}>Email Notifications</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Receive system notifications
                  </Typography>
                </Box>
                <CSwitch
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  size="medium"
                />
              </Stack>

              <CCheckbox
                label="I confirm that all information provided is accurate"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                size="small"
              />
            </Stack>
          </Box>

          {/* Actions */}
          <Stack direction="row" gap={1} justifyContent="flex-end">
            <CButton severity="secondary" variant="outline">Cancel</CButton>
            <CButton
              severity="primary"
              variant="solid"
              disabled={!name || !email || !department || !agreed}
              onClick={handleSubmit}
            >
              Save Employee
            </CButton>
          </Stack>

        </Stack>
      </PageTemplate.Content>
    </PageTemplate>
  );
}
