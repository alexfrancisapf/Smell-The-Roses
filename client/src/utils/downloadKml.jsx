import tokml from "tokml";

/**
 * Converts GeoJSON to KML and triggers a file download
 * 
 * @param {Object} geoJson - The GeoJSON data to convert
 * @param {string} filename - The name of the downloaded file (optional)
 * 
 */
export const downloadKml = (geoJson, filename = "map.kml") => {
    if (!geoJson || typeof geoJson !== "object") {
        throw new Error("Invalid GeoJSON data");
    }
    const kmlString = tokml(geoJson);
    const blob = new Blob([kmlString], { type: "application/vnd.google-earth.kml+xml" });
    const url = URL.createObjectURL(blob);

    // Create and trigger download link
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
};
