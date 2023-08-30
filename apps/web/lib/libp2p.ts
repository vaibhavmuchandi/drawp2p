import { webRTC } from "@libp2p/webrtc"
import { webSockets } from "@libp2p/websockets"
import * as filters from "@libp2p/websockets/filters"
import { mplex } from "@libp2p/mplex"
import { createLibp2p } from "libp2p"
import { circuitRelayTransport } from 'libp2p/circuit-relay'
import { noise } from "@chainsafe/libp2p-noise"
import { gossipsub } from "@chainsafe/libp2p-gossipsub"
import { identifyService } from 'libp2p/identify'

export const createPeer = async () => {
    const node = await createLibp2p({
        addresses: {
            listen: [
                '/webrtc'
            ]
        },
        transports: [
            webSockets({
                filter: filters.all,
            }),
            webRTC(),
            circuitRelayTransport({
                discoverRelays: 1,
            }),
        ],
        connectionEncryption: [noise()],
        streamMuxers: [mplex()],
        connectionGater: {
            denyDialMultiaddr: () => {
                // by default we refuse to dial local addresses from the browser since they
                // are usually sent by remote peers broadcasting undialable multiaddrs but
                // here we are explicitly connecting to a local node so do not deny dialing
                // any discovered address
                return false
            }
        },
        services: {
            identify: identifyService(),
            pubsub: gossipsub({ allowPublishToZeroPeers: true })
        }
    })
    return node
}

