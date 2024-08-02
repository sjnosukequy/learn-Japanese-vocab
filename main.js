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

let hira;
let kata;
let hira_keys;
let kata_keys;
let correct = 0
let attempt = 0
let ans = 0
let is_start = true

function generate(size) {
    const array = new Uint8Array(1);
    self.crypto.getRandomValues(array);
    let rand = array[0]
    rand = Math.floor((rand - 0) / (255 - 0) * (size - 1))
    let a = document.getElementById('jap')
    a.innerText = hira_keys[rand]
    a.setAttribute("data-tip", hira[hira_keys[rand]])
    // a.addEventListener("mouseover", () => {

    // })
    is_start = false
    return rand
}

async function main() {
    hira = await load_Hira();
    kata = await load_Kata();
    hira_keys = Object.keys(hira)
    kata_keys = Object.keys(kata)
    ans = generate(hira_keys.length)
    let alr = false
    let a = document.getElementById('input')
    a.addEventListener("keyup", () => {
        if (is_start)
            generate(hira_keys.length)
        else {
            if (a.value.length >= hira[hira_keys[ans]].length) {
                if (!alr) {
                    attempt += 1
                }
                if (a.value.toLowerCase() == hira[hira_keys[ans]]) {
                    is_start = false
                    ans = generate(hira_keys.length)
                    a.value = ""
                    if (!alr)
                        correct += 1
                    alr = false
                    document.getElementById('score').innerText = 'Score: ' + correct + '/' + attempt
                }
                else {
                    alr = true
                    document.getElementById('score').innerText = 'Score: ' + correct + '/' + attempt
                }
            }
        }
    })
}

main();

