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
    <div className="pointer-events-auto flex items-end justify-end h-1/20 w-full">
      <Link
        href="/abc"
        className="text-center px-4 py-2 cursor-pointer h-full text-white rounded-lg bg-[#2f80ed] w-2/5"
      >
        Start Session
      </Link>
    </div>

  )
})