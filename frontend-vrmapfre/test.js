import {createServer} from 'vite'

const server = await createServer()
await server.listen()

console.log('Vite running...')