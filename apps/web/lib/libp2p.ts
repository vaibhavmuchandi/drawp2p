import { webSockets } from "@libp2p/websockets"
import * as filters from "@libp2p/websockets/filters"
import { mplex } from "@libp2p/mplex"
import { createLibp2p } from "libp2p"
import { circuitRelayTransport } from 'libp2p/circuit-relay'
import { noise } from "@chainsafe/libp2p-noise"
import { gossipsub } from "@chainsafe/libp2p-gossipsub"
import { identifyService } from 'libp2p/identify'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'
import { yamux } from "@chainsafe/libp2p-yamux"
import { bootstrap } from "@libp2p/bootstrap"
import { kadDHT } from "@libp2p/kad-dht"


export const createPeer = async () => {
    const node = await createLibp2p({
        transports: [webSockets({
            filter: filters.all,
        }),
        circuitRelayTransport({ discoverRelays: 2 })],
        connectionEncryption: [noise()],
        streamMuxers: [yamux(), mplex()],
        peerDiscovery: [
            bootstrap({
                list: ["/ip4/20.40.52.207/tcp/41000/ws/p2p/12D3KooWSRkaW3kEk5n6rhwedNsDMPfuSrWLx8JL93WSFQh8v8Gf"]
            }),
            pubsubPeerDiscovery()
        ],
        services: {
            pubsub: gossipsub({ allowPublishToZeroPeers: true }),
            identify: identifyService(),
            dht: kadDHT()
        },
        connectionGater: {
            denyDialMultiaddr: () => {
                // by default we refuse to dial local addresses from the browser since they
                // are usually sent by remote peers broadcasting undialable multiaddrs but
                // here we are explicitly connecting to a local node so do not deny dialing
                // any discovered address
                return false
            }
        },
    })
    return node
}
