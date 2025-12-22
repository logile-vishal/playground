import { useNavigate } from "react-router-dom";

import { CButton } from "@/core/components/button/button";
import PageTemplate from "@/layouts/page-template/PageTemplate";
import { NO_PAGE_FOUND } from "@/core/constants/no-page-found";

import "./NoPageFound.scss";

const NoPageFound = () => {
  const navigate = useNavigate();

  const goToTemplates = () => {
    navigate("/templates");
  };
  return (
    <PageTemplate>
      <PageTemplate.Content>
        <div className="no-page-found-main">
          <p>{NO_PAGE_FOUND.title}</p>
          <CButton onClick={goToTemplates}>{NO_PAGE_FOUND.action}</CButton>
        </div>
      </PageTemplate.Content>
    </PageTemplate>
  );
};

export default NoPageFound;
