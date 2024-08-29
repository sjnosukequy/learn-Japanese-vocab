let sec_node = document.getElementsByClassName('sec')[0]
const config = { attributes: true, childList: true, subtree: true };
let sec = 0
let min = 0
let hr = 2
let set_sec = 0
let set_min = 0
let set_hr = 0
let pause = false
let start = false

const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type === "attributes") {
            setTimeout(() => {
                let exceed_sec = false
                let exceed_min = false
                let exceed_hr = false

                if (start)
                    if (!pause) {
                        sec -= 1
                        if (sec < 0) {
                            sec = 59
                            exceed_sec = true
                        }

                        if (exceed_sec) {
                            min -= 1
                            if (min < 0) {
                                min = 59
                                exceed_min = true
                            }
                        }

                        if (exceed_min) {
                            hr -= 1
                            if (hr < 0) {
                                hr = 0
                                exceed_hr = true
                            }
                        }

                        if (exceed_hr) {
                            start = false
                            sec = 0
                            min = 0

                            document.getElementById('init_controller').classList.replace('hidden', 'block')
                            document.getElementById('post_controller').classList.replace('block', 'hidden')

                            document.getElementById('inform').querySelector('span').innerText = 'Time up!!'
                            document.getElementById('inform').style.opacity = '100'
                            setTimeout(() => {
                                document.getElementById('inform').style.opacity = '0'
                            }, 2000)
                        }

                        update_timer()
                    }
            }, 1000)
            // console.log(`The ${mutation.attributeName} attribute was modified.`);
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(sec_node, config);

function update_timer() {
    document.getElementsByClassName('sec')[0].setAttribute('style', `--value:${sec};`)
    document.getElementsByClassName('min')[0].setAttribute('style', `--value:${min};`)
    document.getElementsByClassName('hr')[0].setAttribute('style', `--value:${hr};`)
    document.getElementsByClassName('sec')[1].setAttribute('style', `--value:${sec};`)
    document.getElementsByClassName('min')[1].setAttribute('style', `--value:${min};`)
    document.getElementsByClassName('hr')[1].setAttribute('style', `--value:${hr};`)
}

function assign() {
    sec = set_sec
    min = set_min
    hr = set_hr
}

let modal = document.getElementById('my_modal')
let modal_content = document.getElementById('modal_content')

modal.addEventListener('click', () => {
    modal.close()
})

modal_content.addEventListener('click', (event) => {
    event.stopPropagation()
})

// SET TIMER
function rank_time_up() {
    if (set_sec > 59) {
        set_sec = 0
        set_min += 1
    }
    if (set_min > 59) {
        set_min = 0
        set_hr += 1
    }
    if (set_hr > 23)
        set_hr = 0
    document.getElementById('set_sec').setAttribute('style', `--value:${set_sec};`)
    document.getElementById('set_min').setAttribute('style', `--value:${set_min};`)
    document.getElementById('set_hr').setAttribute('style', `--value:${set_hr};`)
}

function rank_time_down() {
    if (set_sec < 0) {
        set_sec = 59
        set_min -= 1
    }
    if (set_min < 0) {
        set_min = 59
        set_hr -= 1
    }
    if (set_hr < 0)
        set_hr = 23
    document.getElementById('set_sec').setAttribute('style', `--value:${set_sec};`)
    document.getElementById('set_min').setAttribute('style', `--value:${set_min};`)
    document.getElementById('set_hr').setAttribute('style', `--value:${set_hr};`)
}

// SEC
document.getElementById('up_sec').addEventListener('click', () => {
    set_sec += 1
    rank_time_up()
})

document.getElementById('dwn_sec').addEventListener('click', () => {
    set_sec -= 1
    rank_time_down()
})

// MIN
document.getElementById('up_min').addEventListener('click', () => {
    set_min += 1
    rank_time_up()
})

document.getElementById('dwn_min').addEventListener('click', () => {
    set_min -= 1
    rank_time_down()
})

// HR
document.getElementById('up_hr').addEventListener('click', () => {
    set_hr += 1
    rank_time_up()
})

document.getElementById('dwn_hr').addEventListener('click', () => {
    set_hr -= 1
    rank_time_down()
})


document.getElementById('set_timer').addEventListener('click', () => {
    start = true
    assign()
    update_timer()
    modal.close()
    document.getElementById('init_controller').classList.replace('block', 'hidden')
    document.getElementById('post_controller').classList.replace('hidden', 'block')
})

// Functionalities
let play_butt = document.getElementById('play')

play_butt.addEventListener('click', () => {
    if (!pause) {
        play_butt.innerText = '▶'
    } else {
        play_butt.innerText = '❚❚'
        update_timer()
    }
    pause = !pause
})

let reset = document.getElementById('reset')
reset.addEventListener('click', () => {
    start = false
    sec = 0
    min = 0
    hr = 0
    update_timer()

    document.getElementById('init_controller').classList.replace('hidden', 'block')
    document.getElementById('post_controller').classList.replace('block', 'hidden')

    document.getElementById('inform').querySelector('span').innerText = 'Timer Reset!'
    document.getElementById('inform').style.opacity = '100'
    setTimeout(() => {
        document.getElementById('inform').style.opacity = '0'
    }, 2000)
})