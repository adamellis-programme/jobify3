// DASHBOARD LAYOUT IS THE MAIN ENTRY POINT TO THIS APP
// and is used to access all children components of the app
// exept for the login, register, logout etc!

import {
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from 'react-router-dom'
import customFetch from '../utils/customFetch'
import Wrapper from '../assets/wrappers/Dashboard'
// all components in index.js so we have ONE import file
import { Navbar, BigSidebar, SmallSidebar, Loading } from '../components'

import { useState, createContext, useContext } from 'react'
import { useEffect } from 'react'
import { checkDefaultTheme } from '../App'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
const DashboardContext = createContext()

const userQuery = {
  queryKey: ['user'],
  queryFn: async () => {
    const { data } = await customFetch('/users/current-user')
    return data
  },
}

// () <- takes in fucntion
// => returns fucntion
export const loader = (queryClient) => async () => {
  try {
    //  do not have to use rtrn as not relying on that data as
    return await queryClient.ensureQueryData(userQuery)
  } catch (error) {
    return redirect('/')
  }
}

const DashboardLayout = ({ queryClient }) => {
  const { user } = useQuery(userQuery).data
  const navigate = useNavigate()
  const navigation = useNavigation()
  console.log(navigation)
  const isPageLoading = navigation.state === 'loading'
  // console.log(user)

  const [isAuthError, setIsAuthError] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme())

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme

    setIsDarkTheme(newDarkTheme)

    document.body.classList.toggle('dark-theme', newDarkTheme)
    localStorage.setItem('darkTheme', newDarkTheme)
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const logoutUser = async () => {
    navigate('/')
    await customFetch.get('/auth/logout')
    queryClient.invalidateQueries()
    toast.success('Logging out...')
  }
  // The interceptor logic is a global mechanism that runs for every request to ensure the user session is valid and takes action if not (like logging the user out).
  // The loader logic is a route-specific mechanism that fetches the necessary data for a route and handles errors by redirecting the user to a different route if needed.

  // two functions provided
  // we then check for errors
  // prettier-ignore
  customFetch.interceptors.response.use((response) => {return response},
    (error) => {
      if (error?.response?.status === 401) {
        setIsAuthError(true)
      }
      return Promise.reject(error)
    }
  )
  useEffect(() => {
    if (!isAuthError) return
    logoutUser()
  }, [isAuthError])

  return (
    //  stops prop drilling
    <DashboardContext.Provider
      // <DashboardContext.Provider IS USES FOR
      // small sidebar, big sidebar and nav bar BUT NOT THE OUTLET
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              {/* outlet needs the global context  */}
              {/*INSTEAD OF USING   <DashboardContext.Provider  OUTLET HAS THE CONTEX PROVIDER */}
              {/* THIS ONE IS FOR ALL THE COMPONENTS INSIDE PAGES AND COMPONENTS INSIDE THOSE PAGES  */}

              {/* loading check */}
              {/* called global loading as uesed once in the dashboard layout */}
              {/* everyy page wil have this loading component */}
              {isPageLoading ? (
                <div className="dashboard-page">
                  {isPageLoading ? <Loading /> : <Outlet context={{ user }} />}
                </div>
              ) : (
                <Outlet context={{ user }} />
              )}
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  )
}

// custom hook so we do not need to export the main context
export const useDashboardContext = () => useContext(DashboardContext)

export default DashboardLayout
