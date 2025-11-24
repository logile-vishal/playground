import type React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";

import IconButton from "@/core/components/button/IconButton";
import { CommonButton } from "@/core/components/button/button";
import SvgIcon from '@/core/components/icon/Icon';
import { ChevronLeft } from "@/core/constants/icons";

import PageTemplate from "../../layouts/page-template/PageTemplate";
import { CREATE_TEMPLATE_HEADING } from "./constants/constant";
import BasicInfo from "./components/basic-info/BasicInfo";
import "./CreateTemplate.scss";

const CreateTemplate: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigateBack = () => {
        navigate("/templates");
    }

    return <PageTemplate>
        <PageTemplate.Header>
            <Stack direction={"row"} className="create-template-page-header">
                <Box className="create-template-page-header__section">
                    <IconButton variant="outline" disableHover={true} disableTouchRipple onClick={handleNavigateBack}
                        className="create-template-page-header__back-icon">
                        <SvgIcon component={ChevronLeft} fill='var(--icon-secondary)' size={18} />
                    </IconButton>
                    <Typography color="var(--text-primary)" variant='h2'>{CREATE_TEMPLATE_HEADING.createTaskTemplate}</Typography>
                        
                    {/* TODO: to be done later when create template demo video available */}
                    {/* <Box className={clsx({ "create-template-page-header__cursor-pointer": true })}>
                        <SvgIcon component={QuestionCircle} fill='var(--icon-secondary)' size={16} />
                    </Box> */}
                </Box>
                <Box className="create-template-page-header__section">
                    <CommonButton severity="secondary" variant="outline" disabled={true}>Preview</CommonButton>
                    <CommonButton severity="secondary" disabled={true}>Next</CommonButton>
                    <CommonButton severity="primary" disabled={true}>Save</CommonButton>
                    <CommonButton severity="primary" disabled={true}>Submit</CommonButton>
                </Box>
            </Stack>
        </PageTemplate.Header>
        <PageTemplate.Content className="create-template-page-content">
            <BasicInfo />
        </PageTemplate.Content>
    </PageTemplate>
}

export default CreateTemplate;