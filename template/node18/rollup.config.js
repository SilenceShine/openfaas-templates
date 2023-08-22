import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
    plugins: [
        json(),
        resolve(),
        commonjs()
    ],
    input: "index.js",
    output: {
        file: "main.js",
    }
}; 
