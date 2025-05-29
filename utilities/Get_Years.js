export const getYearList = () => {
    const now = new Date().getUTCFullYear()
    const years = Array(10)
      .fill('')
      .map((v, idx) => now + idx)
    return years.map((value) => ({
      value: value.toString(),
      label: value.toString()
    }))
  }