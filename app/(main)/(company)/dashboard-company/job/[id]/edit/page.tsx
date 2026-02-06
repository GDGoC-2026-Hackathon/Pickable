import { EditJobPostingClient } from './EditJobPostingClient'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditJobPostingPage({ params }: Props) {
  const { id } = await params

  return <EditJobPostingClient postingId={id} />
}
