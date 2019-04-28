module.exports = {
  title: "Paramorphism",

  locales: {
    "/en/": {
      lang: "en-GB",
      title: "Paramorphism Documentation",
      description:
        "A fast, flexible, and modern obfuscator for Java and Kotlin."
    },

    "/es/": {
      lang: "es-ES",
      title: "Paramorphism Documentaciones",
      description:
        "Un ofuscador rรกpido, flexible y moderno para Java y Kotlin."
    },

    "/ru/": {
      lang: "ru-RU",
      title: "Документация Paramorphism",
      description: "Быстрый, гибкий и современный обфускатор для Java и Kotlin."
    }
  },

  themeConfig: {
    locales: {
      "/en/": {
        nav: [
          {
            text: "Paramorphism",
            link: "https://paramorphism.serenity.enterprises/"
          }
        ],

        sidebar: ["/en/changelog", "/en/", "/en/configuration"]
      },

      "/es/": {
        nav: [
          {
            text: "Paramorphism",
            link: "https://paramorphism.serenity.enterprises/"
          }
        ],

        sidebar: ["/es/"]
      }
    },

    "/ru/": {
      nav: [
        {
          text: "Paramorphism",
          link: "https://paramorphism.serenity.enterprises/"
        }
      ],

      sidebar: ["/ru/changelog", "/ru/", "/ru/configuration"]
    },

    sidebarDepth: 4
  },

  plugins: {
    seo: {}
  }
};
