  function getRandomIntInclusive(min, max) {
    const newMin = Math.ceil(min);
    const newMax = Math.floor(max);
    return Math.floor(Math.random() * (newMax - newMin + 1) + newMin); 
  }
  
  function injectHTML(list) {
    console.log('fired injectHTML');
    const target = document.querySelector('#restaurant_list');
    target.innerHTML = '';
  
    const listEl = document.createElement('ol');
    target.appendChild(listEl);
    list.forEach((item) => {
      const el = document.createElement('li');
      el.innerText = item.name;
      listEl.appendChild(el);
    });
  }

  function processRestaurants(list) {
    console.log('fired restaurants list');
    const range = [...Array(15).keys()];
    const newArray = range.map((item) => {
      const index = getRandomIntInclusive(0, list.length);
      return list[index];
    });
    return newArray;
  }
  
  function filterList(list, filterInputValue) {
    return list.filter((item) => {
      if (!item.name) { return; }
      const lowerCaseName = item.name.toLowerCase();
      const lowerCaseQuery = filterInputValue.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery);
    })
  }

  function initMap() {

    console.log('initMap');
    const map = L.map('map').setView([38.9897, -76.9378], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom: 19,
      attributes: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' 
    }).addTo(map);
    return map;
  }

  function markerPlace(array, map) {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove(); 
      }
      });

    array.forEach((item, index) => {
      const {coordinates} = item.geocoded_column_1;
      L.marker([coordinates[1], coordinates[0]]).addTo(map);
      if(index === 0) {
        map.setView([coordinates[1], coordinates[0]], 10);
      }
    });
    }

  async function mainEvent() {
    const pageMap = initMap();

    const form = document.querySelector('.main_form'); 
    const submit = document.querySelector('#get-resto'); 
    const loadAnimation = document.querySelector('.lds-ellipsis');
    submit.style.display = 'none'; 

    // const results = await fetch('https://api.spotify.com.');  
    // const arrayFromJson = await results.json(); 

    var SpotifyWebApi = require('spotify-web-api-node');
    var spotifyApi = new SpotifyWebApi({
      clientId: '51337b9aab714a6babee103189858810',
      clientSecret: '4c693670485946a6a982309125091dd6',
      redirectUri: 'https://ahsankhalid180.github.io/Final_Project/'
    });

    console.log('Test PG County Set')
    console.table(arrayFromJson);
  

    console.log(arrayFromJson[0]);
  
    console.log(`${arrayFromJson[0].name} ${arrayFromJson[0].category}`);
  
    if (arrayFromJson?.length > 0) { 
      submit.style.display = 'block'; 
  
      loadAnimation.classList.remove('lds-ellipsis');
      loadAnimation.classList.add('lds-ellipsis_hidden');
  
      let currentList = [];
  
      form.addEventListener('input', (event) => {
        console.log(event.target.value);
        const filteredList = filterList(currentList, event.target.value);
        injectHTML(filteredList);
        markerPlace(filteredList, pageMap); 
      });

      form.addEventListener('submit', (submitEvent) => {
        submitEvent.preventDefault();
  

        currentList = processRestaurants(arrayFromJson);

        injectHTML(currentList);
        markerPlace(currentList, pageMap); 
  

      });
    }
  }

  document.addEventListener('DOMContentLoaded', async () => mainEvent()); 
  

  // var spotifyApi = new SpotifyWebApi({
  //   clientId: 'fcecfc72172e4cd267473117a17cbd4d',
  //   clientSecret: 'a6338157c9bb5ac9c71924cb2940e1a7',
  //   redirectUri: 'http://www.example.com/callback'
  // });