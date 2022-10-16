import { useState, useEffect, SetStateAction } from "react";

type SetLocalStorageFunction = (a: string | null) => void;

const useLocalStorage = (key: string): [(string | null), SetLocalStorageFunction] => {
    const [value, setValue] = useState(null)

    const resetValue = (value: string | null) => {
        if(!value)
            window.localStorage.removeItem(key)
        else
            window.localStorage.setItem(key, value)
            
        setValue(value as SetStateAction<null>)
    }

    useEffect(() => {
        const value = window.localStorage.getItem(key)
        setValue(value as SetStateAction<null>)
    }, [])
    return [value, resetValue]
}

export default useLocalStorage;