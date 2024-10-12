import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  HomeLayout,
  Landing,
  Register,
  Login,
  DashboardLayout,
  Error,
  AddJob,
  Stats,
  AllJobs,
  Profile,
  Admin,
  EditJob,
} from './pages'
import { action as registerAction } from './pages/Register'
import { action as loginAction } from './pages/Login'
import { loader as dashboardLoader } from './pages/DashboardLayout'
import { action as addJobAction } from './pages/AddJob'
import { loader as allJobsLoader } from './pages/AllJobs'

import { loader as editJobLoader } from './pages/EditJob'
import { action as editJobAction } from './pages/EditJob'

import { action as deleteJobAction } from './pages/DeleteJob'
import { loader as adminLoader } from './pages/Admin'

import { action as profileAction } from './pages/Profile'
import { loader as statsLoader } from './pages/Stats'
import ErrorElement from './components/ErrorElement'

export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true'
  // console.log(isDarkTheme)
  document.body.classList.toggle('dark-theme', isDarkTheme)
  return isDarkTheme
}

checkDefaultTheme()

// this is an isnstance
// PASS THE QUERY CLIENT DOWN TO A LOADER
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 5 mins in ms
    },
  },
})

const router = createBrowserRouter([
  // errors bubble up, Home is parent so will bubble up to here
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'register',
        element: <Register />,
        action: registerAction,
        // action: () => {
        //   console.log('hello there ')
        //   return null
        // },
      },
      {
        path: 'login',
        element: <Login />,
        action: loginAction(queryClient),
      },
      {
        path: 'dashboard',
        element: <DashboardLayout queryClient={queryClient} />,
        loader: dashboardLoader(queryClient),
        children: [
          {
            index: true,
            element: <AddJob />,
            action: addJobAction(queryClient),
          },
          {
            path: 'stats',
            element: <Stats />,
            loader: statsLoader(queryClient),
            errorElement: <ErrorElement />,
            // we INTERCEPT THE ERROR HERE
          },
          {
            path: 'all-jobs',
            element: <AllJobs />,
            loader: allJobsLoader(queryClient),
            errorElement: <ErrorElement />,
          },

          {
            path: 'profile',
            element: <Profile />,
            action: profileAction(queryClient),
          },
          {
            path: 'admin',
            element: <Admin />,
            loader: adminLoader,
          },

          {
            path: 'edit-job/:id',
            element: <EditJob />,
            loader: editJobLoader(queryClient),
            action: editJobAction(queryClient),
          },
          // setting action to ...
          { path: 'delete-job/:id', action: deleteJobAction(queryClient) },
        ],
      },
    ],
  },
])
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
