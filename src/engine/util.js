// times(3, (i) => ...)
export const times = (x, func) => {
  for (let i = 0; i < x; i++) {
    func(i)
  }
}
