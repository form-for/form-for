module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    umd: {
      global: "FormFor",
      externals: {
        react: "React"
      }
    }
  }
};
