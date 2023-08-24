import { LinguiConfig } from '@lingui/conf'

const config: Partial<LinguiConfig> = {
    locales: ["en", "fr"],
    sourceLocale: "en",
    catalogs: [{
        path: "src/i18n/locales/{locale}/messages",
        include: ["src"]
    }],
    format: "po"
};

export default config;