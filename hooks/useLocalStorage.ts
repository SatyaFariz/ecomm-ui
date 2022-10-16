import { useState, useEffect, SetStateAction } from "react";

const useLocalStorage = (key: string): [(string | null), Function] => {
    const [value, setValue] = useState(null)

    useEffect(() => {
        const value = window.localStorage.getItem(key)
        setValue(value as SetStateAction<null>)
    }, [])
    return [value, setValue]
}

export default useLocalStorage;