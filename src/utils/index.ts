const localVideos = import.meta.glob<string>(
  "/src/assets/images/**/*.{mp4,webm}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

export function resolveVideo(path: string) {
  if (path && path.startsWith("/src/assets/")) {
    const found = localVideos[path];

    if (!found) throw new Error(`Video ${path} not found in local ideos.`);

    return found;
  }
  return path;
}
