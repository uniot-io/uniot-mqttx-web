export default (): string => {
  return `uniotx_${Math.random().toString(16).substr(2, 8)}` as string
}
