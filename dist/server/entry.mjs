import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_C_8AgBQh.mjs';
import { manifest } from './manifest_DzrWo5RJ.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/http-api.astro.mjs');
const _page2 = () => import('./pages/api/ollama.astro.mjs');
const _page3 = () => import('./pages/api/ollama-stream.astro.mjs');
const _page4 = () => import('./pages/api/research.astro.mjs');
const _page5 = () => import('./pages/api/research-stream.astro.mjs');
const _page6 = () => import('./pages/api/search.astro.mjs');
const _page7 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/api/http-api.js", _page1],
    ["src/pages/api/ollama.js", _page2],
    ["src/pages/api/ollama-stream.js", _page3],
    ["src/pages/api/research.js", _page4],
    ["src/pages/api/research-stream.js", _page5],
    ["src/pages/api/search.js", _page6],
    ["src/pages/index.astro", _page7]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/dist/client/",
    "server": "file:///D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
