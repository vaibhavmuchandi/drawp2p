import { mplex } from "@libp2p/mplex"
import { createLibp2p } from "libp2p"
import { noise } from "@chainsafe/libp2p-noise"
import { circuitRelayServer } from 'libp2p/circuit-relay'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { identifyService } from 'libp2p/identify'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import fs from "fs"
import path from "path"
import { createFromPrivKey } from "@libp2p/peer-id-factory"
import { keys } from "@libp2p/crypto";

const __dirname = path.resolve()

const main = async () => {
    const keyPairJson = JSON.parse(
        fs.readFileSync(path.join(__dirname, "keypair.json"), "utf-8")
    );
    const keyPair = await keys.importKey(keyPairJson.key, "");
    const peerId = await createFromPrivKey(keyPair);
    const server = await createLibp2p({
        peerId: peerId,
        addresses: {
            listen: ['/ip4/127.0.0.1/tcp/41000/ws']
        },
        transports: [
            webSockets({
                filter: filters.all
            }),
        ],
        connectionEncryption: [noise()],
        streamMuxers: [mplex()],
        services: {
            identify: identifyService(),
            relay: circuitRelayServer({
                reservations: {
                    applyDefaultLimit: true,
                    defaultDurationLimit: 180 * 60 * 1000,
                    defaultDataLimit: BigInt(1 << 30),
                    maxReservations: 32,
                }
            }),
            pubsub: gossipsub({ allowPublishToZeroPeers: true }),
        }
    })

    console.log("p2p addr: ", server.getMultiaddrs().map((ma) => ma.toString()))
}

main()
