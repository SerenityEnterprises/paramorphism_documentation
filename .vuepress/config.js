const glob = require('glob')

module.exports = {
    title: "Paramorphism",
    description: "A fast, flexible, and modern obfuscator for Java and Kotlin.",

    themeConfig: {
        nav: [
            { text: 'Paramorphism', link: 'https://paramorphism.serenity.enterprises/' }
        ],

        sidebar: [
            '/changelog/',

            '/',
            '/docs/configuration'
        ],
        sidebarDepth: 4
    },

    plugins: {
        'seo': {}
    }
}
