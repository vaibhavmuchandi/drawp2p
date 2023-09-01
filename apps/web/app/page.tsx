"use client"

import { Tldraw, track, useEditor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useYjsStore } from '../hooks/useYjsStore'
import { useState, useEffect } from "react"


export default function YjsExample() {
  const store = useYjsStore({
    roomId: 'example6',
  })
  return (
    <div className="tldraw__editor">
      <Tldraw autoFocus store={store} shareZone={<NameEditor />} />
    </div>
  )
}

const NameEditor = track(() => {
  const editor = useEditor()
  const [addr, setAddr] = useState("")

  const { color, name } = editor.user

  return (
    <div style={{ pointerEvents: 'all', display: 'flex' }}>
      <input
        value={addr}
        placeholder='Multiaddr'
        onChange={(e) => {
          setAddr(e.target.value)
        }}
      />
      <button onClick={() => console.log("connect")}>Connect</button>
      <input
        type="color"
        value={color}
        onChange={(e) => {
          editor.user.updateUserPreferences({
            color: e.currentTarget.value,
          })
        }}
      />
      <input
        value={name}
        onChange={(e) => {
          editor.user.updateUserPreferences({
            name: e.currentTarget.value,
          })
        }}
      />
    </div>
  )
})