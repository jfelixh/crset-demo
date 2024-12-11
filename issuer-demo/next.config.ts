import { NextConfig } from 'next';

const nextConfig: NextConfig = {
    webpack: (config, { isServer }) => {
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true, // Enable async WASM support
        };

        return config;
    },
};

export default nextConfig;