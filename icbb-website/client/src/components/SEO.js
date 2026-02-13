import React from 'react';

// Simple SEO component using document methods
// For a full solution, consider react-helmet-async
const SEO = ({ 
  title, 
  description, 
  keywords,
  image = '/logo192.png',
  url
}) => {
  React.useEffect(() => {
    // Update title
    if (title) {
      document.title = `${title} | ICBB`;
    }
    
    // Update meta tags
    const updateMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    if (description) {
      updateMeta('description', description);
      updateMeta('og:description', description, true);
      updateMeta('twitter:description', description);
    }

    if (keywords) {
      updateMeta('keywords', keywords);
    }

    if (title) {
      updateMeta('og:title', `${title} | ICBB`, true);
      updateMeta('twitter:title', `${title} | ICBB`);
    }

    if (image) {
      updateMeta('og:image', image, true);
      updateMeta('twitter:image', image);
    }

    if (url) {
      updateMeta('og:url', url, true);
    }

    updateMeta('og:type', 'website', true);
    updateMeta('twitter:card', 'summary_large_image');

  }, [title, description, keywords, image, url]);

  return null;
};

export default SEO;
