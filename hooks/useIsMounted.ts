import { useRef, useEffect, MutableRefObject } from 'react'

const useIsMounted = (): boolean => {
    const isMounted: MutableRefObject<boolean> = useRef(false)
    useEffect(() => {
      isMounted.current = true
      return () => {
        isMounted.current = false
      }
    }, [])
    return isMounted.current
}

export default useIsMounted