import $ from 'jquery';


/*
* Objectif : récupérer une citation aléatoire à partir d'une API et l'afficher
*
* Étapes :
* 1- Créer une référence vers les éléments du DOM qu'on va utiliser
* 2- Récupérer une citation aléatoire à partir de l'API de QuotesOnDesign (https://quotesondesign.com/api/)
* 3- Afficher la citation
* */

export default class Quote {
    
    constructor () {
        this.initEls();
        this.initEvents();
    }


    initEls () {
        this.$els = {
            quoteText: $('.js-quote-text'),
            quoteAuthor: $('.js-quote-author'),
            container : $('.js-container'),
        }
    }

    initEvents () {
        this.getQuote();

    }

    getQuote() {
        const api = {
            endpoint:'https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand',
            params: {
                'per_page' :1,
            }
        };

        $.ajaxSetup({cache:false});
        $.getJSON(api.endpoint, api.params)
            .then((response) => {
                console.log(response[0].content.rendered, response[0].title.rendered);
                this.renderQuote(response[0].content.rendered, response[0].title.rendered);
            })
            .catch((e) => {
                console.log('error with the quote :',e);
            });
    }

    renderQuote(quote, author) {
        //injection dans la div
        this.$els.quoteText.prepend(quote);
        this.$els.quoteText.prepend(author);
        this.$els.container.addClass('is-ready');
    }


}
