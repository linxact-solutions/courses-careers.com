import rss from '@astrojs/rss';

export async function GET(context) {
  return rss({
    title: 'Courses & Careers',
    description: 'UK\'s leading guide to university courses, college programs, and career opportunities',
    site: context.site,
    items: [
      {
        title: 'UK Graduates Explore Global Job Opportunities',
        link: '/jobs-and-careers/career-sectors/7953-uk-graduates-flock-to-china-for-job-opportunities',
        description: 'How UK graduates are expanding their career horizons through international internships and global job opportunities to enhance their professional prospects.',
        pubDate: new Date('2025-07-08'),
        categories: ['International Careers', 'Graduate Opportunities'],
      },
      {
        title: 'Business Courses in the UK - Undergraduate Business Degrees',
        link: '/undergraduate/subject-guide/7114-business-courses-in-the-uk',
        description: 'Comprehensive guide to business courses at UK universities. Learn about business degree options, key subjects, and career prospects in business management.',
        pubDate: new Date('2025-07-22'),
        categories: ['Business Studies', 'Undergraduate'],
      },
      {
        title: 'Top 5 Questions About Accounting - Accountancy Courses How to Choose',
        link: '/undergraduate/subject-guide/7107-accountancy-courses-how-to-choose',
        description: 'The AAT and ACCA explain the myths created around accountancy courses and the career of an accountant. Learn about misconceptions, personal qualities, and career advice.',
        pubDate: new Date('2025-03-28'),
        categories: ['Accountancy', 'Career Advice'],
      },
      {
        title: 'Another Record Year for GCSE Results',
        link: '/further-education/subject-guide/8010-another-record-year-for-gcse-results',
        description: 'Students getting their GCSE results today are celebrating another record year of achievement with nearly 70 per cent of exam entries being awarded grade C or above.',
        pubDate: new Date('2025-08-26'),
        categories: ['GCSE', 'Results', 'Further Education'],
      },
      {
        title: 'The Postgraduate Study Fair 2025',
        link: '/postgraduate/subject-guide/8008-the-postgraduate-study-fair-2025',
        description: 'Join the UK\'s largest postgraduate education fair in 2025. Meet university representatives, discover funding opportunities, and get expert advice on your postgraduate application.',
        pubDate: new Date('2025-03-15'),
        categories: ['Postgraduate', 'Events', 'Education Fair'],
      },
      {
        title: 'Postgraduate Art and Design Courses',
        link: '/postgraduate/subject-guide/7221-postgraduate-art-and-design-courses',
        description: 'Explore postgraduate programs in fine arts, graphic design, and creative disciplines. Learn about portfolio requirements and career paths.',
        pubDate: new Date('2025-06-15'),
        categories: ['Art', 'Design', 'Postgraduate'],
      },
      {
        title: 'MBA Courses - Complete Guide',
        link: '/postgraduate/subject-guide/7228-mba-courses',
        description: 'Comprehensive guide to Master of Business Administration programs, including executive MBAs and specialized business degrees.',
        pubDate: new Date('2025-05-20'),
        categories: ['MBA', 'Business', 'Postgraduate'],
      },
      {
        title: 'Computer Science Postgraduate Courses',
        link: '/postgraduate/subject-guide/7234-postgraduate-courses-in-computer-science-',
        description: 'Advanced computing programs covering artificial intelligence, software engineering, cybersecurity, and data science.',
        pubDate: new Date('2025-04-10'),
        categories: ['Computer Science', 'Technology', 'Postgraduate'],
      },
      {
        title: 'Student Accommodation Guide',
        link: '/student-advice/student-finance/7165-student-accommodation-guide',
        description: 'Comprehensive guide to student accommodation options, costs, and how to find the right place to live during your studies.',
        pubDate: new Date('2025-07-01'),
        categories: ['Student Advice', 'Accommodation', 'Finance'],
      },
      {
        title: 'Bursaries and Scholarships',
        link: '/student-advice/student-finance/7167-bursaries-and-scholarships',
        description: 'Complete information about financial support available to students including bursaries, scholarships, and grants.',
        pubDate: new Date('2025-06-25'),
        categories: ['Student Finance', 'Scholarships', 'Funding'],
      },
    ],
    customData: `<language>en-GB</language>`,
  });
}