// utils/sitemap.ts
const xmlbuilder = require("xmlbuilder");
// import { create } from "xmlbuilder";

const generateSitemap = (urls) => {
  const root = xmlbuilder.create({ version: '1.0', encoding: 'UTF-8' })
    .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

  urls.forEach((url) => {
    root.ele('url').ele('loc').txt(url);
  });

  return root.end({pretty: true});
};

module.exports = generateSitemap;
