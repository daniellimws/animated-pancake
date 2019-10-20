var table0 = {
    w: 1,
    h: 1
}

var visual_mode = true

const enable_visual = () => {
    visual_mode = true
    $('textarea').prop('readonly', true)
}

const disable_visual = () => {
    visual_mode = false
    $('textarea').prop('readonly', false)
}

const get_row_max = (table, row) => {
    let max = 1
    for (var i = 0; i < table0.w; ++i) {
        max = Math.max(max, $(`#table${table}-${row}-${i}`).val().split(/\n/).length)
    }
    return max
}

const getLineMaxLen = (lines) => {
    let max = -1
    for (var i = 0; i < lines.length; i++) {
        max = Math.max(lines[i].length, max)
    }
    return max
}

const get_col_max = (table, col) => {
    let max = 0
    for (var i = 0; i < table0.h; ++i) {
        max = Math.max(max, getLineMaxLen($(`#table${table}-${i}-${col}`).val().split(/\n/)))
    }
    return max
}

const fit_table = (table) => {
    for (var i = 0; i < table0.w; ++i) {
        fit_col(table, i)
    }
    for (var i = 0; i < table0.h; ++i) {
        fit_row(table, i)
    }
}

const fit_row = (table, row) => {
    let max = get_row_max(table, row)
    for (var i = 0; i < table0.w; ++i) {
        $(`#table${table}-${row}-${i}`).attr('rows', max)
    }
}

const fit_col = (table, col) => {
    let max = Math.max(get_col_max(table, col), 8) * 1.25
    for (var i = 0; i < table0.h; ++i) {
        $(`#table${table}-${i}-${col}`).attr('cols', max)
    }
}

const add_row_above = (y) => {
    for (var i = table0.h - 1; i >= y; i--) {
        $(`#table0-${i}`).attr('id', `table0-${i + 1}`)
        for (var j = 0; j < table0.w; j++) {
            $(`#table0-${i}-${j}`).attr('id', `table0-${i + 1}-${j}`)
        }
    }

    table0.h++

    let content = `<div id="table0-${y}">`
    for (var i = 0; i < table0.w; ++i) {
        content += `<textarea id="table0-${y}-${i}" readonly></textarea>`
    }
    content += '</div>'
    if (y === 0) {
        $("#table0").prepend(content);
    }
    else {
        $(`#table0 > div:nth-child(${y})`).after(content);
    }

    fit_table(0)
}

const add_row_below = (y) => {
    for (var i = table0.h - 1; i > y; i--) {
        $(`#table0-${i}`).attr('id', `table0-${i + 1}`)
        for (var j = 0; j < table0.w; j++) {
            $(`#table0-${i}-${j}`).attr('id', `table0-${i + 1}-${j}`)
        }
    }

    table0.h++

    let content = `<div id="table0-${y + 1}">`
    for (var i = 0; i < table0.w; ++i) {
        content += `<textarea id="table0-${y + 1}-${i}" readonly></textarea>`
    }
    content += '</div>'
    $(`#table0 > div:nth-child(${y + 1})`).after(content);

    fit_table(0)
}

const add_col_left = (x) => {
    for (var i = table0.w - 1; i >= x; i--) {
        for (var j = 0; j < table0.h; j++) {
            $(`#table0-${j}-${i}`).attr('id', `table0-${j}-${i + 1}`)
        }
    }

    table0.w++

    for (var i = 0; i < table0.h; ++i) {
        let content = `<textarea id="table0-${i}-${x}" readonly></textarea>`
        if (x === 0) {
            $(`#table0-${i}`).prepend(content);
        }
        else {
            $(`#table0-${i} > textarea:nth-child(${x})`).after(content);
        }
    }

    fit_table(0)
}

const add_col_right = (x) => {
    for (var i = table0.w - 1; i > x; i--) {
        for (var j = 0; j < table0.h; j++) {
            $(`#table0-${j}-${i}`).attr('id', `table0-${j}-${i + 1}`)
        }
    }

    table0.w++

    for (var i = 0; i < table0.h; ++i) {
        let content = `<textarea id="table0-${i}-${x + 1}" readonly></textarea>`
        $(`#table0-${i} > textarea:nth-child(${x + 1})`).after(content);
    }

    fit_table(0)
}

const del_col = (x) => {
    for (var i = 0; i < table0.h; i++) {
        $(`#table0-${i}-${x}`).remove()
    }

    for (var i = x + 1; i < table0.w; i++) {
        for (var j = 0; j < table0.h; j++) {
            $(`#table0-${j}-${i}`).attr('id', `table0-${j}-${i - 1}`)
        }
    }

    table0.w--

    fit_table(0)
}

const del_row = (y) => {
    $(`#table0-${y}`).remove()

    for (var i = y + 1; i < table0.h; i++) {
        $(`#table0-${i}`).attr('id', `table0-${i - 1}`)
        for (var j = 0; j < table0.w; j++) {
            $(`#table0-${i}-${j}`).attr('id', `table0-${i - 1}-${j}`)
        }
    }

    table0.h--

    fit_table(0)
}

const toggle_header = (y) => {
    $(`#table0-${y}`).toggleClass("header-row")
}

const is_special_row = (table, y) => {
    return $(`#table${table}-${y}`).hasClass("header-row")
}

const update_output = () => {
    let content = ""

    let row_maxs = []
    let col_maxs = []

    for (var i = 0; i < table0.h; ++i) {
        row_maxs.push(get_row_max(0, i))
    }

    for (var i = 0; i < table0.w; ++i) {
        col_maxs.push(get_col_max(0, i))
    }

    console.log(col_maxs)
    for (var i = 0; i < table0.h; ++i) {
        if (i == 0  || is_special_row(0, i) || is_special_row(0, i - 1)) {
            content += "+"
        }
        else {
            content += "."
        }
        for (var j = 0; j < table0.w; ++j) {
            content += "-".repeat(col_maxs[j] + 2)
            if (i == 0 || is_special_row(0, i) || is_special_row(0, i - 1)) {
                content += "+"
            }
            else {
                content += "."
            }
        }
        content += "\n"

        for (var l = 0; l < row_maxs[i]; ++l) {
            content += "|"
            for (var j = 0; j < table0.w; ++j) {
                let lines = $(`#table0-${i}-${j}`).val().split(/\n/)
                let line = " ";
                if (l < lines.length) {
                    line += lines[l]
                }

                line = line.padEnd(col_maxs[j] + 2, " ")
                content += line
                content += "|"
            }
            content += "\n"
        }
    }

    content += "+"
    for (var j = 0; j < table0.w; ++j) {
        content += "-".repeat(col_maxs[j] + 2)
        content += "+"
    }

    $('#output-text').val(content)
}

$(document).ready(function () {
    enable_visual()
    fit_table(0)

    $(document).keyup(function (event) {
        if (visual_mode) {
            switch (event.key) {
                case 'i':
                    disable_visual()
                    break
            }
        }
        else {
            if (event.key == 'Escape')
                enable_visual()
        }
    })

    $(document).keypress(function (event) {
    })

    $('#board').on('change keyup paste cut', 'textarea', function (event) {
        if (!visual_mode) {
            let cellId = getCellId($(this).attr('id'))
            fit_row(0, cellId.y)
            fit_col(0, cellId.x)
            update_output()
        }
        else {
            switch (event.key) {
                case 'w':
                    y = getCellId($(this).attr('id')).y
                    add_row_above(y)
                    break
                case 's':
                    y = getCellId($(this).attr('id')).y
                    add_row_below(y)
                    break
                case 'a':
                    x = getCellId($(this).attr('id')).x
                    add_col_left(x)
                    break
                case 'd':
                    x = getCellId($(this).attr('id')).x
                    add_col_right(x)
                    break
                case 'r':
                    y = getCellId($(this).attr('id')).y
                    del_row(y)
                    break
                case 'c':
                    x = getCellId($(this).attr('id')).x
                    del_col(x)
                    break
                case 'h':
                    y = getCellId($(this).attr('id')).y
                    toggle_header(y)
                    break
            }
        }
    }).find('textarea').change()
})

function Cell(w, h) {
    return {
        w: w,
        h: h
    }
}

function CellId(name, y, x) {
    return {
        name: name,
        x: parseInt(x),
        y: parseInt(y)
    }
}

var getCellId = function (cellName) {
    let nums = cellName.split("-")
    return CellId(nums[0], nums[1], nums[2])
}