module.exports = {
  type: 'react-component',
  babel: {
    plugins: [
      'transform-flow-comments'
    ]
  },
  npm: {
    esModules: true,
    umd: {
      global: 'FormFor',
      externals: {
        react: 'React'
      }
    }
  }
}
