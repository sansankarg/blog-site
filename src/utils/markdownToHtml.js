import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import matter from 'gray-matter';

// ─── Component Pre-processors ──────────────────────────────────────────────

function processDownloadCard(md) {
  return md.replace(
    /\[download:\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^\]]+)\]/g,
    (_, url, title, desc) => `
<a href="${url.trim()}" class="download-card" target="_blank" rel="noopener noreferrer">
  <div class="download-icon-wrapper">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  </div>
  <div class="download-info">
    <span class="download-title">${title.trim()}</span>
    <span class="download-desc">${desc.trim()}</span>
  </div>
  <div class="download-badge">Download</div>
</a>`
  );
}

function processPhotoCard(md) {
  return md.replace(
    /\[photo:\s*([^|]+)\s*\|\s*([^\]]+)\]/g,
    (_, url, caption) => `
<div class="photo-card">
  <img src="${url.trim()}" alt="${caption.trim()}" />
  <p class="photo-card-caption">${caption.trim()}</p>
</div>`
  );
}

function processGallery(md) {
  return md.replace(
    /\[gallery:\s*([^|]+)\s*(?:\|\s*([^\]]+))?\]/g,
    (_, imgs, caption) => {
      const images = imgs.split(',').map(u => u.trim()).filter(Boolean);
      const imgTags = images.map(src =>
        `<img src="${src}" alt="Gallery image" loading="lazy" />`
      ).join('\n  ');
      const cap = caption ? `<p class="gallery-caption">${caption.trim()}</p>` : '';
      return `
<div class="gallery-wrapper">
  <div class="gallery-scroll">
    ${imgTags}
  </div>
  ${cap}
</div>`;
    }
  );
}

function processHero(md) {
  return md.replace(
    /\[hero:\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^\]]+)\]/g,
    (_, url, title, subtitle) => `
<div class="hero-banner">
  <img src="${url.trim()}" alt="${title.trim()}" />
  <div class="hero-overlay"></div>
  <div class="hero-text">
    <h2>${title.trim()}</h2>
    <p>${subtitle.trim()}</p>
  </div>
</div>`
  );
}

function processQuote(md) {
  return md.replace(
    /\[quote:\s*"?([^"|]+)"?\s*\|\s*([^\]]+)\]/g,
    (_, text, author) => `
<div class="pull-quote">
  <p class="pull-quote-text">${text.trim()}</p>
  <span class="pull-quote-author">${author.trim()}</span>
</div>`
  );
}

function processSection(md) {
  return md.replace(
    /\[section:\s*([^\]]+)\]/g,
    (_, title) => `
<div class="section-divider">
  <div class="section-divider-line left"></div>
  <span class="section-divider-text">${title.trim()}</span>
  <div class="section-divider-line"></div>
</div>`
  );
}

function processIntro(md) {
  return md.replace(
    /\[intro:\s*([^\]]+)\]/g,
    (_, text) => `<p class="intro-paragraph">${text.trim()}</p>`
  );
}

function processLinkCard(md) {
  return md.replace(
    /\[linkcard:\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^\]]+)\]/g,
    (_, url, title, desc) => {
      const cleanUrl = url.trim();
      const displayUrl = cleanUrl.replace(/^https?:\/\//, '');
      return `
<a href="${cleanUrl}" class="link-card" target="_blank" rel="noopener noreferrer">
  <div class="link-card-icon">🔗</div>
  <div class="link-card-info">
    <span class="link-card-title">${title.trim()}</span>
    <span class="link-card-desc">${desc.trim()}</span>
    <span class="link-card-url">${displayUrl}</span>
  </div>
  <svg class="link-card-arrow" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
</a>`;
    }
  );
}

function processProfile(md) {
  return md.replace(
    /\[profile:\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^\]]+)\]/g,
    (_, img, name, role, handle) => `
<div class="profile-card">
  <img class="profile-avatar" src="${img.trim()}" alt="${name.trim()}" />
  <div class="profile-info">
    <span class="profile-name">${name.trim()}</span>
    <span class="profile-role">${role.trim()}</span>
    <span class="profile-handle">${handle.trim()}</span>
  </div>
</div>`
  );
}

function processCallout(md) {
  const types = ['tip', 'info', 'warning', 'danger'];
  return md.replace(
    /\[callout:\s*(tip|info|warning|danger)\s*\|\s*([^\]]+)\]/g,
    (_, type, text) => {
      if (!types.includes(type)) return _;
      return `
<div class="callout ${type}">
  <span class="callout-icon"></span>
  <span class="callout-text">${text.trim()}</span>
</div>`;
    }
  );
}

function processTimeline(md) {
  return md.replace(
    /\[timeline:\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^\]]+)\]/g,
    (_, date, title, desc) => `
<div class="timeline-entry">
  <div class="timeline-left">
    <span class="timeline-date">${date.trim()}</span>
    <div class="timeline-dot-wrapper">
      <div class="timeline-dot"></div>
      <div class="timeline-stem"></div>
    </div>
  </div>
  <div class="timeline-right">
    <div class="timeline-title">${title.trim()}</div>
    <div class="timeline-desc">${desc.trim()}</div>
  </div>
</div>`
  );
}

function processSpoiler(md) {
  return md.replace(
    /\[spoiler:\s*([^|]+)\s*\|\s*([^\]]+)\]/g,
    (_, label, content) => `
<details class="spoiler-block">
  <summary>${label.trim()}</summary>
  <div class="spoiler-content">${content.trim()}</div>
</details>`
  );
}

function processContact(md) {
  // [contact: Prompt message | form_id]
  return md.replace(
    /\[contact:\s*([^|]+)\s*\|\s*([^\]]+)\]/g,
    (_, promptMessage, formId) => `
<div class="react-contact-form-mount" data-prompt="${promptMessage.trim()}" data-formid="${formId.trim()}"></div>`
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────

export async function markdownToHtml(markdownText) {
  let processed = markdownText;
  processed = processDownloadCard(processed);
  processed = processPhotoCard(processed);
  processed = processGallery(processed);
  processed = processHero(processed);
  processed = processQuote(processed);
  processed = processSection(processed);
  processed = processIntro(processed);
  processed = processLinkCard(processed);
  processed = processProfile(processed);
  processed = processCallout(processed);
  processed = processTimeline(processed);
  processed = processSpoiler(processed);
  processed = processContact(processed);


  const { content, data: meta } = matter(processed);

  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);

  return {
    html: String(file),
    meta,
  };
}
