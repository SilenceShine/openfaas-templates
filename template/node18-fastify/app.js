'use strict'

import AutoLoad from '@fastify/autoload'
import FastifyPrintRoutes from 'fastify-print-routes';

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async function (fastify, opts) {
  fastify.register(FastifyPrintRoutes, {
    compact: true,
 });
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins')
  })
}
