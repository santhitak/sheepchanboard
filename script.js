let grids = new Set()
let cell_size = 24
let height = window.innerHeight
let width = window.innerWidth

let canvas = document.querySelector('#mycanvas')
let ctx = canvas.getContext('2d')

let drawBorder = () => {
    ctx.beginPath()
    for (let i = 0; i < height; i += cell_size){
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
    }
    for (let i = 0; i < width; i += cell_size){
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
    }
    ctx.strokeStyle = '#00FFFF'
    ctx.lineWidth = 2
    ctx.stroke()
}

let drawCell = (cord) => {
    ctx.fillStyle = '#FF007F'
    x = cord.split(',')[0]
    y = cord.split(',')[1]
    ctx.fillRect(cell_size * x + 1, cell_size * y + 1, cell_size - 1, cell_size - 1)
    ctx.stroke()
}

let eraseCell = (cord) => {
    x = cord.split(',')[0]
    y = cord.split(',')[1]
    ctx.clearRect(cell_size * x + 1, cell_size * y + 1, cell_size - 1, cell_size - 1)
    ctx.stroke()
}

let resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    width = window.innerWidth
    height = window.innerHeight
    drawBorder()
}

let handleMouseClick = (event) => {
    const rect = canvas.getBoundingClientRect()
    x = event.clientX - rect.left
    y = event.clientY - rect.top
    posXY = `${Math.floor(x / cell_size)},${Math.floor(y / cell_size)}`
    if (grids.has(posXY)) {
        grids.delete(posXY)
        eraseCell(posXY)
    }
    else {
        grids.add(posXY)
        drawCell(posXY)
    }
}

let drawAll = () => {
    ctx.beginPath()
    for (let cord of grids) {
        drawCell(cord)
    }
}

resizeCanvas()

canvas.addEventListener('click', handleMouseClick)
window.addEventListener('resize', resizeCanvas, false)

let cellSizeInput = document.querySelector('#cell-size-input')
let applySettingButton = document.querySelector('#apply-button')

applySettingButton.addEventListener('click', (event) => {
    cell_size = parseInt(cellSizeInput.value)
    ctx.beginPath()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.stroke()
    drawBorder()
    drawAll()
})