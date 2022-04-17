import { useEffect, useState } from "react"

const useCurrentGeo = () => {
   const [latitude, setLatitude] = useState<number | null>(null)
   const [longitude, setLongitude] = useState<number | null>(null)

   useEffect(() => {
      const watchId = navigator.geolocation.watchPosition(
         (position) => {
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
         },
         () => {
            console.error("Unable to retrieve your location")
         }
      )
      return () => {
         navigator.geolocation.clearWatch(watchId)
      }
   }, [])

   return { latitude, longitude }
}

export default useCurrentGeo
