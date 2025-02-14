import type { NextConfig } from "next";
import type { Compiler, Compilation } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config, { isServer, dev }) => {
    // Since Webpack 5 doesn't enable WebAssembly by default, we should do it manually
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // fix warnings for async functions in the browser (https://github.com/vercel/next.js/issues/64792)
    if (!isServer) {
        config.output.environment = { ...config.output.environment, asyncFunction: true };
      }

    if (!dev && isServer) {
        config.output.webassemblyModuleFilename = "chunks/[id].wasm";
        config.plugins.push(new WasmChunksFixPlugin());
    }

    // Polyfill for rdf-canonize-native
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "rdf-canonize-native": false,
    };

    return config;
  },
  output: "standalone",
};

class WasmChunksFixPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap("WasmChunksFixPlugin", (compilation: Compilation) => {
      compilation.hooks.processAssets.tap(
        { name: "WasmChunksFixPlugin" },
        (assets) =>
          Object.entries(assets).forEach(([pathname, source]) => {
            if (!pathname.match(/\.wasm$/)) return;
            compilation.deleteAsset(pathname);

            const name = pathname.split("/")[1];
            const info = compilation.assetsInfo.get(pathname);
            compilation.emitAsset(name, source, info);
          }),
      );
    });
  }
}

export default nextConfig;