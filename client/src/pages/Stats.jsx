import { ChartsContainer, StatsContainer } from '../components'
import customFetch from '../utils/customFetch'
import { redirect, useLoaderData } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

// async -> so we do not need data.data // axios issue
// has methods to fetch data etc
// looks in two places
const statsQuery = {
  queryKey: ['stats'],
  queryFn: async () => {
    const response = await customFetch.get('/jobs/stats')
    return response.data
  },
}

// higher order func
export const loader = (queryClient) => async () => {
  // ensure query data grabs from the cache / or fresh data
  const data = await queryClient.ensureQueryData(statsQuery)
  console.log(data)
  return null // as not using data back from the loader
  // instead we use useQuery(statsQuery)
}

const Stats = () => {
  // REACT RENDRERING ISSUE HAVE TO CHECK FOR THE LOADING AND ERRORS
  // if (isLoading) return <h4>Loading...</h4>
  // if (isError) return <h4>Error...</h4>

  /// can use useLoaderData but we loose some fucntionality (auto focus refetch)
  const { data } = useQuery(statsQuery)
  const { defaultStats, monthlyApplications } = data

  return (
    <>
      <StatsContainer defaultStats={defaultStats} />

      {monthlyApplications?.length > 0 && <ChartsContainer data={monthlyApplications} />}
    </>
  )
}

export default Stats
