// * Compute distance between two coordinates using the Haversine formula
export const getDistance = (coords1, coords2) => {
    const [lat1, lon1] = coords1;
    const [lat2, lon2] = coords2;

    const toRadians = (deg) => deg * (Math.PI / 180);
    const radLat1 = toRadians(lat1);
    const radLon1 = toRadians(lon1);
    const radLat2 = toRadians(lat2);
    const radLon2 = toRadians(lon2);

    const dlat = radLat2 - radLat1;
    const dlon = radLon2 - radLon1;
    const a =
        Math.sin(dlat / 2) ** 2 +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const R = 6371;
    return R * c;
};