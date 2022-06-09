export const loadImage = (filename) => {
  const file = new Image()
  const promise = new Promise((resolve) => {
    file.onload = () => {
      resolve(file)
    }
    file.src = filename
  })
  return promise
}

export const loadFile = (filename) => {
  return fetch(filename).then(res => res.json())
}
