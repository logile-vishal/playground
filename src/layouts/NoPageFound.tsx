import PageTemplate from "@/layouts/PageTemplate"


const NoPageFound = () => {


  
  return (
    <PageTemplate>
      <PageTemplate.Content>

    <div style={{
      display:"flex",
      justifyContent:"center",
      fontSize: '19px',
      alignItems:'center',
      height:'100%',
    }}>
      <p>No Page Found</p></div>
      </PageTemplate.Content>

      </PageTemplate>
  )
}

export default NoPageFound