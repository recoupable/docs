# Content API artist launch video design

This spec defines a short Remotion launch video for the shipped Content API. The
video positions Recoup as content infrastructure for music artists: one API call
can fan out into image, video, text, audio, render, and upscale work for a song
or campaign.

## Goal

Create a 1080 x 1080 social video that announces the Content API as a practical
way for labels, managers, and artist teams to generate launch assets for music
artists.

The video must feel like a polished agentic software launch film: sparse frames,
hard cuts, clear UI mockups, typed API/prompt moments, output multiplication,
and one large benefit claim.

## Audience

The primary audience is music operators who understand artist releases but may
not care about implementation internals. The secondary audience is developers
who need to understand that the feature is an API, not only a UI workflow.

## Core message

One API request can turn an artist release brief into a reusable content stack.

The supporting proof is the shipped Content V2 architecture from `PROGRESS.md`:
the old monolithic content creation pipeline now exists as standalone
primitives across tasks, API endpoints, CLI commands, and a skill.

## Visual direction

Use the `agentic-launch-video` skill direction, inspired by the Higgsfield frame
study but original to Recoup:

- Black opener with a tiny Recoup mark.
- White software canvas for the API and agent workflow.
- One restrained Recoup accent color, `#345A5D`.
- Minimal mock UI rather than screenshots.
- Hard cuts between scenes.
- Typed endpoint, request payload, and artist prompt.
- Six primitive cards that fan out from one request.
- A grid of launch assets as the proof moment.
- A compact CTA at the end.

## Beat sheet

Build the composition as nine scenes over roughly 23 seconds.

1. **Brand seed** (36 frames): A tiny Recoup mark appears on a black canvas.
   Copy: `Recoup`.
2. **Artist context** (60 frames): A sparse white frame introduces the audience.
   Copy: `For music artists shipping every week.`
3. **API promise** (75 frames): Oversized type lands in the center.
   Copy: `One API call generates the content stack.`
4. **Request** (90 frames): A compact API card types a request to
   `POST /api/content/create` with artist, song, and output types.
   Copy: `artist: Gatsby Grace`, `song: next single`.
5. **Primitive fan-out** (90 frames): The request splits into six cards:
   `image`, `video`, `text`, `audio`, `render`, and `upscale`.
6. **Agent prompt** (75 frames): A chat composer receives a launch request.
   Copy: `Generate launch content for Gatsby Grace's next single.`
7. **Output grid** (120 frames): Mock social assets multiply into a grid.
   The grid must feel like release assets, not generic placeholders.
8. **Benefit claim** (75 frames): The grid smears upward, then cuts to a large
   claim.
   Copy: `content for every drop.`
9. **CTA** (60 frames): Minimal URL on white.
   Copy: `developers.recoupable.com` with a small `Content API` label.

## Data and copy

Use editable data instead of hardcoded copy inside scene components. The default
data can use Gatsby Grace as the artist example because the current workspace
already uses Gatsby Grace launch assets and drafts.

Recommended default data:

```ts
export const contentApiLaunchData = {
  productName: "Recoup",
  endpoint: "POST /api/content/create",
  artistName: "Gatsby Grace",
  songName: "next single",
  outputTypes: ["image", "video", "text", "audio", "render", "upscale"],
  prompt: "Generate launch content for Gatsby Grace's next single.",
  benefitClaim: "content for every drop.",
  cta: "developers.recoupable.com",
};
```

## Implementation constraints

Implement in the existing `remotion/` project. Do not scaffold a new Remotion
app.

Follow these constraints:

- Register a new `ContentApiArtistLaunch` composition in `remotion/src/Root.tsx`.
- Use 30fps and 1080 x 1080 dimensions.
- Keep scene components small and focused.
- Use existing Remotion utilities such as `spring()` and `interpolate()`.
- Avoid copying Higgsfield assets, copy, logos, or generated faces.
- Render the final MP4 to `remotion/out/content-api-artist-launch.mp4`.
- Save a contact sheet under `.local/` for quick visual review.

## Acceptance criteria

The work is complete when:

- The Remotion composition renders successfully.
- The video follows the approved nine-scene beat sheet.
- The API request and six primitive output types are readable.
- The output grid communicates artist launch assets.
- The final CTA is visible for at least 1.5 seconds.
- A fresh verification command has been run and reported.

## Next steps

Create an implementation plan from this spec, then implement the Remotion
composition and render the video.
