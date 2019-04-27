module.exports = {
  title: "Paramorphism",

  locales: {
    "/en/": {
      lang: "en-GB",
      title: "Paramorphism Documentation",
      description: "A fast, flexible, and modern obfuscator for Java and Kotlin.",
    },

    "/es/": {
      lang: "es-ES",
      title: "Paramorphism Documentaciones",
      description: "Un ofuscador rápido, flexible y moderno para Java y Kotlin."
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
      },

      "/es/": {
        nav: [
          { text: 'Paramorphism', link: 'https://paramorphism.serenity.enterprises/' }
        ],

        sidebar: [
          "/es/",
        ]
      }
    },

    sidebarDepth: 4
  },

  plugins: {
    'seo': {}
  }
}
