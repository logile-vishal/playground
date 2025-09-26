import { Box, Skeleton } from "@mui/material";

export const renderTemplateIconSkelton = () => {
  return (
     <Box display="flex" alignItems="center" gap={2} flex={1}>
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
  )
}
export const renderTemplateNameSkeltonDesktop = () => {
  return (
     <Box>
            <Skeleton variant="rectangular" sx={{borderRadius:"4px"}} width={300} height={20} />
    </Box>
  )
}
export const renderTemplateNameSkelton = () => {
  return (
     <Box>
            <Skeleton variant="rectangular" sx={{borderRadius:"4px"}} width={300} height={20} />
            <Box display="flex" gap="23px" mt="6px">
                <Skeleton variant="rectangular" sx={{borderRadius:"4px"}} width={80} height={20} />
                <Skeleton variant="rectangular" sx={{borderRadius:"4px"}} width={80} height={20} />
            </Box>
    </Box>
  )
}

export const renderTemplateRowSkelton = () => {
  return (
    <Box>
      <Skeleton variant="rectangular" sx={{borderRadius:"4px"}} width="80%" height={20} />
    </Box>
  )
}

export const renderTemplateCreatedSkelton = () => {
  return (
    <Box flex={0.5} display="flex" gap="4px">
        <Skeleton variant="rectangular" sx={{borderRadius:"4px"}} width={100} height={20} />
        <Skeleton variant="circular" width={20} height={20} />
      </Box>
  )
}

export const renderTemplateActionSkelton = () => {
  return (
     <Box display="flex" gap={1} flex={0.3}>
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="circular" width={36} height={36} />
      </Box>
  )
}

export const renderDirectorySkelton = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="6px" padding="12px" 
    sx={{
      borderRight: "1px solid lightgray",
      height: "100vh",
      paddingRight:"1.6rem"
    }}>
       <Skeleton variant="rectangular" sx={{borderRadius:"8px"}} width="100%"  height={20} />
        <Skeleton variant="rectangular" sx={{borderRadius:"8px"}} width="100%"  height={20} />
        <Skeleton variant="rectangular" sx={{borderRadius:"8px"}} width="100%"  height={20} />
    </Box>
  )
}