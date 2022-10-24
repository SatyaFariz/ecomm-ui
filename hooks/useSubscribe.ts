import { useRef, useEffect } from 'react'
import PubSub from 'pubsub-js'

const useSubscribe = (topic: string, callback: (data: any) => void): void => {
    const subscription = useRef()

    const handler = (_: string, data: any) => {
        callback(data)
    }

    useEffect(() => {
      subscription.current = PubSub.subscribe(topic, handler);
      return () => {
          PubSub.unsubscribe(subscription.current)
      }
    }, [])
}

export default useSubscribe