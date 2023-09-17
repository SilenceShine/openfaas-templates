'use strict'

import glob from 'glob-promise';
import path from 'path';
import fs from 'fs';

export const ERROR_LABEL = 'autoroutes';

import fp from 'fastify-plugin'

export default fp(async function (fastify, opts, next) {
    let dir = './function'
    if (!fs.existsSync(dir)) {
        return next(new Error(`${ERROR_LABEL} dir ${dir} does not exists`))
    }
    if (!fs.statSync(dir).isDirectory()) {
        return next(new Error(`${ERROR_LABEL} dir ${dir} must be a directory`))
    }

    let routes = await glob(`${dir}/**/[!.]*.{ts,js}`, {
        ignore: [
            `./function/node_modules/**`,
        ],
    });

    const routesModules = {}

    // glob returns ../../, but windows returns ..\..\
    routes = routes.map((route) => path.normalize(route).replace(/\\/g, '/'))
    dir = path.normalize(dir).replace(/\\/g, '/')

    for (const route of routes) {
        console.log("route: " + route)
        let routeName = route
            .replace(dir, '')
            .replace('.js', '')
            .replace('.ts', '')
            .replace('index', '')
            .split('/')
            .map((part) => part.replace(/{(.+)}/g, ':$1'))
            .join('/')
        routeName = !routeName ? '/' : `${routeName}`
        routesModules[routeName] = (await loadModule(routeName, `../` + route))(fastify)
    }

    for (let [url, module] of Object.entries(routesModules)) {
        for (const [method, options] of Object.entries(module)) {
            if (url.endsWith('/') && url !== '/') {
                url = url.slice(0, -1)
            }
            console.log("url:" + url)
            console.log("method:" + method)
            fastify.route({
                method: method.toUpperCase(), url: url, ...options,
            })
        }
    }
})

async function loadModule(name, path) {
    const module = await import(path);
    if (typeof module === 'function') {
        return module;
    }
    if (typeof module === 'object' && 'default' in module && typeof module.default === 'function') {
        return module.default;
    }
    throw new Error(`${exports.ERROR_LABEL}: invalid route module definition (${name}) ${path}. Must export a function`);
}
