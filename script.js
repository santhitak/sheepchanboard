let grids = new Set()
let cell_size = 24
let height = window.innerHeight
let width = window.innerWidth
let nx = Math.floor(width / cell_size)
let ny = Math.floor(height / cell_size)
let canvas = document.querySelector('#mycanvas')
let ctx = canvas.getContext('2d')

class Preset {
    constructor(width, height, grids) {
        // grids = array of object (what you get when copying the set from console)
        this.width = width
        this.height = height
        this.grids = grids
    }
}

let presets = {
    
}

let userPresets = JSON.parse(localStorage.getItem('userPresets')) || {}

let drawBorder = () => {
    ctx.beginPath()
    for (let i = 1; i < ny; i++) {
        ctx.moveTo(0, i * cell_size)
        ctx.lineTo(width, i * cell_size)
    }
    for (let i = 1; i < nx; i++) {
        ctx.moveTo(i * cell_size, 0)
        ctx.lineTo(i * cell_size, height)
    }
    ctx.strokeStyle = '#00FFFF'
    ctx.lineWidth = 2
    ctx.stroke()
}

let drawCell = (cord) => {
    ctx.fillStyle = '#FF007F'
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

let clearBoard = () => {
    grids = new Set()
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

let addPresetMenu = (preset) => {
    const presetDOM = document.querySelector('#preset')
    const element = document.createElement('button');
    element.textContent = preset.name
    element.setAttribute('class', 'm-4 bg-green-300 p-4 rounded')
    element.addEventListener('click', () => { loadPresetName(preset.name) })
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
    addPresetMenu(preset, key)
}

for (const [key, preset] of Object.entries(userPresets)) {
    addUserPresetMenu(key)
}

resizeCanvas()
canvas.addEventListener('click', handleMouseClick)
window.addEventListener('resize', resizeCanvas, false)

let cellSizeInput = document.querySelector('#cell-size-input')
let applySettingButton = document.querySelector('#apply-button')
let clearBoardButton = document.querySelector('#clear-button')
let exportButton = document.querySelector('#export-button')
let importButton = document.querySelector('#import-button')
let saveButton = document.querySelector('#save-button')

cellSizeInput.value = cell_size

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
    clearBoard()
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