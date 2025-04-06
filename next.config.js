module.exports = {
  images: {
    domains: ['gravatar.com', 'cdn.jsdelivr.net', 'ionized-belly-695.notion.site']
  },
  eslint: {
    // dirs: ['components', 'layouts', 'lib', 'pages']
  },
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'interest-cohort=()'
          }
        ]
      }
    ]
  },
  transpilePackages: ['dayjs'],
  // 将环境变量注入到客户端构建中
  env: {
    API_ENCRYPTION_ENABLED: process.env.API_ENCRYPTION_ENABLED || 'false',
    API_ENCRYPTION_ALGORITHM: process.env.API_ENCRYPTION_ALGORITHM || 'aes-256-cbc',
    API_ENCRYPTION_SECRET_KEY: process.env.API_ENCRYPTION_SECRET_KEY || 'default-secret-key-please-change-in-env',
    API_ENCRYPTION_IV: process.env.API_ENCRYPTION_IV || 'default-iv-16byte'
  }
  // webpack: (config, { dev, isServer }) => {
  //   // Replace React with Preact only in client production build
  //   if (!dev && !isServer) {
  //     Object.assign(config.resolve.alias, {
  //       react: 'preact/compat',
  //       'react-dom/test-utils': 'preact/test-utils',
  //       'react-dom': 'preact/compat'
  //     })
  //   }
  //   return config
  // }
}
