const isStaticExport = false;

const nextConfig = {
        trailingSlash: true,
        env: {
                BUILD_STATIC_EXPORT: isStaticExport,
                WS_URL: 'wss://10.134.0.147:8089/ws',
        },
        // Añadir configuración del servidor
        server: {
                hostname: '0.0.0.0',
                port: 3000
        },
        // Forzar IPv4
        experimental: {
                forceIPv4: true
        },
        modularizeImports: {
                '@mui/icons-material': { transform: '@mui/icons-material/{{member}}' },
                '@mui/material': { transform: '@mui/material/{{member}}' },
                '@mui/lab': { transform: '@mui/lab/{{member}}' },
        },
        webpack(config, { isServer }) {
                config.module.rules.push({ test: /\.svg$/, use: ['@svgr/webpack'] });

                if (!isServer) {
                        config.devServer = {
                                allowedHosts: 'all',
                                host: '0.0.0.0', // Forzar escucha en todas las interfaces
                                port: 3000,
                                client: {
                                        webSocketURL: 'auto://0.0.0.0:8089/ws',
                                },
                                headers: {
                                        'Access-Control-Allow-Origin': '*',
                                },
                        };
                }
                return config;
        },
};

export default nextConfig;
