import { Text } from '@mantine/core'
import { FC } from 'react'
import { SequenceDBType } from '../../Scheduler/src/db'

interface OrdersPreviewProps {
    orders: SequenceDBType['orders']
}



const OrdersPreview: FC<OrdersPreviewProps> = ({ orders }) => {

    return (
        <Text>TO BE IMPLEMENTED!</Text>
    )

}

export default OrdersPreview
