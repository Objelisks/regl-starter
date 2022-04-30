/**
 * runs the given function x times
 * @param {number} x times to run
 * @param {(i:number)=>void} func function to run
 */
export const times = (x, func) => {
  for (let i = 0; i < x; i++) {
    func(i)
  }
}

/**
 * @returns a random uuid
 */
export const id = () => crypto.randomUUID()