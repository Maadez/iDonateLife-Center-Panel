class GeoPoint {
    constructor(latitude, longitude) {
      this.latitude = latitude;
      this.longitude = longitude;
    }
  
    equals(other) {
      return other instanceof GeoPoint &&
        other.latitude === this.latitude &&
        other.longitude === this.longitude;
    }
  
    hashCode() {
      return `${this.latitude}-${this.longitude}`;
    }
  }