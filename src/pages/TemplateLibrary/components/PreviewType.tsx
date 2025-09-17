import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from '@mui/material/Select';
import SvgIcon from "@/core/components/Icon";
import IconButton from "@/components/IconButton";
import type { IconName } from '@/core/types/icon.type';
import "../style.scss";

type AnswerType = "Textfield" | "Dropdown" | "Multiline-Textfield" | string;

interface RenderAnswerProps {
  type: AnswerType;
  answer: string;
}

interface PreviewHeadingProps {
  heading: string;
  btn1visible?: boolean;
  btn1Name?: IconName;
  btn2visible?: boolean;
  btn2Name?: IconName;
}

interface PreviewBodyProps {
    index: string;
    text: string;
    type: string; 
    answer: string; 
    mandatory: boolean;
}

const renderAnswer = ({ type, answer }: RenderAnswerProps) => {
    switch (type) {
        case "Textfield":
            return (
            <TextField
                size="small"
                value={answer}
                placeholder="Enter answer"
                disabled={true}
            />
            );

        case "Dropdown":
            return (
            <Select size="small" value={answer} disabled={true}  sx={{ minWidth: "180px" }} >
                <MenuItem value={answer}>{answer}</MenuItem>
            </Select>
            );

        case "Multiline-Textfield": 
            return (
                <TextField
                    id="outlined-multiline-static"
                    label=""
                    multiline
                    rows={2}
                    disabled={true}
                    defaultValue={answer}
                    InputProps={{
                        sx: {
                            "& MuiOutlinedInput-root": {
                                padding: "6px",
                            },
                        },
                    }}
                />
            )

        default:
            return <Box>{answer}</Box>;
    }
};

export const renderPreviewHeading = ({ heading, btn1visible= false, btn1Name, btn2visible= false, btn2Name }: PreviewHeadingProps) => {
    return <Box fontWeight={500} display='flex' alignItems='center' justifyContent='space-between' width="100%" className="modal-heading">
                <Box fontSize='18px' fontWeight={500}> {heading} </Box>
                <Box display="flex" gap="10px">
                  {btn1visible && btn1Name && <IconButton variant="outline">
                      <SvgIcon component={btn1Name} size={22} />
                  </IconButton>}
                  {btn2visible && btn2Name && <IconButton variant="outline">
                      <SvgIcon component={btn2Name } size={22} />
                  </IconButton>}
                </Box>
            </Box>
}

export  const renderPreviewPopupRow = ({ index, text, type, answer, mandatory }: PreviewBodyProps) => {
    return <Box sx={{ padding: "16px", borderBottom: "1px solid #E7E7E7", display: "flex", gap: "10px"}}>
        <Box display="flex" width="70%">
          {mandatory && <Box color="red">*</Box>}
          <Box>{index}. {text}</Box>
        </Box>
        <Box>
            {renderAnswer({ type, answer})}
        </Box>
    </Box>
}