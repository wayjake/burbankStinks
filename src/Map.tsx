import { useContext, useEffect, useState } from "react"
import useQueryDrops from "./useQueryDrops"
import { UserGeoContext } from "./App"
import useWindowDimensions from "./useWindowDimensions"
import routes from "./routes"
import { Link } from "react-router-dom"

const { innerWidth: width, innerHeight: height } = window

const Message = ({ message }: { message: string }) => {
   return <div style={{ backgroundColor: "white", top: 0 }}>{message}</div>
}

const DropCell = ({ drop, center }: any) => {
   const { height, width } = useWindowDimensions()
   const [entered, setEntered] = useState(false)
   //normalize diff between center and current drop
   const x = (drop.longitude - center.longitude) * 14000
   const y = (drop.latitude - center.latitude) * 15000
   var randomColor = Math.floor(Math.random() * 16777215).toString(16)

   return (
      <>
         <div
            onClick={() => setEntered((entered) => !entered)}
            onMouseEnter={() => setEntered(true)}
            onMouseLeave={() => setEntered(false)}
            style={{
               position: "absolute",
               padding: 20,
               left: width / 2 + x,
               top: height / 2 + y,
               backgroundColor: `#${randomColor}`,
               borderRadius: "50%"
            }}
         ></div>
         {entered && <Message message={drop.message} />}
      </>
   )
}

export default function Map() {
   const { drops, getLocalDrops, isLoading } = useQueryDrops()
   const { latitude, longitude } = useContext(UserGeoContext) //this is initial center

   useEffect(() => {
      getLocalDrops({ latitude, longitude }, { offset: 0.1, limit: 50 })
   }, [latitude, longitude])

   const handleKeyDown = async (event: KeyboardEvent) => {
      if (await isLoading()) {
         return
      }
      switch (event.key) {
         case "r": // r
            getLocalDrops({ latitude, longitude }, { offset: 0.1, limit: 50 })
            break
         default:
            break
      }
   }

   useEffect(() => {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
   }, [])

   return (
      <>
         <Link to={routes.home}>Add Stink</Link>
         <DropCell
            key={"center"}
            drop={{ latitude, longitude, message: "i am the center" }}
            center={{ latitude, longitude }}
         />
         {drops?.map((drop) => (
            <DropCell key={drop.id} drop={drop} center={{ latitude, longitude }} />
         ))}
      </>
   )
}
