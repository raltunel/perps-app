module.exports = {
  plugins: {
    'postcss-custom-media': {
      preserve: false,
      customMedia: {
        '--tablet-portrait': '(min-width: 600px) and (max-width: 1366px) and (orientation: portrait)',
        '--tablet-landscape': '(min-width: 600px) and (max-width: 1366px) and (orientation: landscape)',
        '--mobile-portrait': '(max-width: 599px) and (orientation: portrait)',
        '--mobile-landscape': '(max-width: 599px) and (orientation: landscape)',
        '--desktop': '(min-width: 1367px)',
        '--desktop-large': '(min-width: 1920px)'
      }
    }
  }
}