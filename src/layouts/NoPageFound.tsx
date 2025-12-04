import { CButton } from "@/core/components/button/button";
import PageTemplate from "@/layouts/page-template/PageTemplate";
import { useNavigate } from "react-router-dom";

const NoPageFound = () => {
  const navigate = useNavigate();

  const goToTemplates = () => {
    navigate("/templates");
  };
  return (
    <PageTemplate>
      <PageTemplate.Content>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "19px",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <p>No Page Found</p>
          <CButton onClick={goToTemplates}>Go to Template library</CButton>
        </div>
      </PageTemplate.Content>
    </PageTemplate>
  );
};

export default NoPageFound;
