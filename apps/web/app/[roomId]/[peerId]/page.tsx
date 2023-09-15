"use client"

import { Tldraw, track, useEditor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useYjsStore } from '../../../hooks/useYjsStore'
import { useState, useEffect } from "react"
import { multiaddr } from '@multiformats/multiaddr'
import { useParams } from "next/navigation"


export default function YjsPeer() {
    const [hasDialed, setHasDialed] = useState(false)
    const { roomId, peerId } = useParams()
    const [store, node] = useYjsStore({
        roomId: roomId as string,
    })

    useEffect(() => {
        if (node && !hasDialed) {
            const dial = async () => {
                const conn = await node.dial(multiaddr(`/ip4/127.0.0.1/tcp/57515/ws/p2p/12D3KooWSRkaW3kEk5n6rhwedNsDMPfuSrWLx8JL93WSFQh8v8Gf/p2p-circuit/p2p/${peerId}`))
                console.log(conn)
                setHasDialed(true)
            }
            dial()
        }

    }, [node])

    return (
        <div className="tldraw__editor">
            <Tldraw autoFocus store={store} shareZone={<NameEditor node={node} roomId={roomId} />} />
        </div>
    )
}

const NameEditor = track(({ node, roomId }) => {
    const editor = useEditor()
    const [connectedUsers, setConnectedUsers] = useState(0)
    const [connections, setConnections] = useState<any>([])

    const { color, name } = editor.user

    const getConns = async () => {
        const conns = await node.getConnections()
        setConnectedUsers(conns.length - 1)

        for (let conn of conns) {
            if (!connections.includes(conn.remotePeer.toString()))
                setConnections([...connections, conn.remotePeer.toString()])
        }
    }
    getConns()
    node.addEventListener("peer:connect", async () => {
        const conns = await node.getConnections()
        setConnectedUsers(conns.length - 1)
        for (let conn of conns) {
            if (!connections.includes(conn.remotePeer.toString()))
                setConnections([...connections, conn.remotePeer.toString()])
        }
    })

    return (
        <div className="pointer-events-auto flex flex-col top-0 h-1/6 w-full mb-5">
            <div className='flex flex-row h-2/6 justify-start top-0 w-full'>
                <input
                    value={node.peerId ? node.peerId.toString() : ""}
                    disabled
                    style={{ flex: 1, padding: '0.5rem', height: '100%' }}
                    onChange={(e) => {
                        editor.user.updateUserPreferences({
                            name: e.currentTarget.value,
                        })
                    }}
                />
                <button
                    className="text-center px-4 py-2 cursor-pointer h-full text-white rounded-lg bg-[#2f80ed] w-2/5"
                    onClick={async () => { navigator.clipboard.writeText(`http://localhost:3000/${roomId}/${node.peerId.toString()}`) }}
                >
                    Copy Session Link
                </button>
            </div>
            <div className='flex flex-col items-center justify-center mt-1 space-y-2'>
                <div>Connected users: {connectedUsers}</div>
                <div className="overflow-y-auto h-12 w-full border rounded-md p-2">
                    {
                        connections.map((user, index) => (
                            <div key={index} className="py-1 px-2 hover:bg-gray-200">{user}</div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
})