// generate-env.js
const fs = require('fs');

const required = ['TMDB_API_KEY'];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('❌ Missing environment variables:', missing.join(', '));
  process.exit(1);
}

const content = `export const environment = {
  production: true,
  firebase: {
    tmdbApiKey: '${process.env.TMDB_API_KEY}'
    tmdbBaseUrl: 'https://api.themoviedb.org/3',
    tmdbImageBaseUrl: 'https://image.tmdb.org/t/p/',
  }
};
`;

fs.writeFileSync('./src/environments/environment.ts', content);
fs.writeFileSync('./src/environments/environment.prod.ts', content);
console.log('✅ environment.ts generated successfully');
console.log('Written content:', fs.readFileSync('./src/environments/environment.prod.ts', 'utf8'));
