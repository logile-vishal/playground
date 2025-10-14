import { createHashRouter } from 'react-router-dom';

import { IconsDemo } from '@/dev-playground/Icons';

import AppShell from '@/layouts/app-shell/AppShell';
import NoPageFound from '@/layouts/NoPageFound';
import TemplateLibrary from '@/pages/template-library';
import { ComponentLibraryLandingPage } from '@/dev-playground/LandingPage';


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