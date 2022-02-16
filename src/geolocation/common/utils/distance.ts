export function haversineDistance(
  a: [number, number],
  b: [number, number],
): number {
  var radius = 6371000;

  const deltaLongitude = ((b[0] - a[0]) * Math.PI) / 180;
  const deltaLatitude = ((b[1] - a[1]) * Math.PI) / 180;
  const halfChordLength =
    Math.cos((a[1] * Math.PI) / 180) *
      Math.cos((a[1] * Math.PI) / 180) *
      Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2) +
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2);

  const angularDistance =
    2 * Math.atan2(Math.sqrt(halfChordLength), Math.sqrt(1 - halfChordLength));

  return radius * angularDistance;
}
