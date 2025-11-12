import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  keywords?: string;
}

const DEFAULT_IMAGE = "https://movie-app-entain.vercel.app/og-image.jpg";
const SITE_URL = "https://movie-app-entain.vercel.app";

export default function SEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  url = SITE_URL,
  type = "website",
  keywords,
}: SEOProps) {
  const fullTitle = `${title} | Movie App`;
  const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
}
