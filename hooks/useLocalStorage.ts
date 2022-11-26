import { useState, useEffect, SetStateAction } from "react";
import useSubscribe from './useSubscribe'
import PubSub from 'pubsub-js'

type SetLocalStorageFunction = (a: string | null) => void;

const useLocalStorage = (key: string): [(string | null), SetLocalStorageFunction] => {
    const [value, setValue] = useState(null)
    const topic = `UPDATE_LOCAL_STORAGE_${key}`
    
    const resetValue = (value: string | null) => {
        if(!value)
            window.localStorage.removeItem(key)
        else
            window.localStorage.setItem(key, value)
            
        setValue(value as SetStateAction<null>)
    }

    useSubscribe(topic, (value) => {
        resetValue(value)
    })

    const reset = (value: string | null) => {
        resetValue(value)

        // publish to other subscribers
        PubSub.publish(topic, value)
    }

    useEffect(() => {
        const value = window.localStorage.getItem(key)
        setValue(value as SetStateAction<null>)
    }, [])
    return [value, reset]
}

export default useLocalStorage;