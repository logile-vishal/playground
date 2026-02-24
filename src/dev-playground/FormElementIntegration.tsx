import { CreateTemplateFormProvider } from "@/pages/create-template/providers/CreateTemplateFormProvider";
import CRadio from "@/core/components/form/radio/Radio";
import CCheckbox from "@/core/components/form/checkbox/Checkbox";
import { Stack } from "@mui/material";
import CTextarea from "@/core/components/form/textarea/Textarea";
import CRichTextEditor from "@/core/components/form/rich-text-editor/RichTextEditor";
import CSelect from "@/core/components/form/select/Select";
import CTextfield from "@/core/components/form/textfield/Textfield";
import CSwitch from "@/core/components/form/switch/Switch";
import { useState } from "react";
import CMultiSelectWithChip from "@/core/components/multi-select-chip/MultiSelectWithChip";

//TODO: JUST FOR DEV REVIEW PURPOSE. DO NOT REVIEW
const TestForm = () => {
  const [first, setFirst] = useState(true);
  const [selection, setSelection] = useState([]);

  const [checkBox, setCheckBox] = useState(false);
  return (
    <Stack
      spacing={2}
      padding={"1rem"}
      overflow={"auto"}
      height={"80vh"}
    >
      <CRadio
        label="testing"
        size="small"
        disabled
      />
      <Stack>
        <p>checkbox</p>

        <CCheckbox
          label="Checkbox-large"
          value={checkBox}
          onChange={() => setCheckBox(!checkBox)}
          size="large"
        />
        <CCheckbox
          label="Checkbox-medium"
          value={checkBox}
          size="medium"
          error
        />
        <CCheckbox
          label="Checkbox-small"
          value={checkBox}
          size="small"
        />
        <CCheckbox
          label="Checkbox-disabled"
          value={checkBox}
          disabled
          size="small"
        />
        <CCheckbox
          label="Checkbox-disabled"
          // value={checkBox}
          disabled
          size="small"
          indeterminate
        />
        <CCheckbox
          label="Checkbox-disabled"
          value={checkBox}
          size="small"
          indeterminate
        />
      </Stack>

      <CTextarea
        label="Textarea"
        helperText="tst"
        disabled
      />
      <CTextfield label="Textfield" />
      <Stack gap={1}>
        <CSwitch
          label="Switch"
          size="large"
          checked={first}
          onChange={() => setFirst(!first)}
        />
        <CSwitch
          label="Switch-disabled"
          size="large"
          disabled
          checked={first}
          onChange={() => setFirst(!first)}
        />
        <CSwitch
          label="Switch"
          size="medium"
          checked={first}
          onChange={() => setFirst(!first)}
        />
        <CSwitch
          label="Switch"
          size="small"
          checked={first}
          onChange={() => setFirst(!first)}
        />
      </Stack>
      <CRichTextEditor
        label="sdfsdf"
        isInlineLabel
        helperText="test"
      />
      <CSelect
        label="Select border on menu open fixed"
        options={[
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ]}
        onChange={(e) => {
          setSelection(e.target.value);
        }}
        optionValueKey="value"
        optionLabelKey="label"
        placeholder="Select template"
        disabled
        allowMultiSelect
        value={selection}
      />
      <CMultiSelectWithChip
        label="Multi Select border on menu open fixed"
        options={[
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ]}
        error
        // disabled
        onChange={() => {}}
      />
    </Stack>
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
