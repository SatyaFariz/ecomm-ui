const formatCurrency = (number: number): string => {
  const chars = number.toString().split('')
  const newChars: string[] = []
  let counter = 0
  while(chars.length > 0) {
    if(counter % 3 === 0 && counter > 0) newChars.unshift('.')
    newChars.unshift(chars.pop() as string)
    counter++
  }

  return `Rp ${newChars.join('')}`
}

export default formatCurrency