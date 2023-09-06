import { useEffect, useState } from 'react'
import { GeoCoordinates } from '../App'

const useCurrentGeo = () => {
    const [coords, setCoords] = useState<GeoCoordinates>({
        latitude: undefined,
        longitude: undefined,
    })

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setCoords({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            },
            () => {
                console.error('Unable to retrieve your location')
            }
        )
        return () => {
            navigator.geolocation.clearWatch(watchId)
        }
    }, [])

    return coords
}

export default useCurrentGeo
