import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import AppShell from '@/layouts/app-shell/AppShell';
import { IconsDemo } from '@/dev-playground/Icons';
import { ComponentLibraryLandingPage } from '@/dev-playground/LandingPage';
import NoPageFound from '@/layouts/NoPageFound';
import TemplateLibrary from '@/pages/template-library';


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

const router = createHashRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <TemplateLibrary /> },
       { path: '*', element: <NoPageFound /> }
    ],
  },
 getDevRoutes()
]);


export default router;