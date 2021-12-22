let grids = new Set()
let cell_size = 24
let height = window.innerHeight
let width = window.innerWidth
let nx = Math.floor(width / cell_size)
let ny = Math.floor(height / cell_size)
let canvas = document.querySelector('#mycanvas')
let ctx = canvas.getContext('2d')
let drag = false

let cell_color = '#FF007F'

class Preset {
    constructor(width, height, grids) {
        // grids = array of object (what you get when copying the set from console)
        this.width = width
        this.height = height
        this.grids = grids
    }
}

let presets = {
    ">o<":{"width":17,"height":12,"grids":["0-0","1-0","2-1","3-1","4-2","3-3","2-3","1-4","0-4","3-6","0-7","1-6","2-7","4-8","5-7","6-7","4-10","4-11","4-9","5-12","6-12","8-11","7-11","9-11","10-11","8-8","7-8","9-8","10-8","11-7","12-7","13-8","13-9","13-10","13-11","12-12","11-12","14-6","15-7","17-7","16-6","15-1","17-0","15-3","13-2","14-3","14-1","16-4","17-4","16-0"]},
    "uwu":{"width":19,"height":8,"grids":["1-0","1-1","1-2","1-3","1-4","2-5","3-5","4-5","5-4","5-3","5-2","5-1","5-0","2-4","4-4","7-1","7-2","8-3","8-4","9-5","10-4","11-5","12-4","12-3","13-2","13-1","15-0","15-1","15-2","15-3","15-4","16-4","16-5","17-5","18-5","18-4","19-4","19-0","19-1","19-2","19-3","1-7","0-8","2-8","3-7","5-7","4-8","15-7","14-8","17-7","16-8","18-8","19-7"]},
    "pikachu":{"width":34,"height":24,"grids":["0-8","1-8","2-8","3-8","4-8","5-8","7-7","6-7","7-8","7-9","6-11","6-12","6-10","6-13","7-14","7-15","7-16","8-16","7-17","7-18","7-19","6-20","6-21","6-22","2-7","2-6","3-7","2-5","0-7","1-6","1-7","3-4","4-4","5-3","6-3","7-2","8-2","9-2","10-2","11-1","12-1","13-1","14-0","15-0","16-0","17-0","18-0","19-0","20-0","21-1","22-1","23-1","24-2","25-2","26-2","27-2","28-3","29-3","30-4","31-4","32-5","32-6","33-6","33-7","34-7","33-8","32-7","32-8","34-8","31-8","31-7","30-8","29-8","28-7","27-7","26-6","26-5","27-8","27-9","24-7","23-7","22-6","21-6","24-10","25-10","26-11","25-11","25-12","24-11","23-11","25-13","24-12","24-13","23-12","26-12","17-7","13-6","12-6","11-7","10-7","28-10","28-13","28-12","28-11","28-14","27-15","27-16","27-17","26-17","25-17","25-18","27-19","27-18","27-20","28-21","28-22","28-24","28-23","24-16","23-15","22-14","21-13","20-13","19-13","19-15","19-14","20-16","21-17","21-18","22-19","22-20","19-12","19-11","19-10","17-10","18-10","18-9","17-9","16-9","16-10","15-11","15-10","15-12","15-13","16-14","17-14","18-14","8-11","9-13","8-12","9-12","9-11","10-10","10-11","10-12","10-13","11-12","11-11","9-10","15-18","16-18","17-18","18-18","19-18","18-19","17-19","16-19"]},
    "sadding":{"width":32,"height":4,"grids":["2-0","1-0","0-1","1-2","2-2","3-3","2-4","1-4","0-4","3-0","5-4","5-2","5-3","5-1","6-0","7-0","8-1","8-3","8-4","6-2","8-2","7-2","10-0","10-1","10-2","10-3","10-4","11-4","12-4","13-3","11-0","12-0","13-1","13-2","15-0","15-1","15-2","15-3","15-4","17-4","16-4","18-3","18-2","18-1","17-0","16-0","20-0","21-0","22-0","21-1","21-2","21-3","21-4","20-4","22-4","24-4","24-3","24-2","24-0","24-1","25-1","26-2","26-3","27-4","27-3","27-1","27-0","27-2","29-1","29-2","29-3","30-4","31-4","30-0","31-0","32-3","32-2","31-2","32-0","32-4"]}

}

let userPresets = JSON.parse(localStorage.getItem('userPresets')) || {}

let drawBorder = () => {
    ctx.beginPath()
    for (let i = 1; i < ny; i++) {
        ctx.moveTo(0, i * cell_size + 1)
        ctx.lineTo(width, i * cell_size - 1)
    }
    for (let i = 1; i < nx; i++) {
        ctx.moveTo(i * cell_size + 1, 0)
        ctx.lineTo(i * cell_size + 1, height)
    }
    ctx.strokeStyle = '#00FFFF'
    ctx.lineWidth = 2
    ctx.stroke()
}

let drawCell = (cord) => {
    ctx.fillStyle = cell_color
    x = cord.split('-')[0]
    y = cord.split('-')[1]
    ctx.fillRect(cell_size * x + 1, cell_size * y + 1, cell_size - 1, cell_size - 1)
    ctx.stroke()
}

let eraseCell = (cord) => {
    x = cord.split('-')[0]
    y = cord.split('-')[1]
    ctx.clearRect(cell_size * x + 1, cell_size * y + 1, cell_size - 1, cell_size - 1)
    ctx.stroke()
}

let resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    width = window.innerWidth
    height = window.innerHeight
    nx = Math.floor(width / cell_size)
    ny = Math.floor(height / cell_size)
    drawBorder()
    drawAll()
}

let handleMouseClick = (event) => {
    if (!drag) return
    const rect = canvas.getBoundingClientRect()
    x = event.clientX - rect.left
    y = event.clientY - rect.top
    posXY = `${Math.floor(x / cell_size)}-${Math.floor(y / cell_size)}`
    if (grids.has(posXY)) {
        grids.delete(posXY)
        eraseCell(posXY)
    }
    else {
        grids.add(posXY)
        drawCell(posXY)
    }
}

let clearBoard = (clearGrid = true) => {
    if (clearGrid) {grids = new Set()}
    ctx.beginPath()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.stroke()
    drawBorder()
}

let drawAll = () => {
    ctx.beginPath()
    for (let cord of grids) {
        drawCell(cord)
    }
}

let loadPreset = (preset) => {
    clearBoard()
    const offsetX = Math.floor(nx / 2 - Math.floor(preset.width) / 2)
    const offsetY = Math.floor(ny / 2 - Math.floor(preset.height) / 2)
    for (const cord of preset.grids) {
        console.log(cord)
        posXY = `${parseInt(cord.split('-')[0]) + offsetX}-${parseInt(cord.split('-')[1]) + offsetY}`
        grids.add(posXY)
        drawCell(posXY)
    }
}

let loadPresetName = (name) => {
    const preset = presets[name]
    loadPreset(preset)
}

let loadUserPresetName = (name) => {
    const preset = userPresets[name]
    loadPreset(preset)
}

let addPresetMenu = (name) => {
    const presetDOM = document.querySelector('#preset')
    const element = document.createElement('button');
    element.textContent = name
    element.setAttribute('class', 'm-4 bg-green-300 p-4 rounded')
    element.addEventListener('click', () => { loadPresetName(name) })
    presetDOM.appendChild(element)
}

let addUserPresetMenu = (name) => {
    const presetDOM = document.querySelector('#user-preset')
    const element = document.createElement('button');
    element.textContent = name
    element.setAttribute('class', 'm-4 bg-green-300 p-4 rounded')
    element.addEventListener('click', () => { loadUserPresetName(name) })
    presetDOM.appendChild(element)
}

let exportPreset = () => {
    const name = prompt('Name this preset')
    const presetArr = Array.from(grids)
    let newArr = []
    const [maxX, minX, maxY, minY] = getWH(presetArr)
    for (const cord of presetArr) {
        const x = parseInt(cord.split('-')[0])
        const y = parseInt(cord.split('-')[1])
        console.log(x, y)
        newArr.push(`${x-minX}-${y-minY}`)        
    }
    preset = new Preset(maxX-minX, maxY-minY, newArr)
    
    const exportString = JSON.stringify({name: name, data: preset})

    navigator.clipboard.writeText(exportString).then(() => {
        alert('Copied to clipboard')
      }, function(err) {
        textToClipboard(exportString)
        alert('I am not sure if copy to clipboard worked, check that')
      });
}

let importPreset = () => {
    const presetString = prompt('Input your preset', '')
    if (presetString == null || presetString == '') {
        return
    }
    const presetObj = JSON.parse(presetString)
    loadPreset(presetObj.data)
    savePreset(presetObj.name)
}

let getWH = (presetArr) => {
    let minX = 1e9
    let minY = 1e9
    let maxX = 0
    let maxY = 0
    for (const cord of presetArr) {
        const x = parseInt(cord.split('-')[0])
        const y = parseInt(cord.split('-')[1])
        minX = Math.min(x, minX)
        minY = Math.min(y, minY)
        maxX = Math.max(x, maxX)
        maxY = Math.max(y, maxY)
    }
    
    return [maxX , minX, maxY , minY]
}

let savePreset = (name = '') => {
    if (name === ''){
        name = prompt('Name this preset')
    }
    const presetArr = Array.from(grids)
    let newArr = []
    const [maxX, minX, maxY, minY] = getWH(presetArr)
    for (const cord of presetArr) {
        const x = parseInt(cord.split('-')[0])
        const y = parseInt(cord.split('-')[1])
        console.log(x, y)
        newArr.push(`${x-minX}-${y-minY}`)        
    }
    preset = new Preset(maxX-minX, maxY-minY, newArr)
    userPresets[name] = preset
    localStorage.setItem('userPresets', JSON.stringify(userPresets))
    addUserPresetMenu(name)
}

for (const [key, preset] of Object.entries(presets)) {
    addPresetMenu(key)
}

for (const [key, preset] of Object.entries(userPresets)) {
    addUserPresetMenu(key)
}

resizeCanvas()

canvas.addEventListener('mousedown', () => drag = true)
canvas.addEventListener('mouseup', () => drag = false)
canvas.addEventListener('mousemove', handleMouseClick)
canvas.addEventListener('click', handleMouseClick)
window.addEventListener('resize', resizeCanvas, false)

let cellSizeInput = document.querySelector('#cell-size-input')
let cellColorInput = document.querySelector('#cell-color-input')
let applySettingButton = document.querySelector('#apply-button')
let clearBoardButton = document.querySelector('#clear-button')
let exportButton = document.querySelector('#export-button')
let importButton = document.querySelector('#import-button')
let saveButton = document.querySelector('#save-button')

cellSizeInput.value = cell_size
cellColorInput.value = cell_color

exportButton.addEventListener('click', (event) => {
    exportPreset()
})

importButton.addEventListener('click', (event) => {
    importPreset()
})

saveButton.addEventListener('click', (event) => {
    savePreset()
})

applySettingButton.addEventListener('click', (event) => {
    cell_size = parseInt(cellSizeInput.value)
    if (cell_size === 0) {
        alert('You cannot divide by 0, dum')
        return
    }
    nx = Math.floor(width / cell_size)
    ny = Math.floor(height / cell_size)
    cell_color = cellColorInput.value
    clearBoard(clearGrid=false)
    drawAll()
})

clearBoardButton.addEventListener('click', (event) => {
    clearBoard()
})

let textToClipboard = (text) => {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}
