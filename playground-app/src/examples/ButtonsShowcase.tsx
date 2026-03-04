/**
 * BUTTONS SHOWCASE
 * Demonstrates all CButton severity × variant combinations and sizes.
 * Import this into PlaygroundCanvas to see all button styles.
 */
import { Stack, Box, Typography, Divider } from "@mui/material";
import { CButton } from "@/core/components/button/button";
import CIconButton from "@/core/components/button/IconButton";
import CSvgIcon from "@/core/components/icon/Icon";
import { AddIcon, Delete, Edit, Download, Settings } from "@/core/constants/icons";
import PageTemplate from "@/layouts/page-template/PageTemplate";

export default function ButtonsShowcase() {
  return (
    <PageTemplate>
      <PageTemplate.Header>
        <Typography variant="h6" fontWeight={600}>
          Button Showcase
        </Typography>
      </PageTemplate.Header>

      <PageTemplate.Content>
        <Stack gap={4}>

          {/* Severity × Variant Grid */}
          <Box>
            <Typography variant="body2" color="text.secondary" mb={2} fontWeight={500}>
              Severity × Variant
            </Typography>
            <Stack gap={2}>
              {(["primary", "secondary", "destructive"] as const).map((severity) => (
                <Box key={severity}>
                  <Typography variant="caption" color="text.secondary" mb={1} display="block" textTransform="capitalize">
                    {severity}
                  </Typography>
                  <Stack direction="row" gap={1.5} flexWrap="wrap">
                    {(["solid", "outline", "text", "ghost"] as const).map((variant) => (
                      <CButton key={variant} severity={severity} variant={variant}>
                        {variant}
                      </CButton>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>

          <Divider />

          {/* Sizes */}
          <Box>
            <Typography variant="body2" color="text.secondary" mb={2} fontWeight={500}>
              Sizes
            </Typography>
            <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
              {(["compact", "small", "medium", "large"] as const).map((size) => (
                <CButton key={size} severity="primary" variant="solid" size={size}>
                  {size}
                </CButton>
              ))}
            </Stack>
          </Box>

          <Divider />

          {/* With Icons */}
          <Box>
            <Typography variant="body2" color="text.secondary" mb={2} fontWeight={500}>
              With Icons
            </Typography>
            <Stack direction="row" gap={1.5} flexWrap="wrap">
              <CButton severity="primary" variant="solid">
                <CSvgIcon component={AddIcon} color="white" size={16} />
                Add Item
              </CButton>
              <CButton severity="secondary" variant="outline">
                <CSvgIcon component={Download} color="primary" size={16} />
                Export
              </CButton>
              <CButton severity="destructive" variant="solid">
                <CSvgIcon component={Delete} color="white" size={16} />
                Delete
              </CButton>
              <CButton severity="secondary" variant="text">
                <CSvgIcon component={Edit} color="primary" size={16} />
                Edit
              </CButton>
            </Stack>
          </Box>

          <Divider />

          {/* Disabled states */}
          <Box>
            <Typography variant="body2" color="text.secondary" mb={2} fontWeight={500}>
              Disabled States
            </Typography>
            <Stack direction="row" gap={1.5} flexWrap="wrap">
              <CButton severity="primary" variant="solid" disabled>Solid</CButton>
              <CButton severity="primary" variant="outline" disabled>Outline</CButton>
              <CButton severity="primary" variant="text" disabled>Text</CButton>
              <CButton severity="destructive" variant="solid" disabled>Destructive</CButton>
            </Stack>
          </Box>

          <Divider />

          {/* Icon Buttons */}
          <Box>
            <Typography variant="body2" color="text.secondary" mb={2} fontWeight={500}>
              Icon Buttons
            </Typography>
            <Stack direction="row" gap={1} alignItems="center">
              <CIconButton size="small" walkMeId={["showcase", "edit"]}>
                <CSvgIcon component={Edit} size={18} />
              </CIconButton>
              <CIconButton size="medium" walkMeId={["showcase", "delete"]}>
                <CSvgIcon component={Delete} size={20} />
              </CIconButton>
              <CIconButton size="large" walkMeId={["showcase", "settings"]}>
                <CSvgIcon component={Settings} size={24} />
              </CIconButton>
            </Stack>
          </Box>

        </Stack>
      </PageTemplate.Content>
    </PageTemplate>
  );
}
