import { GeoPoint } from "firebase/firestore";
import Util from "./util";

export default class GeoFirePoint {
  static _util = new Util();
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  static distanceBetween({ to, from }) {
    return Util.distance(to, from);
  }

  static neighborsOf({ hash }) {
    return GeoFirePoint._util.neighbors(hash);
  }

  get hash() {
    return GeoFirePoint._util.encode(this.latitude, this.longitude, 9);
  }

  get neighbors() {
    return GeoFirePoint._util.neighbors(this.hash);
  }

  get geoPoint() {
    return new GeoPoint(this.latitude, this.longitude);
  }

  get coords() {
    return new Coordinates(this.latitude, this.longitude);
  }

  distance({ lat, lng }) {
    return GeoFirePoint.distanceBetween({ from: this.coords, to: new Coordinates(lat, lng) });
  }

  get data() {
    return { geopoint: this.geoPoint, geohash: this.hash };
  }

  haversineDistance({ lat, lng }) {
    return GeoFirePoint.distanceBetween({ from: this.coords, to: new Coordinates(lat, lng) });
  }
}

class Coordinates {
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}