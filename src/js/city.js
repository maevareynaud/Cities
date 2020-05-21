import $ from 'jquery';
import Mustache from 'mustache';

//RÉCUPÉRER LE NOM D'UNE VILLE ET AFFICHER DES INFOS RELATIVES À CELLES CI AINSI QU'UNE IMAGE ET LES VILLES PROCHES

export default class City {
    constructor () {
        // on initialise tous les élément du DOM au meme endroit
        this.initEls();
        // on déclenche nos méthodes
        this.initEvents();
    }

    initEls () {
        // on définit tous les éléments
        this.$els = {
            city: $('.js-city-name'),
            populationCity : $('.js-city-population'),
            regionCity : $('.js-city-region'),
            timeCity : $('.js-city-hour'),
            near : $('.js-city-near-name'),
            distance : $('.js-city-near-distance'),
        };

        this.url = 'http://geodb-free-service.wirefreethought.com/v1/geo/cities';
        this.name = $('.js-city-search').value;
        this.near = 'nearbyCities?limit=5&offset=0&minPopulation=10000&radius=100';
        this.tpl_near = '{{#near}}<div class="city js-city"><h3 class="js-city-near-name">{{name}}</h3><p class="js-city-near-distance">{{distance}}</p></div>{{/near}};';
    
    };

    initEvents () {

        $('.js-city-search').on('keypress', (e)=> {
            this.removeRender();
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode == '13') {
                let namekeypressed = e.target.value;
                console.log(namekeypressed);  

                this.loadCity(namekeypressed);
            }
        });
    }

    loadCity (name) {

        const api = {
            endpoint:`${this.url}`,
            params: {
                'offset' : 0,
                'hatesoasMode' : false,
                'namePrefix' : name,            
            }
        };

        $.ajaxSetup({cache:false});
        $.ajax({
            url : api.endpoint, 
            data : api.params,
            type: "GET",
            contentType : "JSON",

            })

            .then((response) => {
                //console.log(response.data[0].name);
                let id = response.data[0].id;
                this.loadIdCity(id); 
            })
            .catch((e) => {
                console.log('error with the city :',e);
            });
    }

    loadIdCity(id)
    {

        console.log(id);
        const id_api = {
            endpoint:`${this.url}/${id}`,
            
        }

        $.ajaxSetup({cache:false});
        $.ajax({
            url : id_api.endpoint, 
            data : id_api.params,
            type: "GET",
            contentType : "JSON",

            })
            .then((response) => {
                //console.log(response.data[0].name);
                this.$response = {
                    nameCity : response.data.name,
                    idCity : response.data.id,
                    regionCity :response.data.region,
                    populationCity : response.data.population,
                    timeCity : response.data.timezone,
                }

                this.renderCity(this.$response.nameCity, 
                    this.$response.regionCity, 
                    this.$response.populationCity, 
                    this.$response.timeCity);
                this.loadNearCities(this.$response.idCity);
            })
            .catch((e) => {
                console.log('error with the city :',e);
            });
    }

    loadNearCities (idCity){
            console.log('NEAR');
            const near_api = {
            endpoint:`${this.url}/${idCity}/${this.near}`,
        }

        $.ajaxSetup({cache:false});
        $.ajax({
            url : near_api.endpoint, 
            data : near_api.params,
            type: "GET",
            contentType : "JSON",

            })
            .then((response) => {

                /*for(const prop in response.data){
                    $('.container').html(Mustache.render(this.tpl_near, {near : response.data}));
                }*/
                
                $('.container').html(Mustache.render(this.tpl_near, {near : response.data}));
                
            })
            .catch((e) => {
                console.log('error with the city :',e);
            });

    }

    

    renderCity (name, region, population, timezone) {
        this.$els.city.prepend(name);
        this.$els.city.css('opacity','1');
        $('section:first-of-type .js-city-name').css('opacity','0.5');
        this.$els.city.css('transition','0.3s');
        this.$els.regionCity.prepend(region);
        this.$els.populationCity.prepend(population);
        this.$els.timeCity.prepend(timezone);
    }

    renderNearCities(name, distance){
        this.$els.near.prepend(name);
        this.$els.distance.prepend(distance);
    }

    removeRender(){
        this.$els.city.empty();
        this.$els.regionCity.empty();
        this.$els.populationCity.empty();
        this.$els.timeCity.empty();
        this.$els.near.empty();
        this.$els.distance.empty();

    }
}