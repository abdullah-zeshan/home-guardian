export default function sitemap() {
  return [
    {
      url: "https://home-guardian.vercel.app",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://home-guardian.vercel.app/emergency",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://home-guardian.vercel.app/report",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://home-guardian.vercel.app/create-report",
      lastModified: new Date(),
      priority: 0.8,
    },
  ];
}