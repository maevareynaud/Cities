import '../css/app.scss';
import City from './city';
import Photo from './photo';


class App {
    constructor () {
        this.initApp();
    }

    initApp () {
      // Start application
      new City();
      new Photo();
    }
}

new App();

