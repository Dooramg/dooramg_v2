export const useQuery = () => {
  const opiAroundQuery = <T extends string, D extends number>(queryName: T, dataType: T, x: D, y: D, radius: D, sort: D, prodcd: T) => {
    const query = queryName.concat(`?code=${useRuntimeConfig().public.opiKey}`)

    const dataTypeQuery = dataType ? '&out='.concat(dataType) : ''
    const xQuery = x ? '&x='.concat(String(x)) : ''
    const yQuery = y ? '&y='.concat(String(y)) : ''
    const radiusQuery = radius ? '&radius='.concat(String(radius)) : ''
    const sortQuery = sort ? '&sort='.concat(String(sort)) : ''
    const prodcdQuery = prodcd ? '&prodcd='.concat(prodcd) : ''

    return query.concat(dataTypeQuery, xQuery, yQuery, radiusQuery, sortQuery, prodcdQuery)
  }
  const skGeoQuery = <T extends string, D extends number>(queryName: T, latitude: D, longitude: D, fromCoord: T, toCoord: T) => {
    const query = queryName

    const latitudeQuery = latitude ? '&lat='.concat(String(latitude)) : ''
    const longitudeQuery = longitude ? '&lon='.concat(String(longitude)) : ''
    const fromCoordQuery = fromCoord ? '&fromCoord='.concat(fromCoord) : ''
    const toCoordQuery = toCoord ? '&toCoord='.concat(toCoord) : ''

    return query.concat(latitudeQuery, longitudeQuery, fromCoordQuery, toCoordQuery)
  }
  return {
    opiAroundQuery,
    skGeoQuery,
  }
}
