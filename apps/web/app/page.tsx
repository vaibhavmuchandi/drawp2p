"use client"

import { Tldraw, track } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import Link from "next/link"


export default function YjsExample() {

  return (
    <div className="tldraw__editor">
      <Tldraw autoFocus shareZone={<NameEditor />} />
    </div>
  )
}

const NameEditor = track(() => {

  return (
    <div style={{ pointerEvents: 'all', display: 'flex', alignItems: 'center', height: '5%', gap: '10px', flexDirection: "row" }}>
      <Link style={{ padding: '0.5rem 1rem', cursor: 'pointer', height: '100%' }} href="/abc">Start Session</Link>
    </div>

  )
})