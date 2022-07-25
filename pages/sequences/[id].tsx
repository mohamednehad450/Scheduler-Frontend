import { Text } from '@mantine/core'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

const Sequence: NextPage = () => {
  const router = useRouter()

  return (
    <Text>{router.query.id}</Text>
  )
}

export default Sequence
