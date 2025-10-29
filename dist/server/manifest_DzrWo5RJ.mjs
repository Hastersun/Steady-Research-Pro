import { o as decodeKey } from './chunks/astro/server_iI-_1fr6.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_Da1EhJsM.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/","cacheDir":"file:///D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/node_modules/.astro/","outDir":"file:///D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/dist/","srcDir":"file:///D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/src/","publicDir":"file:///D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/public/","buildClientDir":"file:///D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/dist/client/","buildServerDir":"file:///D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/dist/server/","adapterName":"@astrojs/node","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/node.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/http-api","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/http-api\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"http-api","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/http-api.js","pathname":"/api/http-api","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/ollama","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/ollama\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"ollama","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/ollama.js","pathname":"/api/ollama","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/ollama-stream","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/ollama-stream\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"ollama-stream","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/ollama-stream.js","pathname":"/api/ollama-stream","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/research","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/research\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"research","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/research.js","pathname":"/api/research","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/research-stream","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/research-stream\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"research-stream","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/research-stream.js","pathname":"/api/research-stream","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/search","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/search\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"search","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/search.js","pathname":"/api/search","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.BGNma-E-.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/api/http-api@_@js":"pages/api/http-api.astro.mjs","\u0000@astro-page:src/pages/api/ollama@_@js":"pages/api/ollama.astro.mjs","\u0000@astro-page:src/pages/api/ollama-stream@_@js":"pages/api/ollama-stream.astro.mjs","\u0000@astro-page:src/pages/api/research@_@js":"pages/api/research.astro.mjs","\u0000@astro-page:src/pages/api/research-stream@_@js":"pages/api/research-stream.astro.mjs","\u0000@astro-page:src/pages/api/search@_@js":"pages/api/search.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/node@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_DzrWo5RJ.mjs","D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/node_modules/unstorage/drivers/fs-lite.mjs":"chunks/fs-lite_COtHaKzy.mjs","D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BnG_2kGZ.mjs","D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.CL39GNO2.js","D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/src/pages/index.astro?astro&type=script&index=1&lang.ts":"_astro/index.astro_astro_type_script_index_1_lang.DFqDX6A7.js","D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/src/components/ResearchAgentUI.astro?astro&type=script&index=0&lang.ts":"_astro/ResearchAgentUI.astro_astro_type_script_index_0_lang.B3hhuHfb.js","D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/src/components/AIServiceSelector.astro?astro&type=script&index=0&lang.ts":"_astro/AIServiceSelector.astro_astro_type_script_index_0_lang.ngyeXySN.js","D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/src/components/agent/SidePanel.astro?astro&type=script&index=0&lang.ts":"_astro/SidePanel.astro_astro_type_script_index_0_lang.CVLY-7wM.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/src/pages/index.astro?astro&type=script&index=0&lang.ts","const n=t=>{document.querySelectorAll(\".page-panel\").forEach(e=>{e.classList.toggle(\"hidden\",e.dataset.page!==t)}),document.querySelectorAll(\".sidebar-link\").forEach(e=>{const c=e.dataset.target===t;e.dataset.active=c?\"true\":\"false\"})},s=()=>{document.querySelectorAll(\".sidebar-link\").forEach(a=>{a.addEventListener(\"click\",()=>n(a.dataset.target))}),n(\"research\")};document.readyState===\"loading\"?document.addEventListener(\"DOMContentLoaded\",s):s();"],["D:/Onlinebiz/zerox/gridsfeed/backs/srp/Steady-Research-Pro-main/src/pages/index.astro?astro&type=script&index=1&lang.ts","(()=>{try{const e=localStorage.getItem(\"steady-research-pro:locale\");e&&(document.documentElement.setAttribute(\"lang\",e),document.documentElement.dataset.locale=e)}catch(e){console.warn(\"[i18n] unable to preload locale\",e)}})();"]],"assets":["/_astro/i18n.DYlRO84j.js","/_astro/index.BGNma-E-.css","/_astro/AIServiceSelector.astro_astro_type_script_index_0_lang.ngyeXySN.js","/_astro/ResearchAgentUI.astro_astro_type_script_index_0_lang.B3hhuHfb.js","/_astro/SidePanel.astro_astro_type_script_index_0_lang.CVLY-7wM.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"QL+hne0ufU3lAsNBitcBoN+a05IJUHZXhaJgN3imejU=","sessionConfig":{"driver":"fs-lite","options":{"base":"D:\\Onlinebiz\\zerox\\gridsfeed\\backs\\srp\\Steady-Research-Pro-main\\node_modules\\.astro\\sessions"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/fs-lite_COtHaKzy.mjs');

export { manifest };
