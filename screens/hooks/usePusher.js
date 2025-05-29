import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'
import { BASE_URL } from '../../apis/config'

const usePusher = () => {
  const token = useSelector((state) => state.auth.token)
  const roomId = useSelector((state) => state.friends.openChatRoomId)

  const [pusherClient, setPusherClient] = useState(null)

  useEffect(() => {
    if (token === null && pusherClient) {
      setPusherClient(null)
    }
    if (pusherClient?.connection?.state === 'disconnected') {
      setPusherClient(null)
    }
    if (token && !(pusherClient)) {
      setPusherClient(
        new Pusher('3a6e8a2b4fa47e629a65', {
          cluster: 'ap4',
          authEndpoint: `${BASE_URL}/broadcasting/auth`,
          auth: { headers: { Authorization: `Bearer ${token}` } }
        })
      )
    }
    return () => {}
  }, [token, roomId])

  return { pusherClient }
}
export default usePusher
