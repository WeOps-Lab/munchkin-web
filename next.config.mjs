import withAntdLess from 'next-plugin-antd-less';

export default withAntdLess({
  reactStrictMode: false,
  staticPageGenerationTimeout: 300,
  experimental: {
    proxyTimeout: 300_000, // 将超时设置为300秒
  },
  async rewrites() {
    return [
      {
        source: '/reqApi/:path*',
        destination: `${process.env.NEXTAPI_URL}/:path*/`, // 代理到后台服务器
      },
    ];
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
});
