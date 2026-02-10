import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiCalendar,
  FiArrowRight,
  FiTag
} from 'react-icons/fi';
import './News.css';

const News = () => {
  const newsItems = [
    {
      id: 1,
      title: 'ICBB Launches New Bioinformatics Training Program',
      excerpt: 'We are excited to announce our comprehensive bioinformatics training program designed for researchers across Africa. The program covers NGS analysis, R programming, and more.',
      date: '2024-01-15',
      category: 'Training',
      image: null
    },
    {
      id: 2,
      title: 'Partnership with Regional Universities Expands Research Capacity',
      excerpt: 'ICBB has established new partnerships with three universities in West Africa to strengthen computational biology research and training capabilities in the region.',
      date: '2024-01-10',
      category: 'Partnerships',
      image: null
    },
    {
      id: 3,
      title: 'New Statistical Analysis Services Now Available',
      excerpt: 'We have expanded our service offerings to include advanced statistical consulting, machine learning applications, and custom analysis solutions for research projects.',
      date: '2024-01-05',
      category: 'Services',
      image: null
    },
    {
      id: 4,
      title: 'ICBB Contributes to Major Genomics Study',
      excerpt: 'Our team has been involved in a landmark genomics study examining genetic diversity in African populations, with implications for personalized medicine.',
      date: '2023-12-20',
      category: 'Research',
      image: null
    },
    {
      id: 5,
      title: 'Workshop on Machine Learning in Healthcare Announced',
      excerpt: 'Join us for an intensive workshop on applying machine learning techniques to healthcare data. The workshop will cover practical applications and hands-on exercises.',
      date: '2023-12-15',
      category: 'Events',
      image: null
    },
    {
      id: 6,
      title: 'Year in Review: ICBB 2023 Highlights',
      excerpt: 'As we wrap up 2023, we reflect on the achievements, milestones, and impact we have made in advancing computational biology and bioinformatics in Africa.',
      date: '2023-12-10',
      category: 'Announcements',
      image: null
    }
  ];

  const categories = ['All', 'Training', 'Research', 'Partnerships', 'Services', 'Events', 'Announcements'];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="news-page">
      {/* Hero Section */}
      <section className="news-hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="page-badge">Stay Updated</span>
            <h1>News & Updates</h1>
            <p>
              Stay informed about the latest developments, research highlights, 
              training opportunities, and announcements from ICBB.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="news-filter">
        <div className="container">
          <div className="filter-tags">
            {categories.map((category, index) => (
              <button 
                key={index} 
                className={`filter-tag ${category === 'All' ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="news-grid-section section">
        <div className="container">
          <div className="news-grid">
            {newsItems.map((item, index) => (
              <motion.article 
                key={item.id}
                className="news-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="news-image">
                  <div className="image-placeholder">
                    <FiTag size={32} />
                  </div>
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-category">{item.category}</span>
                    <span className="news-date">
                      <FiCalendar /> {formatDate(item.date)}
                    </span>
                  </div>
                  <h2>{item.title}</h2>
                  <p>{item.excerpt}</p>
                  <Link to={`/news/${item.id}`} className="read-more">
                    Read More <FiArrowRight />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
          
          {/* Load More */}
          <div className="load-more text-center">
            <button className="btn btn-outline-primary btn-lg">
              Load More News
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="newsletter-section section">
        <div className="container">
          <div className="newsletter-box">
            <h2>Subscribe to Our Newsletter</h2>
            <p>
              Get the latest news, research updates, and training opportunities 
              delivered directly to your inbox.
            </p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="form-input"
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;
