import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import routes from '../routes'
import supabase from '../api/supabase'
import useQueryDrops from '../hooks/useQueryDrops'
import { v4 as uuidv4 } from 'uuid'
import { UserGeoContext } from '../App'

const DropPage = () => {
    const [message, setMessage] = useState<string | undefined>()
    const { latitude, longitude } = useContext(UserGeoContext)
    const { getLocalDrops, drops } = useQueryDrops()

    useEffect(() => {
        const listener = () => {
            getLocalDrops({ latitude, longitude }, {})
        }
        window.addEventListener('focus', listener, false)
        return () => {
            window.removeEventListener('focus', listener)
        }
    }, [])

    useEffect(() => {
        getLocalDrops({ latitude, longitude }, {})
    }, [latitude, longitude])

    const upsertItem = async () => {
        if (!message) return
        const oldMessageValue = message
        setMessage('')
        const { error } = await supabase.from('drops').insert([
            {
                user: uuidv4(),
                latitude, //34.1970229,
                longitude, //-118.3057203,
                message,
            },
        ])
        if (error) {
            setMessage(oldMessageValue)
            console.error(error)
            return
        }
        getLocalDrops({ latitude, longitude }, {})
    }

    return (
        <>
            <h2>Drop it like it's hot!</h2>
            <ul>
                {drops?.map((drop) => (
                    <li key={drop.id}>{drop.message}</li>
                ))}
            </ul>
            <textarea
                value={message}
                onChange={(e) => {
                    setMessage(e.target.value)
                }}
            />
            <br />
            <button onClick={upsertItem}>INSERT</button>
            <br />
            <Link to={routes.map}>View Map</Link>
        </>
    )
}

export default DropPage
