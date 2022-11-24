import { CronJob } from "cron"

const formatHour = (n: number) => {
    const prefix = n >= 12 ? " PM" : ' AM'
    const h = n % 12
    return h === 0 ? 12 + prefix : h + prefix
}

const getMonthName = (n: number) => {
    return ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][n]
}
const getDayName = (n: number) => {
    return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][n]
}


const nextCronDates = (cron: string, n: number) => {
    const ds = new CronJob(cron, Function).nextDates(n)
    return (Array.isArray(ds) ? ds : [ds]).map(d => new Date(d.toMillis()))
}

export { formatHour, getDayName, getMonthName, nextCronDates }