import './index'

const getDate = (date) => {
  let day = new Date()
  let time
  if (date === '今天') {
    time = day.format("yyyy-MM-dd")

  } else if (date === '昨天') {
    day.setDate(day.getDate() - 1)
    time = day.format("yyyy-MM-dd")
  } else if (date === '本周') {
    const num = day.getDay() - 1
    day.setDate(day.getDate() - num)
    const weekStart = day.format("yyyy-MM-dd")
    day.setDate(day.getDate() + 6);
    const weekEnd = day.format("yyyy-MM-dd")
    time = [weekStart, weekEnd]
  } else if (date === '本月') {
    day.setDate(1)
    const monthStart = day.format("yyyy-MM-dd")
    day.setMonth(day.getMonth() + 1)
    day.setDate(day.getDate() - 1)
    const monthEnd = day.format("yyyy-MM-dd")
    time = [monthStart, monthEnd]
  }
  return getTime(time)
}

const getTime = (value) => {
  let start = value
  let end = value
  if (Array.isArray(value)) {
    start = value[0]
    end = value[1]
  }
  return [
    new Date(new Date(new Date(start).toLocaleDateString()).getTime()).getTime(),
    new Date(new Date(new Date(end).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime()
  ]
}


export default getDate