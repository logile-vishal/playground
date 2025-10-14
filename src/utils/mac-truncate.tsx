import {styled} from "styled-components";

const StyledDiv = styled("div")`
      .mac-truncate-text {
            display: flex;
            align-items: center;
            width: fit-content;
            max-width: 100%;
      }

       .mac-truncate-text__main {
           display: inline-block;
           overflow: hidden;
           text-overflow: ellipsis;
           white-space: nowrap;
       }

       .mac-truncate-text__last {
           display: inline-block;
       }
`; 

export const renderMacTruncate = (text, lastCount = 4, parentWidth = 300) => {
  const ch = 7; // Approximate average character width in pixels

  if (!text) return null;

  const needsTruncation = (text.length * ch) > parentWidth; 

  // Split the text into the visible last part and the main (potentially truncated) part
  const lastPart = text.slice(-lastCount); // Keep last N characters
  const firstPart = text.slice(0, text.length - lastCount); // Rest of the text before the last part

  // Approximate total text width
  const textWidth = text.length * ch;

  // Calculate width for the first part based on available parent width
  const firstPartWidth = textWidth > parentWidth ? `${parentWidth - (lastCount * ch)}px` : 'fit-content';
    
  // If text length is smaller than lastCount → just render it
  if (!needsTruncation) {
    return <span className={`mac-truncate-text`}>{text}</span>;
  }
  
  return (
    <StyledDiv>
      <div className={`mac-truncate-text`}>
        <span style={{width: firstPartWidth }} className="mac-truncate-text__main">
          {firstPart}
        </span>
        <span className="mac-truncate-text__last">
          {lastPart}
        </span>
      </div>
    </StyledDiv>
  );
}
 