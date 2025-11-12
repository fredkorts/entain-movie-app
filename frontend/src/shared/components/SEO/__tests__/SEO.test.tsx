import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import SEO from "../index";

describe("SEO Component", () => {
  beforeEach(() => {
    // Clear any existing meta tags before each test
    document.head.innerHTML = "";
  });

  afterEach(() => {
    document.head.innerHTML = "";
  });

  it("should render title with site suffix", async () => {
    render(
      <HelmetProvider>
        <SEO title="Test Movie" description="Test description" />
      </HelmetProvider>
    );

    await waitFor(() => {
      const titleElement = document.querySelector("title");
      expect(titleElement?.textContent).toBe("Test Movie | Movie App");
    });
  });

  it("should render description meta tag", async () => {
    render(
      <HelmetProvider>
        <SEO title="Test Movie" description="This is a test description" />
      </HelmetProvider>
    );

    await waitFor(() => {
      const descriptionMeta = document.querySelector(
        'meta[name="description"]'
      ) as HTMLMetaElement;
      expect(descriptionMeta?.content).toBe("This is a test description");
    });
  });

  it("should render Open Graph meta tags", async () => {
    const testUrl = "https://movie-app-entain.vercel.app/movies/123";
    const testImage = "https://image.tmdb.org/t/p/w500/poster.jpg";

    render(
      <HelmetProvider>
        <SEO
          title="Test Movie"
          description="Test description"
          image={testImage}
          url={testUrl}
          type="article"
        />
      </HelmetProvider>
    );

    await waitFor(() => {
      const ogType = document.querySelector(
        'meta[property="og:type"]'
      ) as HTMLMetaElement;
      const ogUrl = document.querySelector(
        'meta[property="og:url"]'
      ) as HTMLMetaElement;
      const ogTitle = document.querySelector(
        'meta[property="og:title"]'
      ) as HTMLMetaElement;
      const ogDescription = document.querySelector(
        'meta[property="og:description"]'
      ) as HTMLMetaElement;
      const ogImage = document.querySelector(
        'meta[property="og:image"]'
      ) as HTMLMetaElement;

      expect(ogType?.content).toBe("article");
      expect(ogUrl?.content).toBe(testUrl);
      expect(ogTitle?.content).toBe("Test Movie | Movie App");
      expect(ogDescription?.content).toBe("Test description");
      expect(ogImage?.content).toBe(testImage);
    });
  });

  it("should render Twitter Card meta tags", async () => {
    const testUrl = "https://movie-app-entain.vercel.app/movies/123";
    const testImage = "https://image.tmdb.org/t/p/w500/poster.jpg";

    render(
      <HelmetProvider>
        <SEO
          title="Test Movie"
          description="Test description"
          image={testImage}
          url={testUrl}
        />
      </HelmetProvider>
    );

    await waitFor(() => {
      const twitterCard = document.querySelector(
        'meta[property="twitter:card"]'
      ) as HTMLMetaElement;
      const twitterUrl = document.querySelector(
        'meta[property="twitter:url"]'
      ) as HTMLMetaElement;
      const twitterTitle = document.querySelector(
        'meta[property="twitter:title"]'
      ) as HTMLMetaElement;
      const twitterDescription = document.querySelector(
        'meta[property="twitter:description"]'
      ) as HTMLMetaElement;
      const twitterImage = document.querySelector(
        'meta[property="twitter:image"]'
      ) as HTMLMetaElement;

      expect(twitterCard?.content).toBe("summary_large_image");
      expect(twitterUrl?.content).toBe(testUrl);
      expect(twitterTitle?.content).toBe("Test Movie | Movie App");
      expect(twitterDescription?.content).toBe("Test description");
      expect(twitterImage?.content).toBe(testImage);
    });
  });

  it("should render canonical link", async () => {
    const testUrl = "https://movie-app-entain.vercel.app/movies/123";

    render(
      <HelmetProvider>
        <SEO title="Test Movie" description="Test description" url={testUrl} />
      </HelmetProvider>
    );

    await waitFor(() => {
      const canonicalLink = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement;
      expect(canonicalLink?.href).toBe(testUrl);
    });
  });

  it("should render keywords meta tag when provided", async () => {
    render(
      <HelmetProvider>
        <SEO
          title="Test Movie"
          description="Test description"
          keywords="action, thriller, drama"
        />
      </HelmetProvider>
    );

    await waitFor(() => {
      const keywordsMeta = document.querySelector(
        'meta[name="keywords"]'
      ) as HTMLMetaElement;
      expect(keywordsMeta?.content).toBe("action, thriller, drama");
    });
  });

  it("should not render keywords meta tag when not provided", async () => {
    render(
      <HelmetProvider>
        <SEO title="Test Movie" description="Test description" />
      </HelmetProvider>
    );

    await waitFor(() => {
      const keywordsMeta = document.querySelector('meta[name="keywords"]');
      expect(keywordsMeta).toBeNull();
    });
  });

  it("should use default image when not provided", async () => {
    render(
      <HelmetProvider>
        <SEO title="Test Movie" description="Test description" />
      </HelmetProvider>
    );

    await waitFor(() => {
      const ogImage = document.querySelector(
        'meta[property="og:image"]'
      ) as HTMLMetaElement;
      expect(ogImage?.content).toBe(
        "https://movie-app-entain.vercel.app/og-image.jpg"
      );
    });
  });

  it("should convert relative URLs to absolute", async () => {
    render(
      <HelmetProvider>
        <SEO title="Test Movie" description="Test description" url="/movies/123" />
      </HelmetProvider>
    );

    await waitFor(() => {
      const ogUrl = document.querySelector(
        'meta[property="og:url"]'
      ) as HTMLMetaElement;
      expect(ogUrl?.content).toBe(
        "https://movie-app-entain.vercel.app/movies/123"
      );
    });
  });

  it("should default type to website", async () => {
    render(
      <HelmetProvider>
        <SEO title="Test Movie" description="Test description" />
      </HelmetProvider>
    );

    await waitFor(() => {
      const ogType = document.querySelector(
        'meta[property="og:type"]'
      ) as HTMLMetaElement;
      expect(ogType?.content).toBe("website");
    });
  });
});
