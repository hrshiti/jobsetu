import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title = 'ApplyNova Portal - Apply for your dream job', 
  description = 'Apply for your dream job in minutes on our premium career portal. Fast processing, easy application, and secure data handling.', 
  keywords = 'careers, jobs, application, frontend developer, ui/ux designer, product manager, support executive',
  ogImage = '/og-image.png',
  canonicalUrl = window.location.href,
  robots = 'index, follow'
}) {
  const siteTitle = title.includes('ApplyNova Portal') ? title : `${title} | ApplyNova Portal`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
}
