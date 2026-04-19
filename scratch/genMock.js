const fs = require('fs');
const paths = [
  'C:\\Users\\tlhab\\.gemini\\antigravity\\brain\\d44845b7-96a2-4c44-b391-749798c0d930\\mock_user_1_portrait_1776634367677.png',
  'C:\\Users\\tlhab\\.gemini\\antigravity\\brain\\d44845b7-96a2-4c44-b391-749798c0d930\\mock_user_2_portrait_1776634436563.png',
  'C:\\Users\\tlhab\\.gemini\\antigravity\\brain\\d44845b7-96a2-4c44-b391-749798c0d930\\mock_user_3_portrait_1776634746540.png'
];

let content = 'export const MOCK_IMAGES = [\n';
paths.forEach((p, i) => {
  if (fs.existsSync(p)) {
    const b64 = fs.readFileSync(p).toString('base64');
    content += `  "data:image/png;base64,${b64}",\n`;
  }
});
content += '];\n';

if (!fs.existsSync('utils')) fs.mkdirSync('utils');
fs.writeFileSync('utils/mockData.ts', content);
console.log('Mock data generated in utils/mockData.ts');
