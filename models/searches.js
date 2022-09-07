const fs = require('fs');
const axios = require('axios');

class Searches {

    history = [];
    dbPath = './db/database.json';

    constructor() {
        this.readDB();
    }

    get historyCapitalized() {
        
        return this.history.map( place => {
            let words = place.split(' ');
            words = words.map( w => w[0].toUpperCase() + w.substring(1))
            return words.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 6,
            'language': 'en'
        }
    }


    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'en'
        }
    }



    async city( place = '' ) {

        try {
            // Http petition with axios more in the documentation 
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
                params: this.paramsMapbox
            });

            const answ = await instance.get();
            // ({}) : return object of implicit form
            //console.log(answ.data)
            return answ.data.features.map( place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1],
            }));

        } catch (error) {
            return [];
        }
    }



    async weatherPlace( lat, lon ) {

        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat, lon }
            });

            const answ = await instance.get();
            const { weather, main } = answ.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            console.log(error);
        }
    }

    addHistory( place = '' ) {
        // ALL: Prevent duplicates

        if( this.history.includes( place.toLocaleLowerCase() )) {
            return;
        }
        this.history = this.history.splice(0, 5);

        this.history.unshift( place.toLocaleLowerCase() );

        // Record in DB
        this.saveDB();
    }

    saveDB() {

        const payload = {
            history: this.history
        }
        fs.writeFileSync( this.dbPath, JSON.stringify( payload ))
    }

    readDB() {

        if ( !fs.existsSync ) {
            return null;
        } else {

            const info = fs.readFileSync( this.dbPath, {encoding: 'utf-8'});

            const data = JSON.parse( info );

            this.history =  data.history;

        }

    }

}

module.exports = Searches;