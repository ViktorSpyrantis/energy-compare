import type { MetadataRoute } from "next";
import { allProviders } from "../data/providers";

const BASE_URL = "https://energycompare.gr";

export default function sitemap(): MetadataRoute.Sitemap {
  const providerPages = allProviders.map((provider) => ({
    url: `${BASE_URL}/providers/${provider.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/providers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...providerPages,
  ];
}
