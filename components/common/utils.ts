
const formatHour = (n: number) => {
    const prefix = n >= 12 ? " PM" : ' AM'
    const h = n % 12
    return h === 0 ? 12 + prefix : h + prefix
}

const getMonthName = (n: number) => {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][n]
}
const getDayName = (n: number) => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][n]
}

export { formatHour, getDayName, getMonthName }