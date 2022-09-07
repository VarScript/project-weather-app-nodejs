require('dotenv').config()

const { readInput,
    inquirerMenu, 
    pause,
    listPlaces
} = require("./helpers/inquirer");
const Searches = require('./models/searches');


const main = async() => {

    const searches = new Searches();
    let opt;

    do {

        opt = await inquirerMenu();

        switch ( opt ) {
            case 1:
                    // Show message
                    console.clear();
                    console.log('------------------------'.yellow);
                    console.log('      Shearch city      '.yellow);
                    console.log('------------------------\n'.yellow);
                    console.log();
                    const citySearch = await readInput('City: '.yellow);

                    // Shearch the places
                    const places = await searches.city( citySearch );

                    // Select the place
                    const id = await listPlaces( places );
                    if (id === '0' ) continue;

                    const placeSelect = places.find( l => l.id === id );

                    // Save in DB
                    searches.addHistory( placeSelect.name );

                    // Weather
                    const weather = await searches.weatherPlace( placeSelect.lat, placeSelect.lng )
                    //console.log(weather);

                    // Show results
                    console.clear();
                    console.clear();
                    console.log('------------------------'.yellow);
                    console.log('    City information    '.yellow);
                    console.log('------------------------\n'.yellow);
                    console.log('City: ', placeSelect.name.yellow);
                    console.log('Lat: ', placeSelect.lat);
                    console.log('Lng: ', placeSelect.lng);
                    console.log('Temperature: ', weather.temp);
                    console.log('Min: ', weather.min);
                    console.log('Max: ', weather.max);
                    console.log('How is the weather?: ', weather.desc.yellow);
                break;

            case 2:
                    console.clear();
                    console.log('------------------------'.yellow); 
                    console.log('         History        '.yellow);
                    console.log('------------------------\n'.yellow);
                    console.log();
                    searches.historyCapitalized.forEach( (place, i) => {
                        const idx = `${ i + 1 }.`.yellow;
                        console.log(`${ idx } ${ place }`);
                    });
                break;
        }


        if ( opt !== 0 ) await pause();

    } while( opt !== 0);

}

main();