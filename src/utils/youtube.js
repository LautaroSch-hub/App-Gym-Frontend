/** Extrae el id de un link de YouTube (watch, youtu.be, shorts, embed, live). */
export function getYouTubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(String(url).trim());
    const host = u.hostname.replace(/^(www|m|music)\./, '');
    let id = null;
    if (host === 'youtu.be') {
      id = u.pathname.slice(1).split('/')[0];
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      if (u.pathname === '/watch') id = u.searchParams.get('v');
      else {
        const m = u.pathname.match(/^\/(embed|shorts|live|v)\/([^/?]+)/);
        if (m) id = m[2];
      }
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export const youtubeThumb = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
export const youtubeEmbed = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1&autoplay=1`;
export const youtubeWatch = (id) => `https://www.youtube.com/watch?v=${id}`;
