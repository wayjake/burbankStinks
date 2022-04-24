import styled from "styled-components"
import { createContext } from "react"
import useCurrentGeo from "./useCurrentGeo"
import { Routes, Route, Link, Outlet } from "react-router-dom"
import routes from "./routes"
import Map from "./Map"
import DropPage from "./DropsPage"

const StyledLoading = styled.div``

const StyledApp = styled.div`
   @import url("http://fonts.cdnfonts.com/css/open-dyslexic");
   font-family: "Open-Dyslexic", Helvetica, Arial, sans-serif;
   textarea {
      width: 80vw;
      height: 5rem;
      margin-bottom: 1.5rem;
   }
`

export interface GeoCoordinates {
   latitude: undefined | number
   longitude: undefined | number
}

export const UserGeoContext = createContext({
   latitude: undefined,
   longitude: undefined
} as GeoCoordinates)

const AppWrapper = () => {
   const geoCoordinates = useCurrentGeo()

   if (!geoCoordinates.latitude) {
      return <StyledLoading>Waiting for geo coordinates...</StyledLoading>
   }
   return (
      <UserGeoContext.Provider value={geoCoordinates}>
         <Outlet />
      </UserGeoContext.Provider>
   )
}

export default function App() {
   return (
      <StyledApp>
         <Routes>
            <Route path="/" element={<AppWrapper />}>
               <Route path={routes.home} element={<DropPage />} />
               <Route path={routes.map} element={<Map />} />
            </Route>
         </Routes>
      </StyledApp>
   )
}
