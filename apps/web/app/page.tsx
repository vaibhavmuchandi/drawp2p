"use client"

import { Tldraw, track } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import Link from "next/link"
import { generateRoomId } from '../lib/roomId'
import { useState, useEffect } from 'react'


export default function Landing() {

  return (
    <div className="tldraw__editor">
      <Tldraw autoFocus shareZone={<NameEditor />} topZone={<CustomTopZone />} />
    </div>
  )
}

const NameEditor = track(() => {
  const [roomId, setRoomId] = useState<string>('');

  useEffect(() => {
    const id = generateRoomId();
    setRoomId(id);
  }, []);
  return (
    <div className="pointer-events-auto flex items-end justify-end h-1/20 w-full">
      <Link
        href={`/${roomId}`}
        className="text-center px-4 py-2 cursor-pointer h-full text-white rounded-lg bg-[#2f80ed] w-2/5"
      >
        Start Session
      </Link>
    </div>

  )
})

function CustomTopZone() {
  return (
    <div
      style={{
        width: '100%',
        textAlign: 'center',
      }}
    >
      <p>Draw without boundaries. Welcome to DrawP2P</p>
    </div>
  )
}