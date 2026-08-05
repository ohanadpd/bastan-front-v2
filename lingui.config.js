/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
    locales: ['fa', 'en', 'ar', 'pseudo'],
    pseudoLocale: 'pseudo',
    sourceLocale: 'fa',
    fallbackLocales: {
        default: 'fa'
    },
    catalogs: [
        {
            path: 'src/locales/{locale}',
            include: ['src/']
        }
    ]
}