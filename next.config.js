module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://portojonathan.byethost4.com/api/:path*',
      },
    ]
  },
}