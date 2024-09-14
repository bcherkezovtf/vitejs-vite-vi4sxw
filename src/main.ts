import 'ol/ol.css';
import { watchLocation } from './positions';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { pairwise } from 'rxjs';

const center = fromLonLat([23.38126801887842, 42.65548856001595], 'EPSG:3857');
const locationStyle = new Style({
    image: new Icon({
        src: 'geolocation-marker.png',
    }),
});
const locationFeature = new Feature(new Point(center));

const locationLayer = new VectorLayer({
    source: new VectorSource({
        features: [locationFeature],
    }),
    style: locationStyle,
});

new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
        locationLayer,
    ],
    view: new View({
        center,
        zoom: 19,
    }),
});

watchLocation()
    .pipe(pairwise())
    .subscribe(([prev, curr]) => {

      console.log((curr.timestamp - prev.timestamp)/1000);
    });
