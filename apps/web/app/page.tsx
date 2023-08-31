"use client"
import { useEffect, useState } from "react";
import { Tldraw, useFileSystem } from "@tldraw/tldraw";
import { useUsers } from "y-presence";
import { useMultiplayerState } from "../hooks/useMultiplayerState";
import { YjsStore } from "../lib/store";
import "../styles/globals.css"

export default function Page(): JSX.Element {

  const [store, setStore] = useState<null | YjsStore>(null)

  const createStore = async () => {
    const store = await YjsStore.init()
    setStore(store)
  }

  useEffect(() => {
    createStore()
  }, [])

  function Editor({ roomId }: { roomId: string }) {
    const fileSystemEvents = useFileSystem();
    const { onMount, ...events } = useMultiplayerState(roomId, store as any);

    return (
      <Tldraw
        autofocus
        disableAssets
        showPages={false}
        onMount={onMount}
        {...fileSystemEvents}
        {...events}
      />
    );
  }

  function Info() {
    const users = useUsers(store?.Awareness);

    return (
      <div className="absolute p-md">
        <div className="flex space-between">
          <span>Number of connected users: {users.size}</span>
          <a
            className="color-dodgerblue"
            href="https://twitter.com/drawp2p"
            target="_blank"
            rel="noreferrer"
          >
            @drawp2p
          </a>
        </div>
      </div>
    );
  }
  return (
    <>
      {store
        ?
        <>
          <Info />
          <Editor roomId={store.RoomId} />
        </>
        :
        <>
          <div>Loading....</div>
        </>
      }
    </>
  );
}
