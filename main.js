let themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset"
]

// Custom Theme
for (let i in themes) {
    let k = document.createElement("li")
    let a = document.createElement("a")
    a.innerText = themes[i]
    a.addEventListener("click", () => {
        localStorage.setItem("theme", a.innerText);
        document.getElementsByTagName("html")[0].setAttribute("data-theme", a.innerText)
    })
    k.appendChild(a)
    document.getElementById('List_Theme').appendChild(k)
}

async function load_Hira() {
    try {
        let response = await fetch("./data/hira.json");
        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function load_Kata() {
    try {
        let response = await fetch("./data/kata.json");
        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function load_table() {
    try {
        let response = await fetch("./table.html");
        let data = await response.text();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

let hira;
let kata;
let hira_keys;
let kata_keys;
let correct = 0
let attempt = 0
let ans = 0
let is_start = true
let switch_lang = [true, false]
let hira_switch = document.getElementById('Hira')
let kata_switch = document.getElementById('Taka')

function is_bool(num) {
    if (num === true || num === false)
        return true
    return false
}

function reset_lang() {
    switch_lang = [true, false]
    localStorage.setItem('langs', JSON.stringify(switch_lang))
}

// Load from storage
let theme = localStorage.getItem('theme')
if (theme === null)
    localStorage.setItem("theme", 'light')
else
    document.getElementsByTagName("html")[0].setAttribute("data-theme", theme)

switch_lang = JSON.parse(localStorage.getItem('langs'))
if (switch_lang === null)
    reset_lang()
else if (switch_lang.length != 2)
    reset_lang()
else {
    if (is_bool(switch_lang[0]) && is_bool(switch_lang[1])) {
        hira_switch.checked = switch_lang[0]
        kata_switch.checked = switch_lang[1]
    }
    else
        reset_lang()
}


function generate() {
    let options = 0
    for (let i in switch_lang)
        options += switch_lang[i]
    let offset = !switch_lang[0] ? 1 : 0
    let choice = Math.floor(offset + Math.random() * (options))
    // console.log(choice == 0 ? "Hira" : "Kata")

    let lang
    let key_lang
    if (choice == 0) {
        lang = hira
        key_lang = hira_keys
    }
    else {
        lang = kata
        key_lang = kata_keys
    }

    const array = new Uint8Array(1);
    self.crypto.getRandomValues(array);
    let rand = array[0]
    rand = Math.floor((rand - 0) / (255 - 0) * (key_lang.length - 1))
    let a = document.getElementById('jap')
    a.innerText = key_lang[rand]
    a.setAttribute("data-tip", lang[key_lang[rand]])
    is_start = false
    return {
        "char": key_lang[rand],
        "ans": lang[key_lang[rand]],
        "index": rand
    }
}

async function main() {
    hira = await load_Hira();
    kata = await load_Kata();
    hira_keys = Object.keys(hira)
    kata_keys = Object.keys(kata)
    ans = generate(hira_keys.length)
    let alr = false

    document.querySelector('#table').innerHTML = await load_table()

    hira_switch.addEventListener('change', () => {
        if (!switch_lang[0] || switch_lang[1])
            switch_lang[0] = !switch_lang[0]
        hira_switch.checked = switch_lang[0]
        localStorage.setItem('langs', JSON.stringify(switch_lang))
    })

    kata_switch.addEventListener('change', () => {
        if (switch_lang[0] || !switch_lang[1])
            switch_lang[1] = !switch_lang[1]
        kata_switch.checked = switch_lang[1]
        localStorage.setItem('langs', JSON.stringify(switch_lang))
    })

    let a = document.getElementById('input')
    a.addEventListener("keyup", () => {
        if (is_start)
            generate(hira_keys.length)
        else {
            if (a.value.length >= ans["ans"].length) {
                if (!alr) {
                    attempt += 1
                }
                if (a.value.toLowerCase() == ans["ans"]) {
                    is_start = false
                    ans = generate(hira_keys.length)
                    a.value = ""
                    if (!alr)
                        correct += 1
                    alr = false
                    document.getElementById('score').innerText = 'Score: ' + correct + ' / ' + attempt
                }
                else {
                    alr = true
                    document.getElementById('score').innerText = 'Score: ' + correct + ' / ' + attempt
                }
            }
        }
    })

}

main();

