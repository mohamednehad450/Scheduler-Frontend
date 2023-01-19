import { redirect } from '../../api'
export const config = {
    runtime: 'edge',
}
export default redirect('slug')
