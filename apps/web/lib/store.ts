import * as Y from "yjs";
import Libp2pProvider from "@drawp2p/y-libp2p";
import { TDBinding, TDShape } from "@tldraw/tldraw";
import { Libp2p } from "libp2p";
import { createPeer } from "./libp2p";

const VERSION = 1;

export class YjsStore {
    private node: Libp2p;
    private doc: Y.Doc;
    private roomId: string = `drawp2p-${VERSION}`;
    private provider: any;
    private awareness: any;
    private yShapes: Y.Map<TDShape>;
    private yBindings: Y.Map<TDBinding>;
    private undoManager: any;

    constructor(libp2p: Libp2p) {
        this.node = libp2p;
        this.doc = new Y.Doc();
        this.provider = new Libp2pProvider(this.doc, this.node as any, this.roomId);
        this.awareness = this.provider.awareness;
        this.yShapes = this.doc.getMap("shapes");
        this.yBindings = this.doc.getMap("bindings");
        this.undoManager = new Y.UndoManager([this.yShapes, this.yBindings]);
    }

    static init = async () => {
        const peer = await createPeer()
        const yjsStore = new YjsStore(peer)
        return yjsStore
    }

    get Node(): Libp2p {
        return this.node;
    }

    get Doc(): Y.Doc {
        return this.doc;
    }

    get RoomId(): string {
        return this.roomId;
    }

    get Provider(): any {
        return this.provider;
    }

    get Awareness(): any {
        return this.awareness;
    }

    get YShapes(): Y.Map<TDShape> {
        return this.yShapes;
    }

    get YBindings(): Y.Map<TDBinding> {
        return this.yBindings;
    }

    get UndoManager(): any {
        return this.undoManager;
    }
}
