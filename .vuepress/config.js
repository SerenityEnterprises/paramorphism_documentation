module.exports = {
  title: "Paramorphism",

  locales: {
    "/en/": {
      lang: "en-GB",
      title: "Paramorphism Docs",
      description: "A fast, flexible, and modern obfuscator for Java and Kotlin.",
    }
  },

  themeConfig: {
    locales: {
      "/en/": {
        nav: [
          { text: 'Paramorphism', link: 'https://paramorphism.serenity.enterprises/' }
        ],

        sidebar: [
          "/en/changelog",
          "/en/",
          "/en/configuration"
        ]
      }
    },

    sidebarDepth: 4
  },

  plugins: {
    'seo': {}
  }
}
