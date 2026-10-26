// Ported from Marketing c805112; keep labels, order and destinations aligned.
export const headerNavigation = [
  {
    label: "Services",
    links: [
      {
        label: "Advisory",
        href: "https://recoupable.dev/advisory",
        description: "Know where AI fits and what to prioritize.",
        visual: "advisory",
      },
      {
        label: "Build",
        href: "https://recoupable.dev/build",
        description: "Custom AI systems for your team.",
        visual: "build",
      },
      {
        label: "Training",
        href: "https://recoupable.dev/training",
        description: "Put AI to work with your team.",
        visual: "training",
      },
    ],
  },
  {
    label: "Products",
    links: [
      {
        label: "Platform",
        href: "https://recoupable.dev/platform",
        description: "Music AI, ready to use. No custom build.",
        visual: "platform",
      },
      {
        label: "Skills",
        href: "https://recoupable.dev/skills",
        description: "Music playbooks for your AI.",
        visual: "skills",
      },
      {
        label: "Developers",
        href: "https://recoupable.dev/developers",
        description: "Build with our API, MCP, and CLI.",
        visual: "developers",
      },
    ],
  },
  {
    label: "Resources",
    layout: "resources",
    links: [
      {
        label: "Docs",
        href: "/",
        description: "Get started and build with Recoup.",
        icon: "docs",
      },
      {
        label: "Blog",
        href: "https://recoupable.dev/blog",
        description: "Ideas for AI in music.",
        icon: "blog",
      },
      {
        label: "Atlas",
        href: "https://recoupable.dev/atlas",
        description: "Explore the music-company operating model.",
        icon: "lab",
      },
      {
        label: "Lab",
        href: "https://recoupable.dev/lab",
        description: "Explore what’s next.",
        icon: "lab",
      },
      {
        label: "Podcast",
        href: "https://recoupable.dev/podcast",
        description: "Music operators on how they use AI.",
        icon: "podcast",
      },
      {
        label: "Work",
        href: "https://recoupable.dev/case-studies",
        description: "See the systems we’ve built.",
        icon: "work",
      },
    ],
  },
  { label: "Pricing", href: "https://recoupable.dev/pricing" },
] as const;
