'use strict'

export default (fastifyInstance) => ({
    get: {
        handler: (request, reply) => {
            reply.send(`hello world`)
        },
        config: {
            description: 'Title'
        }
    },
})
