import { useState } from 'react'
import supabase from '../api/supabase'
import { DropProps } from '../views/Map'

interface Params {
    offset?: number
    limit?: number
}

interface Query {
    latitude?: number
    longitude?: number
}

type IsLoading = () => Promise<boolean>

interface UseQuery {
    loading: boolean
    isLoading: IsLoading
    getLocalDrops: (query: Query, params: Params) => Promise<void>
    drops: DropProps[]
}

const useQueryDrops = (): UseQuery => {
    const [loading, setLoading] = useState<boolean>(false)
    const [drops, setDrops] = useState<DropProps[]>([])

    const getLocalDrops = async (
        { latitude, longitude }: Query,
        { offset = 0.1, limit = 5 }: Params
    ) => {
        if (!latitude || !longitude) {
            return
        }
        setLoading(true)
        const { data: drops, error } = await supabase
            .from('drops')
            .select('*')
            // Filters
            .gt('latitude', latitude - offset)
            .lt('latitude', latitude + offset)
            .gt('longitude', longitude - offset)
            .lt('longitude', longitude + offset)
            .neq('message', null)
            .order('created_at', { ascending: false })
            .range(0, limit)
        setLoading(false)
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

    const isLoading: IsLoading = async () => {
        return new Promise((resolve) => {
            setLoading((loading) => {
                resolve(loading)
                return loading
            })
        })
    }

    return {
        loading,
        isLoading,
        getLocalDrops,
        drops,
    }
}

export default useQueryDrops
