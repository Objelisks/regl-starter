

window.addEventListener('mousedown', (e) => {

})

window.addEventListener('mouseup', (e) => {

})

window.addEventListener('wheel', (e) => {

})

let mouseSurface = []

export const addMouseSurface = (surface) => {
    mouseSurface.push(surface)
}

export const filterMouseSurface = (func) => {
    mouseSurface = mouseSurface.filter(func)
}