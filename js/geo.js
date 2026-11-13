const RAYON_TERRE_KM = 6371;

const toRad = (deg) => (deg * Math.PI) / 180;

/** Distance orthodromique (haversine) entre deux points { lat, lng }, arrondie au km. */
export function distanceKm(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * RAYON_TERRE_KM * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
}
