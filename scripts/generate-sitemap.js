// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');
const generateSitemap = require('../utils/sitemap');

const pages = ['/', '/historical', '/about']; // Add your page URLs here

const sitemapContent = generateSitemap(pages);
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
