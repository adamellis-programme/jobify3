import { FormRow, FormRowSelect, SubmitBtn } from '../components'
import Wrapper from '../assets/wrappers/DashboardFormPage'
import { useLoaderData } from 'react-router-dom'
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants'
import { Form, redirect, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import customFetch from '../utils/customFetch'
import { BsCloudLightning } from 'react-icons/bs'
import { useQuery } from '@tanstack/react-query'

// as params we uses a func that ret a obj
const singleJobQuery = (id) => {
  return {
    queryKey: ['job', id],
    queryFn: async () => {
      const { data } = await customFetch.get(`/jobs/${id}`)
      return data
    },
  }
}

// ... GET
// prettier-ignore
export const loader = (queryClient) => async ({ params }) => {
    try {
      await queryClient.ensureQueryData(singleJobQuery(params.id))
      // we stil need to use id in useLoaderData()
      return params.id
    } catch (error) {
      toast.error(error?.response?.data?.msg)
      return redirect('/dashboard/all-jobs')
    }
  }
//queryClient.invalidateQueries(['job', params.id]); 
// ... POST
// prettier-ignore
export const action = (queryClient) => async ({ request, params }) => {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    try {
      await customFetch.patch(`/jobs/${params.id}`, data)
      queryClient.invalidateQueries(['jobs'])
      toast.success('Job edited successfully')
      return redirect('/dashboard/all-jobs')
    } catch (error) {
      toast.error(error?.response?.data?.msg)
      return error
    }
  }

const EditJob = () => {
  const params = useParams()
  console.log(params)
  const id = useLoaderData()
  console.log(id)

  const {
    data: { job },
  } = useQuery(singleJobQuery(id))

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">edit job</h4>
        <div className="form-center">
          <FormRow type="text" name="position" defaultValue={job.position} />
          <FormRow type="text" name="company" defaultValue={job.company} />
          <FormRow
            type="text"
            labelText="job location"
            name="jobLocation"
            defaultValue={job.jobLocation}
          />

          <FormRowSelect
            name="jobStatus"
            labelText="job status"
            defaultValue={job.jobStatus}
            list={Object.values(JOB_STATUS)}
          />
          <FormRowSelect
            name="jobType"
            labelText="job type"
            defaultValue={job.jobType}
            list={Object.values(JOB_TYPE)}
          />
          {/* boolean */}
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  )
}
export default EditJob
