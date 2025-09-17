import { createBrowserRouter } from 'react-router-dom';
import AppShell from '@/layouts/AppShell';
import About from '@/pages/About';
import { IconsDemo } from '@/component-library/Icons';
import { ComponentLibraryLandingPage } from '@/component-library/LandingPage';
import NoPageFound from '@/pages/NoPageFound';
import TemplateLibrary from '@/pages/TemplateLibrary';


const getDevRoutes = ()=>{
if(import.meta.env.DEV){
    return { 
      path: '/dev', 
      element: <AppShell />,
      children: [
        {
          index: true,
          element: <ComponentLibraryLandingPage />,
        },
        {
          path: '/dev/component-library/icons',
          element: <IconsDemo />,
        }
      ]
    }
}
return {}
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <TemplateLibrary /> },
      { path: 'about', element: <About /> },
       { path: '*', element: <NoPageFound /> }
    ],
  },
 getDevRoutes()
]);


export default router;