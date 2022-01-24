const key='84d69d5ebdd42f36151fcd03feba90ad';

const infos = document.getElementById('infos');
const ressenti = document.querySelector('.ressenti');
const humidite = document.querySelector('.humidite');
const vent = document.querySelector('.vent');
const lieu = document.querySelector('.lieu');

const image = document.getElementById('image');

const temp = document.getElementById('temp');
const cloud = document.getElementById('cloud');

const heure = document.querySelectorAll('.hour-name');
const heurePre = document.querySelectorAll('.hour-prevision');

const day = document.querySelectorAll('.day-name');
const dayPre = document.querySelectorAll('.day-prevision');

const champ = document.getElementById('champ');
const loader = document.getElementById('loader');
const outer = document.getElementById('outer');


const semaine = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim']

const auj = new Date().toLocaleDateString('fr-FR', {weekday: 'short'}).split('.')[0];
newS = semaine.slice(semaine.indexOf(auj) + 1).concat(semaine.slice(0, semaine.indexOf(auj) + 1))

let url2

// localisation météo
const localisation = async () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&lang=fr&appid=${key}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                temp.innerText = `${Math.ceil(data.current.temp)} °C`
                cloud.innerText = `${data.current.weather[0].description}`

                ressenti.innerText = `Ressenti ${Math.ceil(data.current.feels_like)} °C`
                humidite.innerText = `Humidité ${data.current.humidity} %`
                vent.innerText = `Vent ${data.current.wind_speed} Km/h`
                lieu.innerText = `${data.timezone}`

                let h = new Date().getHours()
                let hplus = h
                
                heure.forEach(he => {
                    hplus+=3
                    if(hplus > 23) hplus = 0
                    he.innerText = `${hplus} h`
                })

                    let i = 2;
                heurePre.forEach(hp => {
                    hp.innerText = `${Math.ceil(data.hourly[i].temp)} °C`
                    i+=3
                })

                if(h > 6 && h < 18) image.setAttribute('src', `./ressources/jour/${data.current.weather[0].icon}.svg`)
                else {
                    image.setAttribute('src', `./ressources/nuit/${data.current.weather[0].icon}.svg`)
                }

                for(let i = 0; i<newS.length; i++) {
                    day[i].innerText = newS[i]
                    dayPre[i].innerText = `${Math.ceil(data.daily[i+1].temp.day)} °C`
                }
            })
        })
    } else alert('vous avez refusé la géolocalisation, mais ce n\'est pas grave entrez manuellement votre ville')
}

localisation();


const appelApi1 = async () => {
    const ville = champ.value;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&units=metric&lang=fr&appid=${key}`

    let resultatApi
    await fetch(url)
    .then(res => {
        if(res.ok) return res.json()
        window.alert('les informations entrées sont incorrects')
    })
    .then(data => {
        console.log(data)
        url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&lang=fr&appid=${key}`
        
        temp.innerText = `${Math.ceil(data.main.temp)} °C`
        cloud.innerText = `${data.weather[0].description}`

        ressenti.innerText = `Ressenti ${Math.ceil(data.main.feels_like)} °C`
        humidite.innerText = `Humidité ${data.main.humidity} %`
        vent.innerText = `Vent ${data.wind.speed} Km/h`
        lieu.innerText = `${data.name} - ${data.sys.country}`
        
    })
}


const afficher = async () => {

    loader.className -= 'hidden'
    outer.className -= 'hidden'
    
    await appelApi1();

    await fetch(url2)
    .then(res => {
        if(res.ok) return res.json()
        window.alert('Les données n\'ont pas pu aboutir')
    })
    .then(data => {
        resultatApi = data
    })

    console.log(resultatApi);

    let h = new Date().getHours()
    let hplus = h
    
    heure.forEach(he => {
        hplus+=3
        if(hplus > 23) hplus = 0
        he.innerText = `${hplus} h`
    })

        let i = 2;
    heurePre.forEach(hp => {
        hp.innerText = `${Math.ceil(resultatApi.hourly[i].temp)} °C`
        i+=3
    })

    if(h > 6 && h < 18) image.setAttribute('src', `./ressources/jour/${resultatApi.current.weather[0].icon}.svg`)
    else {
        image.setAttribute('src', `./ressources/nuit/${resultatApi.current.weather[0].icon}.svg`)
    }

    for(let i = 0; i<newS.length; i++) {
        day[i].innerText = newS[i]
        dayPre[i].innerText = `${Math.ceil(resultatApi.daily[i+1].temp.day)} °C`
    }

    loader.className += ' hidden'
    outer.className += ' hidden'
    champ.value = ''
}





