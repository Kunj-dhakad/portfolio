import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
mkdirSync('public/previews', { recursive: true });
function text(x, y, value, size = 14, color = '#b9b2cf', weight = 400) {
  return `<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" fill="${color}" font-weight="${weight}">${value}</text>`;
}
function rect(x, y, w, h, fill = '#1b172b', r = 8, stroke = '#332944') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
}
function base(title, subtitle, body, accent = '#a58aeb') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560" viewBox="0 0 900 560"><rect width="900" height="560" rx="12" fill="#11101c"/>${rect(0, 0, 900, 35, '#1c1729', 0)}<circle cx="17" cy="18" r="4" fill="#ba758a"/><circle cx="32" cy="18" r="4" fill="#b9a06a"/><circle cx="47" cy="18" r="4" fill="#7ca48b"/>${text(360, 22, `${title.toLowerCase()} / workspace`, 10, '#8a7c9f')}${rect(0, 35, 155, 525, '#171222', 0)}${text(24, 82, title, 24, '#eee8f7', 700)}${['Overview', 'Projects', 'Analytics', 'Messages', 'Settings'].map((v, i) => `${i === 0 ? rect(12, 113 + i * 43, 131, 32, '#3a285b', 6, '#3a285b') : ''}<rect x="26" y="${124 + i * 43}" width="10" height="10" rx="2" fill="${i === 0 ? accent : '#655871'}"/>${text(45, 133 + i * 43, v, 12, i === 0 ? '#ded1ff' : '#9d8bad')}`).join('')}${text(22, 512, 'YOUR WORKSPACE', 9, '#70617e')}${text(22, 534, 'Made for focused work.', 9, '#8d7c9d')}${text(190, 75, 'WORKSPACE OVERVIEW', 9, accent, 500)}${text(190, 113, subtitle, 27, '#ede7f6', 600)}${text(190, 139, 'A little clarity for your next great idea.', 12, '#9386a5')}${body}${text(660, 548, 'ILLUSTRATIVE SAMPLE DATA', 9, '#70647e')}</svg>`;
}
const stats = [
  ['Active projects', '12', 'A clearer view of your work'],
  ['Tasks completed', '84', 'Your week, moving forward'],
  ['Focus time', '32h', 'Time for what matters'],
]
  .map(
    ([label, value, note], i) =>
      `${rect(190 + i * 223, 170, 205, 108)}${text(208 + i * 223, 197, label, 11)}${text(208 + i * 223, 235, value, 29, '#ede7f7', 600)}${text(208 + i * 223, 260, note, 9, '#a38cc7')}`,
  )
  .join('');
const bars = [50, 85, 67, 120, 94, 135, 108, 150, 120, 165, 135, 180]
  .map((h, i) => rect(220 + i * 49, 490 - h, 25, h, '#9671d5', 4, 'none'))
  .join('');
const workspace = base(
  'Orbit',
  'Good morning, Alex.',
  `${stats}${rect(190, 300, 651, 216)}${text(209, 330, 'Project activity', 13, '#d5cbe7', 500)}${text(743, 330, 'This week', 10, '#8f7fa3')}${[365, 405, 445, 485].map((y) => `<path d="M210 ${y}H820" stroke="#2d243e"/>`).join('')}${bars}${['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((v, i) => text(239 + i * 98, 505, v, 8, '#857598')).join('')}`,
);
writeFileSync('public/previews/workspace.svg', workspace);
const analytics = base(
  'Pulse',
  'Your business, in focus.',
  `${[
    ['Monthly visitors', '24,680'],
    ['Engagement', '68.4%'],
    ['Active sessions', '1,248'],
  ]
    .map(
      ([label, value], i) =>
        `${rect(190 + i * 223, 170, 205, 100, '#142333', 8, '#243d51')}${text(208 + i * 223, 199, label, 11, '#9db7c8')}${text(208 + i * 223, 240, value, 30, '#e1edf4', 600)}`,
    )
    .join(
      '',
    )}${rect(190, 294, 421, 226, '#13202d', 8, '#263d4e')}${text(210, 325, 'Audience overview', 13, '#c8dfeb', 600)}${[365, 405, 445, 485].map((y) => `<path d="M210 ${y}H590" stroke="#213545"/>`).join('')}<path d="M211 466 C245 480 250 414 285 433 S330 389 357 406 S406 365 435 385 S490 333 520 350 S567 319 590 331" fill="none" stroke="#6fa8d1" stroke-width="4"/>${rect(630, 294, 211, 226, '#13202d', 8, '#263d4e')}${text(649, 325, 'Top channels', 13, '#c8dfeb', 600)}${[
    ['Direct', '42%'],
    ['Organic search', '31%'],
    ['Referrals', '18%'],
    ['Social', '9%'],
  ]
    .map(
      ([label, value], i) =>
        `${text(649, 363 + i * 40, label, 11, '#9bb7cc')}${text(783, 363 + i * 40, value, 11, '#c5e0ee')}`,
    )
    .join('')}`,
  '#80b9dd',
);
writeFileSync('public/previews/analytics.svg', analytics);
const writing = base(
  'Draft AI',
  'Make room for better ideas.',
  `${rect(190, 169, 410, 354, '#1c1928', 8, '#373044')}${text(214, 205, 'PRODUCT LAUNCH BRIEF', 9, '#a797c3')}${text(214, 250, 'An idea worth sharing.', 25, '#e6dff0', 600)}${text(214, 283, 'Start with a clear problem. Build with intention.', 12)}${[318, 340, 362, 405, 427, 449, 471].map((y, i) => rect(214, y, i % 3 === 0 ? 255 : 345, 5, '#4f445f', 2, 'none')).join('')}${rect(620, 169, 221, 354, '#21182f', 8, '#40314f')}${text(639, 205, 'YOUR WRITING PARTNER', 9, '#b29bcf')}${text(639, 244, 'A fresh perspective.', 16, '#ece3f5', 600)}${text(639, 279, 'Keep the opening focused.', 11)}${text(639, 301, 'Lead with the reader’s needs.', 11)}${rect(639, 334, 181, 56, '#39264f', 6, '#4c3565')}${text(654, 360, 'Explore a new direction', 11, '#d4bee9')}${text(654, 377, 'A starting point, not a final draft.', 8, '#a18ab7')}${text(639, 440, 'THOUGHTFUL BY DESIGN', 9, '#9d83b9')}${text(639, 463, 'Review. Refine. Make it yours.', 10)}`,
);
writeFileSync('public/previews/writing.svg', writing);
const softPalette = {
  '#11101c': '#f0f4fa',
  '#1c1729': '#e5ecf6',
  '#171222': '#e9eff8',
  '#3a285b': '#dbe7fa',
  '#655871': '#94a5be',
  '#9d8bad': '#71849f',
  '#70617e': '#8294ae',
  '#8d7c9d': '#6e82a0',
  '#1b172b': '#eaf0f9',
  '#332944': '#ffffff',
  '#eee8f7': '#263d60',
  '#ede7f6': '#273b5a',
  '#9386a5': '#7587a0',
  '#b9b2cf': '#657b9b',
  '#ede7f7': '#294263',
  '#a38cc7': '#5985be',
  '#d5cbe7': '#415e84',
  '#8f7fa3': '#738bac',
  '#2d243e': '#d7e2f1',
  '#9671d5': '#6393de',
  '#857598': '#7b8ea7',
  '#a58aeb': '#5287d7',
  '#ded1ff': '#326cc3',
  '#70647e': '#8294ad',
  '#142333': '#e6f0f7',
  '#243d51': '#ffffff',
  '#9db7c8': '#6a89a7',
  '#e1edf4': '#294a68',
  '#13202d': '#e7f0f8',
  '#263d4e': '#ffffff',
  '#c8dfeb': '#3a6284',
  '#213545': '#d4e2f1',
  '#6fa8d1': '#4489d0',
  '#9bb7cc': '#6889a8',
  '#c5e0ee': '#3c6488',
  '#80b9dd': '#4a8ac4',
  '#1c1928': '#edf0f8',
  '#373044': '#ffffff',
  '#a797c3': '#7785a5',
  '#e6dff0': '#334365',
  '#4f445f': '#c8d3e6',
  '#21182f': '#e7edf7',
  '#40314f': '#ffffff',
  '#b29bcf': '#7088ab',
  '#ece3f5': '#364e70',
  '#39264f': '#d9e5f7',
  '#4c3565': '#ffffff',
  '#d4bee9': '#42689d',
  '#a18ab7': '#728eb3',
  '#9d83b9': '#6586b2',
};
for (const file of ['workspace', 'analytics', 'writing']) {
  const path = `public/previews/${file}.svg`;
  writeFileSync(
    path,
    readFileSync(path, 'utf8').replace(/#[0-9a-f]{6}/gi, (color) => softPalette[color] || color),
  );
}
console.log('Created three local light dashboard previews.');
