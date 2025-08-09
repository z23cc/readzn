const BLOG = {
  title: '阅读指南',
  author: '阅读指南',
  email: 'hyperfunc@protonmail.com',
  link: 'https://hub.z23.cc',
  description: '发现和探索全球优质的阅读资源，让知识触手可及。',
  lang: 'zh-CN', // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES']
  timezone: 'Asia/Shanghai', // Your Notion posts' date will be interpreted as this timezone. See https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for all options.
  appearance: 'auto', // ['light', 'dark', 'auto'],
  font: 'sans-serif', // ['sans-serif', 'serif']
  lightBackground: '#ffffff', // use hex value, don't forget '#' e.g #fffefc
  darkBackground: '#18181B', // use hex value, don't forget '#'
  path: '', // leave this empty unless you want to deploy readzn in a folder
  since: 2025, // If leave this empty, current year will be used.
  postsPerPage: 7,
  sortByDate: false,
  showAbout: true,
  showArchive: true,
  autoCollapsedNavBar: false, // The automatically collapsed navigation bar
  ogImageGenerateURL: 'https://hub.z23.cc', // The link to generate OG image, don't end with a slash
  socialLink: 'https://github.com/z23cc/readzn',
  // API加密配置 - 在构建时注入到客户端
  apiEncryption: {
    enabled: process.env.API_ENCRYPTION_ENABLED === 'true', // 从环境变量读取是否启用加密
    algorithm: process.env.API_ENCRYPTION_ALGORITHM || 'aes-256-cbc', // 加密算法
    secretKey: process.env.API_ENCRYPTION_SECRET_KEY || 'default-secret-key-please-change-in-env', // 加密密钥
    iv: process.env.API_ENCRYPTION_IV || 'default-iv-16byte', // 初始化向量
    endpoints: ['https://hub.z23.cc/api', 'https://xiayibendushenme.com/api'] // 需要加密的API端点
  },
  seo: {
    keywords: ['阅读指南', '阅读资源', '书籍推荐', '知识分享', '电子书', '阅读技巧', '书单', '读书笔记', '优质书籍', '全球阅读'],
    googleSiteVerification: '' // Remove the value or replace it with your own google site verification code
  },
  notionPageId: process.env.NOTION_PAGE_ID, // DO NOT CHANGE THIS！！！
  notionAccessToken: process.env.NOTION_ACCESS_TOKEN, // Useful if you prefer not to make your database public
  analytics: {
    provider: 'ga', // Currently we support Google Analytics and Ackee, please fill with 'ga' or 'ackee', leave it empty to disable it.
    ackeeConfig: {
      tracker: '', // e.g 'https://ackee.craigary.net/tracker.js'
      dataAckeeServer: '', // e.g https://ackee.craigary.net , don't end with a slash
      domainId: '' // e.g '0e2257a8-54d4-4847-91a1-0311ea48cc7b'
    },
    gaConfig: {
      measurementId: process.env.GA_MEASUREMENT_ID || '' // Using environment variable GA_MEASUREMENT_ID
    }
  },
  comment: {
    // support provider: gitalk, utterances, cusdis
    provider: '', // leave it empty if you don't need any comment plugin
    gitalkConfig: {
      repo: '', // The repository of store comments
      owner: '',
      admin: [],
      clientID: '',
      clientSecret: '',
      distractionFreeMode: false
    },
    utterancesConfig: {
      repo: ''
    },
    cusdisConfig: {
      appId: '', // data-app-id
      host: 'https://cusdis.com', // data-host, change this if you're using self-hosted version
      scriptSrc: 'https://cusdis.com/js/cusdis.es.js' // change this if you're using self-hosted version
    }
  },
  isProd: process.env.VERCEL_ENV === 'production' // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
}
// export default BLOG
module.exports = BLOG
