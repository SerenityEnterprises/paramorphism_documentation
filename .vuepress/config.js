module.exports = {
  title: "Paramorphism",

  locales: {
    "/": {
      lang: "en-GB",
      title: "Paramorphism Documentation",
      description: "A fast, flexible, and modern obfuscator for Java and Kotlin."
    },

    /* "/es/": {
      lang: "es-ES",
      title: "Paramorphism Documentaciones",
      description:
        "Un ofuscador rápido, flexible y moderno para Java y Kotlin."
    }, */
    
    "/nl/": {
      lang: "nl-NL",
      title: "Documentatie van Paramorphism",
      // TODO: Description in Dutch (my Dutch is really bad)
    },

    "/ru/": {
      lang: "ru-RU",
      title: "Документация Paramorphism",
      description: "Быстрый, гибкий и современный обфускатор для Java и Kotlin."
    }
  },

  themeConfig: {
    locales: {
      "/": {
        label: "English",

        nav: [
          {
            text: "Paramorphism",
            link: "https://paramorphism.serenity.enterprises/"
          }
        ],

        sidebar: ["/en/changelog", "/en/", "/en/configuration"]
      },

      /* "/es/": {
        label: "Español",

        nav: [
          {
            text: "Paramorphism",
            link: "https://paramorphism.serenity.enterprises/"
          }
        ],

        sidebar: ["/es/"]
      } */

      "/ru/": {
        label: "Русский",

        nav: [
          {
            text: "Paramorphism",
            link: "https://paramorphism.serenity.enterprises/"
          }
        ],

        sidebar: ["/ru/changelog", "/ru/", "/ru/configuration"]
      },
      
      "/nl/": {
        label: "Nederlands",
        
        nav: [
          {
            text: "Paramorphism",
            link: "https://paramorphism.serenity.enterprises/"
          }
        ],
        
        sidebar: ["/nl/changelog", "/nl/", "/nl/configuration"]
      }
    },

    sidebarDepth: 4
  },

  plugins: {
    seo: {}
  }
};
