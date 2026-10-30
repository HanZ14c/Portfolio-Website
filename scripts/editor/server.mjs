import { createServer } from 'node:http';
import { createHash, randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync, renameSync, unlinkSync, mkdirSync, realpathSync } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const directory = dirname(fileURLToPath(import.meta.url));
const categories = ['Computer Science', 'Academic Architecture', 'Architecture Practice', 'Visual Studies'];
const mimeTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' };
const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
const revision = (content) => createHash('sha256').update(content).digest('hex');
const text = (value) => typeof value === 'string' && value.length <= 20_000;
const strings = (value) => Array.isArray(value) && value.length <= 100 && value.every(text);
const list = (value, check) => Array.isArray(value) && value.length <= 100 && value.every(check);
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const exactKeys = (value, keys) => object(value) && Object.keys(value).every((key) => keys.includes(key));
const localMedia = (value) => text(value) && /^\/media\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp|gif)$/.test(value);
const link = (value) => {
  try { return text(value) && ['https:', 'http:', 'mailto:'].includes(new URL(value).protocol); }
  catch { return false; }
};

function writeJson(file, value) {
  const content = JSON.stringify(value, null, 2) + '\n';
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    writeFileSync(temporary, content, { flag: 'wx' });
    renameSync(temporary, file);
  } finally {
    try { unlinkSync(temporary); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return revision(content);
}

function validateProject(project) {
  const required = ['slug', 'title', 'subtitle', 'category', 'time', 'period', 'role', 'status', 'excerpt', 'statement', 'accent'];
  const optionalText = ['location', 'codeAccent', 'cover', 'coverAlt', 'galleryLabel', 'galleryTitle'];
  const booleans = ['containCover', 'visualOnly', 'hidden', 'showSections', 'showGallery', 'featured'];
  const rest = ['cardSize', 'facts', 'sections', 'gallery', 'galleryLayout', 'links', 'highlights'];
  if (!exactKeys(project, [...required, ...optionalText, ...booleans, ...rest])) fail('项目格式或字段不正确。');
  for (const key of required) if (!text(project[key])) fail(`${key} 必须是文本。`);
  for (const key of optionalText) if (key in project && !text(project[key])) fail(`${key} 必须是文本。`);
  for (const key of booleans) if (key in project && typeof project[key] !== 'boolean') fail(`${key} 必须是开关值。`);
  if (!project.title.trim() || project.slug.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) fail('标题不能为空；项目地址限 80 字符，只能使用小写英文字母、数字和连字符。');
  if (!categories.includes(project.category)) fail('请选择有效分类。');
  for (const key of ['accent', 'codeAccent']) {
    if (project[key] !== undefined && !/^#[0-9a-f]{6}$/i.test(project[key])) fail(`${key} 必须是六位十六进制颜色。`);
  }
  if (project.cover && !localMedia(project.cover)) fail('封面必须使用本地 JPG、PNG、WebP 或 GIF 图片。');
  if (project.cardSize !== undefined && !['wide', 'standard'].includes(project.cardSize)) fail('卡片尺寸无效。');
  if (project.galleryLayout !== undefined && project.galleryLayout !== 'process-triptych') fail('图库布局无效。');
  if (!list(project.facts, (item) => exactKeys(item, ['label', 'value']) && text(item.label) && text(item.value))) fail('项目资料格式无效。');
  if (!list(project.sections, (item) => exactKeys(item, ['label', 'title', 'body', 'points']) && text(item.label) && text(item.title) && strings(item.body) && (item.points === undefined || strings(item.points)))) fail('正文章节格式无效。');
  if (project.highlights !== undefined && !strings(project.highlights)) fail('亮点必须是文本列表。');
  if (project.gallery !== undefined && !list(project.gallery, (item) => exactKeys(item, ['src', 'alt', 'caption']) && localMedia(item.src) && text(item.alt) && (item.caption === undefined || text(item.caption)))) fail('图库格式或图片路径无效。');
  if (project.links !== undefined && !list(project.links, (item) => exactKeys(item, ['label', 'href']) && text(item.label) && link(item.href))) fail('链接只支持 http、https 或 mailto。');
}

function mediaFile(root, path) {
  if (!localMedia(path)) fail('图片路径无效。');
  const mediaRoot = realpathSync(join(root, 'public/media'));
  const file = realpathSync(join(root, 'public', path));
  if (!file.startsWith(mediaRoot + sep)) fail('图片必须位于 public/media。', 403);
  return file;
}

async function readBody(request, limit) {
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > limit) fail('请求过大；图片上限为 10 MB。', 413);
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function imageExtension(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return '.png';
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return '.jpg';
  if (['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString())) return '.gif';
  if (bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP') return '.webp';
  fail('请选择 JPG、PNG、WebP 或 GIF 图片；不支持 SVG 或其他文件。');
}

export function createEditorServer(root = resolve(directory, '../..')) {
  const dataFile = join(root, 'lib/projects/data.json');
  const featuredFile = join(root, 'lib/projects/featured.json');
  const token = randomUUID();
  const snapshot = () => {
    const content = readFileSync(dataFile, 'utf8');
    return { projects: JSON.parse(content), revision: revision(content) };
  };
  const featuredSnapshot = () => {
    const current = snapshot();
    const content = readFileSync(featuredFile, 'utf8');
    return { slugs: JSON.parse(content), projects: current.projects, revision: revision(current.revision + content) };
  };
  const server = createServer(async (request, response) => {
    const send = (status, value, type = 'application/json') => {
      response.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer' });
      response.end(type === 'application/json' ? JSON.stringify(value) : value);
    };
    try {
      const origin = `http://127.0.0.1:${server.address().port}`;
      if (request.headers.host !== new URL(origin).host) fail('请通过终端显示的 127.0.0.1 地址打开编辑器。', 403);
      if (request.headers.origin && request.headers.origin !== origin) fail('不允许跨站访问编辑器。', 403);
      if (request.headers['sec-fetch-site'] === 'cross-site') fail('不允许跨站访问编辑器。', 403);
      const url = new URL(request.url, origin);
      if (url.pathname.startsWith('/api/')) {
        if (request.headers['x-editor-token'] !== token) fail('编辑会话无效，请刷新页面。', 403);
        if (url.pathname === '/api/featured' && request.method === 'GET') return send(200, featuredSnapshot());
        if (url.pathname === '/api/featured' && request.method === 'PUT') {
          let payload;
          try { payload = JSON.parse(await readBody(request, 1024 * 1024)); }
          catch (error) { if (error.status) throw error; fail('请求不是有效 JSON。'); }
          if (!object(payload) || !Array.isArray(payload.slugs) || !payload.slugs.every((slug) => typeof slug === 'string')) fail('首页项目列表格式无效。');
          const current = featuredSnapshot();
          if (payload.revision !== current.revision) fail('首页配置或项目资料已变化，请重新载入首页精选后再保存。', 409);
          if (new Set(payload.slugs).size !== payload.slugs.length || payload.slugs.some((slug) => !current.projects.some((project) => project.slug === slug))) fail('首页项目不能重复，且必须是已有项目。');
          writeJson(featuredFile, payload.slugs);
          return send(200, featuredSnapshot());
        }
        if (url.pathname === '/api/projects' && request.method === 'GET') return send(200, snapshot());
        if (url.pathname === '/api/projects' && ['PUT', 'POST', 'PATCH'].includes(request.method)) {
          let payload;
          try { payload = JSON.parse(await readBody(request, 1024 * 1024)); }
          catch (error) { if (error.status) throw error; fail('请求不是有效 JSON。'); }
          if (!object(payload)) fail('请求格式无效。');
          const reordering = request.method === 'PATCH';
          if (!reordering) validateProject(payload.project);
          // Synchronous compare + atomic rename keeps concurrent saves serialized in this local process.
          const current = snapshot();
          if (payload.revision !== current.revision) fail('文件已被其他窗口或程序修改。请保留当前内容，重新载入后再编辑。', 409);
          const creating = request.method === 'POST';
          if (reordering) {
            if (typeof payload.slug !== 'string' || ![-1, 1].includes(payload.direction)) fail('排序请求无效。');
            const index = current.projects.findIndex((project) => project.slug === payload.slug);
            if (index < 0) fail('找不到项目。', 404);
            const siblings = current.projects.map((project, position) => project.category === current.projects[index].category ? position : -1).filter((position) => position >= 0);
            const target = siblings[siblings.indexOf(index) + payload.direction];
            if (target === undefined) fail('项目已经位于该分类的最前或最后。');
            [current.projects[index], current.projects[target]] = [current.projects[target], current.projects[index]];
          } else {
            const index = current.projects.findIndex((project) => project.slug === payload.project.slug);
            if (creating && index >= 0) fail('项目地址已存在，请换一个地址。', 409);
            if (!creating && index < 0) fail('找不到项目；项目地址不能修改。', 404);
            for (const path of [payload.project.cover, ...(payload.project.gallery ?? []).map((item) => item.src)].filter(Boolean)) mediaFile(root, path);
            if (creating) current.projects.push(payload.project);
            else current.projects[index] = payload.project;
          }
          const savedRevision = writeJson(dataFile, current.projects);
          return send(creating ? 201 : 200, { ...(reordering ? { projects: current.projects } : { project: payload.project }), revision: savedRevision });
        }
        if (url.pathname === '/api/media' && request.method === 'POST') {
          const slug = url.searchParams.get('slug');
          if (!snapshot().projects.some((project) => project.slug === slug)) fail('找不到上传目标项目。');
          const bytes = await readBody(request, 10 * 1024 * 1024);
          const extension = imageExtension(bytes);
          const mediaRoot = realpathSync(join(root, 'public/media'));
          // Check each level before creating descendants; never follow a symlink out of media.
          let destination = mediaRoot;
          for (const part of ['editor', slug]) {
            destination = join(destination, part);
            mkdirSync(destination, { recursive: true });
            if (!realpathSync(destination).startsWith(mediaRoot + sep)) fail('上传目录无效。', 403);
          }
          const filename = randomUUID() + extension;
          writeFileSync(join(destination, filename), bytes, { flag: 'wx' });
          return send(201, { src: `/media/editor/${slug}/${filename}` });
        }
        return send(405, { error: '不支持此操作。' });
      }
      if (request.method !== 'GET') return send(405, { error: '不支持此操作。' });
      if (url.pathname === '/') {
        return send(200, readFileSync(join(directory, 'index.html'), 'utf8').replace('__EDITOR_TOKEN__', token), 'text/html; charset=utf-8');
      }
      if (['/editor.js', '/editor.css'].includes(url.pathname)) {
        return send(200, readFileSync(join(directory, url.pathname.slice(1))), url.pathname.endsWith('.js') ? 'text/javascript' : 'text/css');
      }
      if (url.pathname.startsWith('/media/')) {
        return send(200, readFileSync(mediaFile(root, url.pathname)), mimeTypes[extname(url.pathname)]);
      }
      return send(404, { error: '页面不存在。' });
    } catch (error) {
      const status = error.status ?? (error.code === 'ENOENT' ? 404 : 500);
      send(status, { error: status === 500 ? '读写失败，请检查终端和文件权限。内容尚未确认保存。' : error.message });
      if (status === 500) console.error(error);
    }
  });
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createEditorServer();
  let preview;
  server.on('error', (error) => { console.error('编辑器启动失败：', error.message); process.exitCode = 1; });
  server.listen(4310, '127.0.0.1', () => {
    console.log('\n项目编辑器：http://127.0.0.1:4310\n网站预览：http://localhost:3000\n按 Ctrl+C 停止。\n');
    if (!process.argv.includes('--no-preview')) {
      preview = spawn('pnpm', ['run', 'dev', '--', '--port', '3000'], { cwd: resolve(directory, '../..'), stdio: 'inherit', detached: true });
      preview.on('error', (error) => console.error('预览启动失败，请单独运行 pnpm dev：', error.message));
      preview.on('exit', (code) => { if (code) console.error('预览进程退出；编辑器仍可保存内容。请检查 3000 端口或运行 pnpm dev。'); });
    }
  });
  const stop = () => {
    if (preview?.pid) { try { process.kill(-preview.pid, 'SIGTERM'); } catch {} }
    server.close();
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}
