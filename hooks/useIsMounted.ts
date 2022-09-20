import { useRef, useEffect, MutableRefObject } from 'react'

const useIsMounted = (): MutableRefObject<boolean> => {
    const isMounted: MutableRefObject<boolean> = useRef(false)
    useEffect(() => {
      isMounted.current = true
      return () => {
        isMounted.current = false
      }
    }, [])
    return isMounted
}

export default useIsMounted