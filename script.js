let grids = new Set()
let cell_size = 24
let height = window.innerHeight
let width = window.innerWidth
let nx = Math.floor(width / cell_size)
let ny = Math.floor(height / cell_size)
let presetDOM = document.querySelector('#preset')
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
    'square': new Preset(10, 10,
        [
            {
                'value': "2,0"
            },
            {
                'value': "1,0"
            },
            {
                'value': "0,0"
            },
            {
                'value': "0,1"
            },
            {
                'value': "0,2"
            },
            {
                'value': "0,3"
            },
            {
                'value': "0,4"
            },
            {
                'value': "0,5"
            },
            {
                'value': "0,6"
            },
            {
                'value': "0,7"
            },
            {
                'value': "0,8"
            },
            {
                'value': "0,9"
            },
            {
                'value': "1,9"
            },
            {
                'value': "3,9"
            },
            {
                'value': "4,9"
            },
            {
                'value': "2,9"
            },
            {
                'value': "5,9"
            },
            {
                'value': "6,9"
            },
            {
                'value': "7,9"
            },
            {
                'value': "8,9"
            },
            {
                'value': "9,9"
            },
            {
                'value': "9,7"
            },
            {
                'value': "9,8"
            },
            {
                'value': "9,3"
            },
            {
                'value': "9,0"
            },
            {
                'value': "9,1"
            },
            {
                'value': "9,2"
            },
            {
                'value': "9,6"
            },
            {
                'value': "9,4"
            },
            {
                'value': "9,5"
            },
            {
                'value': "8,0"
            },
            {
                'value': "7,0"
            },
            {
                'value': "5,0"
            },
            {
                'value': "4,0"
            },
            {
                'value': "3,0"
            },
            {
                'value': "6,0"
            },
        ]),
    
    '>o<': new Preset(18, 13, [
    {
        "value": "1,0"
    },
    {
        "value": "2,0"
    },
    {
        "value": "3,1"
    },
    {
        "value": "4,1"
    },
    {
        "value": "5,2"
    },
    {
        "value": "4,3"
    },
    {
        "value": "3,3"
    },
    {
        "value": "2,4"
    },
    {
        "value": "1,4"
    },
    {
        "value": "1,6"
    },
    {
        "value": "0,7"
    },
    {
        "value": "2,7"
    },
    {
        "value": "3,6"
    },
    {
        "value": "4,8"
    },
    {
        "value": "4,9"
    },
    {
        "value": "4,10"
    },
    {
        "value": "4,11"
    },
    {
        "value": "5,12"
    },
    {
        "value": "6,12"
    },
    {
        "value": "7,11"
    },
    {
        "value": "9,11"
    },
    {
        "value": "10,11"
    },
    {
        "value": "8,11"
    },
    {
        "value": "11,12"
    },
    {
        "value": "12,12"
    },
    {
        "value": "13,11"
    },
    {
        "value": "13,8"
    },
    {
        "value": "13,9"
    },
    {
        "value": "13,10"
    },
    {
        "value": "12,7"
    },
    {
        "value": "11,7"
    },
    {
        "value": "9,8"
    },
    {
        "value": "6,7"
    },
    {
        "value": "5,7"
    },
    {
        "value": "8,8"
    },
    {
        "value": "7,8"
    },
    {
        "value": "10,8"
    },
    {
        "value": "14,6"
    },
    {
        "value": "16,6"
    },
    {
        "value": "15,7"
    },
    {
        "value": "17,7"
    },
    {
        "value": "13,3"
    },
    {
        "value": "14,3"
    },
    {
        "value": "16,4"
    },
    {
        "value": "15,4"
    },
    {
        "value": "12,2"
    },
    {
        "value": "13,1"
    },
    {
        "value": "14,1"
    },
    {
        "value": "15,0"
    },
    {
        "value": "16,0"
    }
])
};

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
    nx = Math.floor(width / cell_size)
    ny = Math.floor(height / cell_size)
    drawBorder()
    drawAll()
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
    console.log(grids)
}

let clearBoard = () => {
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

let loadPreset = (name) => {
    clearBoard()
    const preset = presets[name]
    const offsetX = Math.floor(nx / 2 - Math.floor(preset.width) / 2)
    const offsetY = Math.floor(ny / 2 - Math.floor(preset.height) / 2)
    grids = new Set()
    for (const cord of preset.grids) {
        posXY = `${parseInt(cord.value.split(',')[0]) + offsetX},${parseInt(cord.value.split(',')[1]) + offsetY}`
        grids.add(posXY)
        drawCell(posXY)
    }
}

let addPresetMenu = (preset, name) => {
    const element = document.createElement('button');
    element.textContent = name
    element.setAttribute('class', 'm-4 bg-green-300 p-4 rounded')
    element.addEventListener('click', () => { loadPreset(name) })
    presetDOM.appendChild(element)
}

for (const [key, preset] of Object.entries(presets)) {
    addPresetMenu(preset, key)
}

resizeCanvas()
canvas.addEventListener('click', handleMouseClick)
window.addEventListener('resize', resizeCanvas, false)

let cellSizeInput = document.querySelector('#cell-size-input')
let applySettingButton = document.querySelector('#apply-button')
let clearBoardButton = document.querySelector('#clear-button')

applySettingButton.addEventListener('click', (event) => {
    cell_size = parseInt(cellSizeInput.value)
    clearBoard()
    drawAll()
    nx = Math.floor(width / cell_size)
    ny = Math.floor(height / cell_size)
})

clearBoardButton.addEventListener('click', (event) => {
    clearBoard()
})