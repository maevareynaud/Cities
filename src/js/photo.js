import $ from 'jquery';


export default class Photo {
    constructor () {
        this.initEls();
        this.initEvents();
    }

    initEls () {
        this.$els = {
            background: $('.js-city-photo')
        };
        this.url = 'https://source.unsplash.com/featured';
        this.size = '900x1200'
    }

    initEvents () {

        $('.js-city-search').on('keypress', (e)=> {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode == '13') {
                let namekeypressed = e.target.value;
                this.loadImage(namekeypressed);
            }
        });

    }

    loadImage (name) {
        const promise = new Promise((resolve, reject) => {
            const image = new Image();
            image.src = `${this.url}/${this.size}/?city,${name}`;
            image.onload = () => {
                resolve(image);
            };
            image.onerror = (error) => {
                reject(error);
            };
        });

        // si resolve ça se stocke ici
        promise.then((image) => {
            this.addBackground(image);
            console.log(image);
        });

        // si reject ça se stocke ici
        promise.catch((error) => {
            console.log('Error : ', error);
        });
    }

    addBackground (image) {
        this.$els.background.css('background-image', `url(${image.src})`);
        this.$els.background.css('background-size', 'cover');
        this.$els.background.addClass('is-ready');
    }
}
