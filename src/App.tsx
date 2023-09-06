import { createContext } from 'react'
import useCurrentGeo from './hooks/useCurrentGeo'
import { Routes, Route, Outlet } from 'react-router-dom'
import routes from './routes'
import Map from './views/Map'
import DropPage from './views/Drops'

export interface GeoCoordinates {
    latitude?: number
    longitude?: number
}

export const UserGeoContext = createContext<GeoCoordinates>({
    latitude: undefined,
    longitude: undefined,
})

const AppWrapper = () => {
    const geoCoordinates = useCurrentGeo()

    if (!geoCoordinates.latitude) {
        return <div className="loading">Waiting for geo coordinates...</div>
    }
    return (
        <UserGeoContext.Provider value={geoCoordinates}>
            <Outlet />
        </UserGeoContext.Provider>
    )
}

export default function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<AppWrapper />}>
                    <Route path={routes.home} element={<DropPage />} />
                    <Route path={routes.map} element={<Map />} />
                </Route>
            </Routes>
        </div>
    )
}
