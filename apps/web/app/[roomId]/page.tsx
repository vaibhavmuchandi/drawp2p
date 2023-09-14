"use client"

import { Tldraw, track, useEditor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useYjsStore } from '../../hooks/useYjsStore'
import { useState, useEffect } from "react"
import { multiaddr } from '@multiformats/multiaddr'
import { useParams } from "next/navigation"


export default function YjsExample() {
    const { roomId } = useParams()
    const [store, node] = useYjsStore({
        roomId: roomId as string,
    })

    return (
        <div className="tldraw__editor">
            <Tldraw autoFocus store={store} shareZone={<NameEditor node={node} roomId={roomId} />} />
        </div>
    )
}

const NameEditor = track(({ node, roomId }) => {
    const editor = useEditor()
    const [addr, setAddr] = useState("")
    const [connectedUsers, setConnectedUsers] = useState(node.getConnections().length)

    const { color, name } = editor.user


    return (
        <div style={{ pointerEvents: 'all', display: 'flex', alignItems: 'center', height: '5%', gap: '10px', flexDirection: "row" }}>
            <input
                type="color"
                value={color}
                style={{ height: '100%', width: '30px' }}
                onChange={(e) => {
                    editor.user.updateUserPreferences({
                        color: e.currentTarget.value,
                    })
                }}
            />
            <input
                value={node.peerId ? node.peerId.toString() : ""}
                style={{ flex: 1, padding: '0.5rem', height: '100%' }}
                onChange={(e) => {
                    editor.user.updateUserPreferences({
                        name: e.currentTarget.value,
                    })
                }}
            />
            <p>Connected Users: {connectedUsers}</p>
            <button
                style={{ padding: '0.5rem 1rem', cursor: 'pointer', height: '100%' }}
                onClick={async () => { navigator.clipboard.writeText(`http://localhost:3000/${roomId}/${node.peerId.toString()}`) }}
            >
                Copy Session Link
            </button>
        </div>

    )
})