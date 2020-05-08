module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/simple-weather/'
    : '/',

    pwa: {
      name: 'Simple Weather',
      themeColor: '#4A90E2',
      msTileColor: '#4A90E2',
      manifestOptions: {
        background_color: '#4A90E2'
      }
    }
}