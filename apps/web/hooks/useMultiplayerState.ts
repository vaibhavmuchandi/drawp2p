import { TDBinding, TDShape, TDUser, TldrawApp } from "@tldraw/tldraw";
import { useCallback, useEffect, useRef } from "react";
import {
    YjsStore
} from "../lib/store";

export function useMultiplayerState(roomId: string, store: YjsStore) {
    const tldrawRef = useRef<TldrawApp>();

    const onMount = useCallback(
        (app: TldrawApp) => {
            app.loadRoom(roomId);
            app.pause();
            tldrawRef.current = app;

            app.replacePageContent(
                Object.fromEntries(store.YShapes.entries()),
                Object.fromEntries(store.YBindings.entries()),
                {}
            );
        },
        [roomId]
    );

    const onChangePage = useCallback(
        (
            app: TldrawApp,
            shapes: Record<string, TDShape | undefined>,
            bindings: Record<string, TDBinding | undefined>
        ) => {
            store.UndoManager.stopCapturing();
            store.Doc.transact(() => {
                Object.entries(shapes).forEach(([id, shape]) => {
                    if (!shape) {
                        store.YShapes.delete(id);
                    } else {
                        store.YShapes.set(shape.id, shape);
                    }
                });
                Object.entries(bindings).forEach(([id, binding]) => {
                    if (!binding) {
                        store.YBindings.delete(id);
                    } else {
                        store.YBindings.set(binding.id, binding);
                    }
                });
            });
        },
        []
    );

    const onUndo = useCallback(() => {
        store.UndoManager.undo();
    }, []);

    const onRedo = useCallback(() => {
        store.UndoManager.redo();
    }, []);

    /**
     * Callback to update user's (self) presence
     */
    const onChangePresence = useCallback((app: TldrawApp, user: TDUser) => {
        store.Awareness.setLocalStateField("tdUser", user);
    }, []);

    /**
     * Update app users whenever there is a change in the room users
     */
    useEffect(() => {
        const onChangeAwareness = () => {
            const tldraw = tldrawRef.current;

            if (!tldraw || !tldraw.room) return;

            const others = Array.from(store.Awareness.getStates().entries())
                .filter(([key, _]) => key !== store.Awareness.clientID)
                .map(([_, state]) => state)
                .filter((user) => user.tdUser !== undefined);

            const ids = others.map((other) => other.tdUser.id as string);

            Object.values(tldraw.room.users).forEach((user) => {
                if (user && !ids.includes(user.id) && user.id !== tldraw.room?.userId) {
                    tldraw.removeUser(user.id);
                }
            });

            tldraw.updateUsers(others.map((other) => other.tdUser).filter(Boolean));
        };

        store.Awareness.on("change", onChangeAwareness);

        return () => store.Awareness.off("change", onChangeAwareness);
    }, []);

    useEffect(() => {
        function handleChanges() {
            const tldraw = tldrawRef.current;

            if (!tldraw) return;

            tldraw.replacePageContent(
                Object.fromEntries(store.YBindings.entries()),
                Object.fromEntries(store.YBindings.entries()),
                {}
            );
        }

        store.YShapes.observeDeep(handleChanges);

        return () => store.YShapes.unobserveDeep(handleChanges);
    }, []);

    useEffect(() => {
        function handleDisconnect() {
            store.Provider.disconnect();
        }
        window.addEventListener("beforeunload", handleDisconnect);

        return () => window.removeEventListener("beforeunload", handleDisconnect);
    }, []);

    return {
        onMount,
        onChangePage,
        onUndo,
        onRedo,
        onChangePresence
    };
}