export default class Util {
    static BASE32_CODES = '0123456789bcdefghjkmnpqrstuvwxyz';
    constructor() {
      this.base32CodesDic = {};
      for (let i = 0; i < Util.BASE32_CODES.length; i++) {
        this.base32CodesDic[Util.BASE32_CODES[i]] = i;
      }
    }
  
    encodeAuto = 'auto';
  
    sigfigHashLength = [0, 5, 7, 8, 11, 12, 13, 15, 16, 17, 18];
  
    encode(latitude, longitude, numberOfChars) {
      if (numberOfChars === this.encodeAuto) {
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
          throw new Error('string notation required for auto precision.');
        }
        let decSigFigsLat = latitude.toString().split('.')[1].length;
        let decSigFigsLon = longitude.toString().split('.')[1].length;
        let numberOfSigFigs = Math.max(decSigFigsLat, decSigFigsLon);
        numberOfChars = this.sigfigHashLength[numberOfSigFigs];
      } else if (numberOfChars === null) {
        numberOfChars = 9;
      }
  
      let chars = [], bits = 0, bitsTotal = 0, hashValue = 0;
      let maxLat = 90, minLat = -90, maxLon = 180, minLon = -180, mid;
  
      while (chars.length < numberOfChars) {
        if (bitsTotal % 2 === 0) {
          mid = (maxLon + minLon) / 2;
          if (longitude > mid) {
            hashValue = (hashValue << 1) + 1;
            minLon = mid;
          } else {
            hashValue = (hashValue << 1) + 0;
            maxLon = mid;
          }
        } else {
          mid = (maxLat + minLat) / 2;
          if (latitude > mid) {
            hashValue = (hashValue << 1) + 1;
            minLat = mid;
          } else {
            hashValue = (hashValue << 1) + 0;
            maxLat = mid;
          }
        }
  
        bits++;
        bitsTotal++;
        if (bits === 5) {
          let code = Util.BASE32_CODES[hashValue];
          chars.push(code);
          bits = 0;
          hashValue = 0;
        }
      }
  
      return chars.join('');
    }
  
    decodeBbox(hashString) {
      let isLon = true;
      let maxLat = 90, minLat = -90, maxLon = 180, minLon = -180, mid;
  
      let hashValue = 0;
      for (let i = 0, l = hashString.length; i < l; i++) {
        let code = hashString[i].toLowerCase();
        hashValue = this.base32CodesDic[code];
  
        for (let bits = 4; bits >= 0; bits--) {
          let bit = (hashValue >> bits) & 1;
          if (isLon) {
            mid = (maxLon + minLon) / 2;
            if (bit === 1) {
              minLon = mid;
            } else {
              maxLon = mid;
            }
          } else {
            mid = (maxLat + minLat) / 2;
            if (bit === 1) {
              minLat = mid;
            } else {
              maxLat = mid;
            }
          }
          isLon = !isLon;
        }
      }
      return [minLat, minLon, maxLat, maxLon];
    }
  
    decode(hashString) {
      let bbox = this.decodeBbox(hashString);
      let lat = (bbox[0] + bbox[2]) / 2;
      let lon = (bbox[1] + bbox[3]) / 2;
      let latErr = bbox[2] - lat;
      let lonErr = bbox[3] - lon;
      return {
        'latitude': lat,
        'longitude': lon,
        'latitudeError': latErr,
        'longitudeError': lonErr,
      };
    }
  
    neighbor(hashString, direction) {
      let lonLat = this.decode(hashString);
      let neighborLat = lonLat['latitude'] + direction[0] * lonLat['latitudeError'] * 2;
      let neighborLon = lonLat['longitude'] + direction[1] * lonLat['longitudeError'] * 2;
      return this.encode(neighborLat, neighborLon, hashString.length);
    }
  
    neighbors(hashString) {
        let hashStringLength = hashString.length;
        let lonlat = this.decode(hashString);
        let lat = lonlat['latitude'];
        let lon = lonlat['longitude'];
        let latErr = lonlat['latitudeError'] * 2;
        let lonErr = lonlat['longitudeError'] * 2;
    
        let neighborLat, neighborLon;
    
        function encodeNeighbor(neighborLatDir, neighborLonDir) {
          neighborLat = lat + neighborLatDir * latErr;
          neighborLon = lon + neighborLonDir * lonErr;
          return this.encode(neighborLat, neighborLon, hashStringLength);
        }
    
        let neighborHashList = [
          encodeNeighbor(1, 0),
          encodeNeighbor(1, 1),
          encodeNeighbor(0, 1),
          encodeNeighbor(-1, 1),
          encodeNeighbor(-1, 0),
          encodeNeighbor(-1, -1),
          encodeNeighbor(0, -1),
          encodeNeighbor(1, -1)
        ];
    
        return neighborHashList;
      }
    
      static setPrecision(km) {
        if (km <= 0.00477)
          return 9;
        else if (km <= 0.0382)
          return 8;
        else if (km <= 0.153)
          return 7;
        else if (km <= 1.22)
          return 6;
        else if (km <= 4.89)
          return 5;
        else if (km <= 39.1)
          return 4;
        else if (km <= 156)
          return 3;
        else if (km <= 1250)
          return 2;
        else
          return 1;
      }
    }
    
    const MAX_SUPPORTED_RADIUS = 8587;
    const METERS_PER_DEGREE_LATITUDE = 110574;
    const EARTH_MERIDIONAL_CIRCUMFERENCE = 40007860;
    const EARTH_EQ_RADIUS = 6378137;
    const EARTH_POLAR_RADIUS = 6357852.3;
    const EARTH_E2 = 0.00669447819799;
    const EPSILON = 1e-12;
    
    function distance(location1, location2) {
      return calcDistance(location1.latitude, location1.longitude, location2.latitude, location2.longitude);
    }
    
    function calcDistance(lat1, long1, lat2, long2) {
      const radius = (EARTH_EQ_RADIUS + EARTH_POLAR_RADIUS) / 2;
      let latDelta = _toRadians(lat1 - lat2);
      let lonDelta = _toRadians(long1 - long2);
    
      let a = (Math.sin(latDelta / 2) * Math.sin(latDelta / 2)) +
        (Math.cos(_toRadians(lat1)) *
          Math.cos(_toRadians(lat2)) *
          Math.sin(lonDelta / 2) *
          Math.sin(lonDelta / 2));
      let distance = radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) / 1000;
      return parseFloat(distance.toFixed(3));
    }
    
    function _toRadians(num) {
      return num * (Math.PI / 180.0);
    }