module.exports = {
  // 启用静态导出以支持 GitHub Pages
  output: 'export',
  trailingSlash: true,
  // 明确设置为空，防止 GitHub Actions 自动设置 basePath
  basePath: '',
  assetPrefix: '',
  images: {
    domains: ['gravatar.com', 'cdn.jsdelivr.net', 'gcore.jsdelivr.net', 'ionized-belly-695.notion.site'],
    unoptimized: true // 静态导出需要禁用图片优化
  },
  eslint: {
    // dirs: ['components', 'layouts', 'lib', 'pages']
  },
  // 注意：headers 在静态导出模式下不会生效，但保留以备将来使用
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*{/}?',
  //       headers: [
  //         {
  //           key: 'Permissions-Policy',
  //           value: 'interest-cohort=()'
  //         }
  //       ]
  //     }
  //   ]
  // },
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
