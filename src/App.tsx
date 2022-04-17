import styled from "styled-components"
import supabase from "./Superbase"
import { v4 as uuidv4 } from "uuid"
import { useEffect, useState } from "react"
import useCurrentGeo from "./useCurrentGeo"

const StyledLoading = styled.div``

const StyledApp = styled.div`
   font-family: Arial, Helvetica, sans-serif;
   textarea {
      width: 80vw;
      height: 5rem;
      margin-bottom: 1.5rem;
   }
`

const OFFSET = 0.1

export default function App() {
   const [message, setMessage] = useState<string | null>()
   const [drops, setDrops] = useState<any[]>([])
   const { latitude, longitude } = useCurrentGeo()

   const getLocalDrops = async () => {
      if (!latitude || !longitude) {
         return
      }
      const { data: drops, error } = await supabase
         .from("drops")
         .select("*")
         // Filters
         .gt("latitude", latitude - OFFSET)
         .lt("latitude", latitude + OFFSET)
         .gt("longitude", longitude - OFFSET)
         .lt("longitude", longitude + OFFSET)
         .neq("message", null)
         .order("created_at", { ascending: false })
         .range(0, 5)
      if (error) {
         console.log(`Error getting drops`)
         console.error(error)
         return
      }
      if (!drops) {
         return
      }
      setDrops(drops)
   }

   useEffect(() => {
      getLocalDrops()
   }, [latitude, longitude])

   const upsertItem = async () => {
      if (!message) return
      const { data, error } = await supabase.from("drops").insert([
         {
            user: uuidv4(),
            latitude, //34.1970229,
            longitude, //-118.3057203,
            message
         }
      ])
      getLocalDrops()
      if (error) console.error(error)
   }

   if (!latitude) {
      return <StyledLoading>Waiting for geo coordinates...</StyledLoading>
   }

   return (
      <StyledApp>
         <h1>Drop it like it's hot!</h1>
         <ul>
            {drops?.map((drop) => (
               <li key={drop.id}>{drop.message}</li>
            ))}
         </ul>
         <textarea
            onChange={(e) => {
               setMessage(e.target.value)
            }}
         />
         <br />
         <button onClick={upsertItem}>INSERT</button>
      </StyledApp>
   )
}
