# Content API Artist Launch Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and render a 1080 x 1080 Remotion launch video announcing the
Content API for music-artist content generation.

**Architecture:** Add one new Remotion composition, one data file, and focused
scene components under `remotion/src/components/content-api-launch/`. The
composition uses hard-cut `Series` sequencing, local frame animations, typed API
copy, primitive fan-out cards, and a final output grid claim.

**Tech Stack:** Remotion 4.x, React 18, TypeScript, `spring()`,
`interpolate()`, `Series`, `AbsoluteFill`.

---

## File structure

This implementation keeps the video code self-contained while following the
existing Remotion project structure.

- Create `remotion/src/ContentApiArtistLaunch.tsx`: top-level composition that
  sequences all scenes and exports total frame constants.
- Create `remotion/src/data/contentApiLaunchData.ts`: editable launch copy and
  output labels.
- Create `remotion/src/components/content-api-launch/shared.tsx`: local palette,
  animation helpers, and shared UI primitives for this one composition.
- Create one scene file per beat under
  `remotion/src/components/content-api-launch/`: brand seed, artist context,
  API promise, request, primitive fan-out, agent prompt, output grid, benefit
  claim, and CTA.
- Modify `remotion/src/Root.tsx`: register the `ContentApiArtistLaunch`
  composition.
- Modify `remotion/package.json`: add `build:content-api` render command.
- Update `PROGRESS.md`: record the rendered video and verification result.

## Task 1: Red render check

**Files:**

- No file changes.

- [ ] **Step 1: Run the render before implementing the composition**

Run:

```bash
cd remotion
npx remotion render ContentApiArtistLaunch out/content-api-artist-launch.mp4
```

Expected: FAIL because `ContentApiArtistLaunch` is not registered yet. This is
the red check proving the render command will catch the missing feature.

## Task 2: Add launch data

**Files:**

- Create: `remotion/src/data/contentApiLaunchData.ts`

- [ ] **Step 1: Add typed launch data**

Create a `ContentApiLaunchData` type and `contentApiLaunchData` constant with
these values:

```ts
export type ContentApiLaunchData = {
  productName: string;
  endpoint: string;
  audienceLine: string;
  promise: string;
  artistName: string;
  songName: string;
  prompt: string;
  outputTypes: string[];
  assetLabels: string[];
  benefitClaim: string;
  cta: string;
};

export const contentApiLaunchData: ContentApiLaunchData = {
  productName: "Recoup",
  endpoint: "POST /api/content/create",
  audienceLine: "For music artists shipping every week.",
  promise: "One API call generates the content stack.",
  artistName: "Gatsby Grace",
  songName: "next single",
  prompt: "Generate launch content for Gatsby Grace's next single.",
  outputTypes: ["image", "video", "text", "audio", "render", "upscale"],
  assetLabels: ["cover", "teaser", "caption", "clip", "render", "upscale"],
  benefitClaim: "content for every drop.",
  cta: "developers.recoupable.com",
};
```

## Task 3: Add scene components

**Files:**

- Create: `remotion/src/components/content-api-launch/shared.tsx`
- Create: `remotion/src/components/content-api-launch/BrandSeedScene.tsx`
- Create: `remotion/src/components/content-api-launch/ArtistContextScene.tsx`
- Create: `remotion/src/components/content-api-launch/ApiPromiseScene.tsx`
- Create: `remotion/src/components/content-api-launch/RequestScene.tsx`
- Create: `remotion/src/components/content-api-launch/PrimitiveFanOutScene.tsx`
- Create: `remotion/src/components/content-api-launch/AgentPromptScene.tsx`
- Create: `remotion/src/components/content-api-launch/OutputGridScene.tsx`
- Create: `remotion/src/components/content-api-launch/BenefitClaimScene.tsx`
- Create: `remotion/src/components/content-api-launch/CtaScene.tsx`

- [ ] **Step 1: Add local visual constants and helpers**

Create constants for the palette, clamped interpolation, typing reveal, and the
shared scene shell.

- [ ] **Step 2: Add nine scene components**

Add these exported scene components:

- `BrandSeedScene`
- `ArtistContextScene`
- `ApiPromiseScene`
- `RequestScene`
- `PrimitiveFanOutScene`
- `AgentPromptScene`
- `OutputGridScene`
- `BenefitClaimScene`
- `CtaScene`

Each scene receives `data: ContentApiLaunchData`. Use local frame values from
`useCurrentFrame()`, and keep animation to scale, opacity, cursor movement,
typing reveal, staggered cards, and grid blur.

## Task 4: Add top-level composition

**Files:**

- Create: `remotion/src/ContentApiArtistLaunch.tsx`

- [ ] **Step 1: Add scene duration constants**

Use the approved beat sheet durations:

```ts
export const CONTENT_API_LAUNCH_FPS = 30;
export const CONTENT_API_LAUNCH_SCENE_FRAMES = {
  brandSeed: 36,
  artistContext: 60,
  apiPromise: 75,
  request: 90,
  primitiveFanOut: 90,
  agentPrompt: 75,
  outputGrid: 120,
  benefitClaim: 75,
  cta: 60,
} as const;
```

- [ ] **Step 2: Export total frame count**

Export `CONTENT_API_LAUNCH_TOTAL_FRAMES` by summing the durations.

- [ ] **Step 3: Sequence scenes with `Series`**

Render all nine scenes inside `<Series>` with no overlap and no transition
component.

## Task 5: Register and add render script

**Files:**

- Modify: `remotion/src/Root.tsx`
- Modify: `remotion/package.json`

- [ ] **Step 1: Register the composition**

Import `ContentApiArtistLaunch`,
`CONTENT_API_LAUNCH_TOTAL_FRAMES`, and `contentApiLaunchData`. Add a
`Composition` with:

- `id="ContentApiArtistLaunch"`
- `durationInFrames={CONTENT_API_LAUNCH_TOTAL_FRAMES}`
- `fps={30}`
- `width={1080}`
- `height={1080}`
- `defaultProps={{ data: contentApiLaunchData }}`

- [ ] **Step 2: Add the render script**

Add:

```json
"build:content-api": "remotion render ContentApiArtistLaunch out/content-api-artist-launch.mp4"
```

## Task 6: Green render and contact sheet

**Files:**

- Generated: `remotion/out/content-api-artist-launch.mp4`
- Generated: `.local/reference/content-api-artist-launch/contact-sheet.jpg`

- [ ] **Step 1: Run TypeScript/build verification**

Run:

```bash
cd remotion
npx tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 2: Render the video**

Run:

```bash
cd remotion
npm run build:content-api
```

Expected: exit code 0 and `remotion/out/content-api-artist-launch.mp4` exists.

- [ ] **Step 3: Create a contact sheet**

Run:

```bash
mkdir -p ../.local/reference/content-api-artist-launch
ffmpeg -hide_banner -y -i out/content-api-artist-launch.mp4 -vf "fps=1,scale=240:-1,tile=6x4" -frames:v 1 ../.local/reference/content-api-artist-launch/contact-sheet.jpg
```

Expected: contact sheet image exists.

## Task 7: Final validation and handoff

**Files:**

- Modify: `PROGRESS.md`

- [ ] **Step 1: Run lints for edited source files**

Use `ReadLints` on the new Remotion files and modified docs.

- [ ] **Step 2: Update `PROGRESS.md`**

Add a dated entry noting the new composition, output MP4 path, contact sheet
path, and verification commands.

- [ ] **Step 3: Report the exact output paths**

Return the composition ID, rendered video path, contact sheet path, and
verification commands with observed results.
