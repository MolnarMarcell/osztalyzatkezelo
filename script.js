// Adatmodell: jegyek tárolása egy tömbben
let jegyek = [];

// DOM elemek
const tantargySelect = document.getElementById("tantargy");
const jegyGombok = document.querySelectorAll(".jegy-gomb");
const hozzaadasGomb = document.getElementById("hozzaadas");
const jegyekTabla = document.querySelector("table");

let kivalasztottJegy = null;

jegyGombok.forEach(gomb => {
    gomb.addEventListener("click", (e) => {
        jegyGombok.forEach(g => g.style.backgroundColor = "#c7c7c7");
        
        kivalasztottJegy = parseInt(e.target.textContent);
        e.target.style.backgroundColor = "#4CAF50";
    });
});

hozzaadasGomb.addEventListener("click", jegyHozzaadasa);


function jegyHozzaadasa() {
    if (!kivalasztottJegy) {
        alert("Kérlek válassz egy jegyet!");
        return;
    }

    const ujJegy = {
        tantargy: tantargySelect.value,
        jegy: kivalasztottJegy,
        datum: new Date().toISOString().split('T')[0]
    };

    jegyek.push(ujJegy);
    localStorage.setItem("jegyek", JSON.stringify(jegyek));
    

    kivalasztottJegy = null;
    jegyGombok.forEach(g => g.style.backgroundColor = "#f0f0f0");
    jegyekMegjelenites();
    atlagMegjelenites();
}


function jegyekMegjelenites() {
    const tbody = jegyekTabla.querySelector("tbody") || jegyekTabla.insertRow(-1).parentElement;
    tbody.innerHTML = "";

    jegyek.forEach((jegyObj, index) => {
        const sor = tbody.insertRow();
        sor.innerHTML = `
            <td>${jegyObj.tantargy}</td>
            <td>${jegyObj.jegy}</td>
            <td>${jegyObj.datum}</td>
            <td><button class="torol-gomb" data-index="${index}">Törlés</button></td>
        `;
    });

    document.querySelectorAll(".torol-gomb").forEach(gomb => {
        gomb.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            jegyek.splice(index, 1);
            localStorage.setItem("jegyek", JSON.stringify(jegyek));
            jegyekMegjelenites();
            atlagMegjelenites();
        });
    });
}

function atlagMegjelenites() {
    let atlagContainer = document.getElementById("atlag-container");
    
    if (!atlagContainer) {
        atlagContainer = document.createElement("div");
        atlagContainer.id = "atlag-container";
        jegyekTabla.after(atlagContainer);
    }

    if (jegyek.length === 0) {
        atlagContainer.innerHTML = "";
        return;
    }

    const atlagokTantargyankent = {};
    jegyek.forEach(jegyObj => {
        if (!atlagokTantargyankent[jegyObj.tantargy]) {
            atlagokTantargyankent[jegyObj.tantargy] = [];
        }
        atlagokTantargyankent[jegyObj.tantargy].push(jegyObj.jegy);
    });

    let atlagHtml = "<h2>Átlagok</h2>";
    Object.entries(atlagokTantargyankent).forEach(([tantargy, jegyekTombje]) => {
        const atlag = (jegyekTombje.reduce((acc, jegy) => acc + jegy, 0) / jegyekTombje.length).toFixed(2);
        atlagHtml += `<p><strong>${tantargy}:</strong> ${atlag}</p>`;
    });

    const osszesSzam = jegyek.reduce((acc, jegyObj) => acc + jegyObj.jegy, 0);
    const altalnosAtlag = (osszesSzam / jegyek.length).toFixed(2);
    atlagHtml += `<h3>Általános átlag: ${altalnosAtlag}</h3>`;

    atlagContainer.innerHTML = atlagHtml;
}

function adatokBetoltese() {
    const tarolt = localStorage.getItem("jegyek");
    if (tarolt) {
        jegyek = JSON.parse(tarolt);
        jegyekMegjelenites();
        atlagMegjelenites();
    }
}

window.addEventListener("load", adatokBetoltese);