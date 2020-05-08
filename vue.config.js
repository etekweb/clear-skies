module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/clear-skies/'
    : '/',

    pwa: {
      name: 'clearSkies',
      themeColor: '#4A90E2',
      msTileColor: '#4A90E2',
      manifestOptions: {
        background_color: '#4A90E2'
      },
      workboxOptions: {
        skipWaiting: true
      }
    },

    chainWebpack: config => {
      config
      .plugin('html')
      .tap(args => {
        args[0].title = 'clearSkies'
        return args
      })
    }
}