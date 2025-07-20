export async function GET(context) {
  const siteUrl = context.site || 'https://www.courses-careers.com';
  const currentDate = new Date().toISOString();
  
  const articles = [
    {
      title: 'UK Graduates Explore Global Job Opportunities',
      link: '/jobs-and-careers/career-sectors/7953-uk-graduates-flock-to-china-for-job-opportunities',
      description: 'How UK graduates are expanding their career horizons through international internships and global job opportunities to enhance their professional prospects.',
      pubDate: '2025-07-08T10:00:00Z',
      id: '7953',
    },
    {
      title: 'Business Courses in the UK - Undergraduate Business Degrees',
      link: '/undergraduate/subject-guide/7114-business-courses-in-the-uk',
      description: 'Comprehensive guide to business courses at UK universities. Learn about business degree options, key subjects, and career prospects in business management.',
      pubDate: '2025-07-22T10:00:00Z',
      id: '7114',
    },
    {
      title: 'Top 5 Questions About Accounting - Accountancy Courses How to Choose',
      link: '/undergraduate/subject-guide/7107-accountancy-courses-how-to-choose',
      description: 'The AAT and ACCA explain the myths created around accountancy courses and the career of an accountant.',
      pubDate: '2025-03-28T10:00:00Z',
      id: '7107',
    },
    {
      title: 'Another Record Year for GCSE Results',
      link: '/further-education/subject-guide/8010-another-record-year-for-gcse-results',
      description: 'Students celebrating another record year of achievement with nearly 70 per cent of exam entries being awarded grade C or above.',
      pubDate: '2025-08-26T10:00:00Z',
      id: '8010',
    },
    {
      title: 'The Postgraduate Study Fair 2025',
      link: '/postgraduate/subject-guide/8008-the-postgraduate-study-fair-2025',
      description: 'Join the UK\'s largest postgraduate education fair in 2025. Meet university representatives and discover funding opportunities.',
      pubDate: '2025-03-15T10:00:00Z',
      id: '8008',
    },
  ];

  const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Courses &amp; Careers</title>
  <subtitle>UK's leading guide to university courses, college programs, and career opportunities</subtitle>
  <link href="${siteUrl}/atom.xml" rel="self" type="application/atom+xml"/>
  <link href="${siteUrl}/" rel="alternate" type="text/html"/>
  <updated>${currentDate}</updated>
  <id>${siteUrl}/</id>
  <author>
    <name>Courses &amp; Careers</name>
    <email>info@courses-careers.com</email>
  </author>
  <rights>Copyright © 2025 BigChoice Group Ltd. All rights reserved.</rights>
  <generator uri="https://astro.build/" version="4.0">Astro</generator>
  
  ${articles.map(article => `
  <entry>
    <title type="html">${escapeXml(article.title)}</title>
    <link href="${siteUrl}${article.link}" rel="alternate" type="text/html"/>
    <published>${article.pubDate}</published>
    <updated>${article.pubDate}</updated>
    <id>${siteUrl}${article.link}</id>
    <content type="html">${escapeXml(article.description)}</content>
    <summary type="text">${escapeXml(article.description)}</summary>
  </entry>`).join('')}
</feed>`;

  return new Response(atomFeed, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  });
}

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}