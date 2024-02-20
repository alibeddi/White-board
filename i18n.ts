import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }: any) => ({
    messages: (await import(`./translation/${locale}.json`)).default,
}));