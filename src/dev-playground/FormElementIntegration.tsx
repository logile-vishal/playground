import CTextarea from "@/core/components/form/textarea/Textarea";
import CTextfield from "@/core/components/form/textfield/Textfield";
import CRichTextEditor from "@/core/components/form/rich-text-editor/RichTextEditor";
import { CreateTemplateFormProvider } from "@/pages/create-template/providers/CreateTemplateFormProvider";

const TestForm = () => {
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <CTextfield
        walkMeIdPrefix={["text-field"]}
        label="Name"
        required
        helperText="This field is required"
      />
      <CTextfield
        walkMeIdPrefix={["text-field"]}
        label="Name"
        isInlineLabel
        required
        error
        helperText="This field is required"
      />

      <CTextarea
        walkMeIdPrefix={["text-area"]}
        label="Text Area"
        required
      />

      <CTextarea
        walkMeIdPrefix={["text-area"]}
        isInlineLabel
        label="Text Area"
        error={true}
        required
        helperText="This field is required"
      />

      <div>
        <CRichTextEditor
          required
          isInlineLabel
          label="Rich-Text"
          walkMeIdPrefix={["rich-text"]}
          error={true}
          helperText="This field is required"
        />
      </div>
    </form>
  );
};
const FormElementIntegration = () => {
  return (
    <CreateTemplateFormProvider>
      <TestForm />
    </CreateTemplateFormProvider>
  );
};

export default FormElementIntegration;
