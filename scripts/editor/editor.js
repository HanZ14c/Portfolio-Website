const token = document.querySelector('meta[name="editor-token"]').content;
const $ = (selector) => document.querySelector(selector);
const categories = ['Computer Science', 'Academic Architecture', 'Architecture Practice', 'Visual Studies'];
let projects = [], revision = '', draft, baseline = '', busy = false;
const dirty = () => draft && JSON.stringify(draft) !== baseline;
const clone = (value) => structuredClone(value);

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function notice(message = '') {
  $('#message').textContent = message;
  $('#message').hidden = !message;
}
async function api(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { 'X-Editor-Token': token, ...options.headers } });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? '请求失败，请重试。');
  return result;
}
function updateStatus() {
  $('#new-project').disabled = busy || !revision;
  $('#create-fields').disabled = busy;
  $('#save').disabled = busy || !dirty();
  $('#reload').disabled = busy;
  $('#fields').disabled = busy || !draft;
  $('#status').textContent = busy ? '正在处理，请稍候…' : !draft ? (revision ? '点击新增项目开始' : '未能载入项目，请重试') : dirty() ? '有未保存的更改' : '已与本地文件同步';
  const saved = projects.find((project) => project.slug === draft?.slug);
  $('#preview').setAttribute('aria-disabled', String(!saved || Boolean(saved.hidden)));
  if (saved && !saved.hidden) $('#preview').href = `http://localhost:3000/work/${saved.slug}`;
  else $('#preview').removeAttribute('href');
}
function change(object, key, value) { object[key] = value; updateStatus(); }
function field(label, object, key, { multiline = false, lines = false, paragraphs = false, type = 'text', required = false, readonly = false, choices } = {}) {
  const wrapper = element('label', undefined, 'field');
  wrapper.append(element('span', label));
  const input = element(choices ? 'select' : multiline || lines || paragraphs ? 'textarea' : 'input');
  if (choices) {
    for (const choice of choices) {
      const [value, title] = Array.isArray(choice) ? choice : [choice, choice];
      const option = element('option', title); option.value = value; input.append(option);
    }
  } else if (input.tagName === 'INPUT') input.type = type;
  const value = object[key] ?? (lines || paragraphs ? [] : '');
  input.value = lines ? value.join('\n') : paragraphs ? value.join('\n\n') : value;
  input.required = required;
  input.readOnly = readonly;
  if (input.tagName === 'TEXTAREA') input.rows = paragraphs ? 6 : 3;
  input.addEventListener('input', () => {
    const value = lines ? input.value.split('\n').map((line) => line.trim()).filter(Boolean)
      : paragraphs ? input.value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean) : input.value;
    if (choices && value === '') delete object[key];
    else object[key] = value;
    updateStatus();
  });
  wrapper.append(input);
  return wrapper;
}
function check(label, key, defaultValue = false) {
  const wrapper = element('label', undefined, 'check');
  const input = element('input'); input.type = 'checkbox'; input.checked = draft[key] ?? defaultValue;
  input.addEventListener('change', () => change(draft, key, input.checked));
  wrapper.append(input, element('span', label)); return wrapper;
}
function button(label, action, className) {
  const node = element('button', label, className); node.type = 'button';
  node.addEventListener('click', action); return node;
}
function block(title, ...children) {
  const section = element('details'); section.open = true;
  section.append(element('summary', title), ...children); return section;
}
function grid(...children) { const node = element('div', undefined, 'grid'); node.append(...children); return node; }
function repeatItems(key, label, blank, renderItem) {
  const container = element('div');
  const values = draft[key] ?? [];
  values.forEach((item, index) => {
    const card = element('div', undefined, 'item');
    const header = element('div', undefined, 'item-header');
    const actions = element('div', undefined, 'item-actions');
    for (const [offset, title] of [[-1, '上移'], [1, '下移']]) {
      const move = button(title, () => {
        [values[index], values[index + offset]] = [values[index + offset], values[index]];
        render();
      });
      move.setAttribute('aria-label', `${label} ${index + 1} ${title}`);
      move.disabled = index + offset < 0 || index + offset >= values.length;
      actions.append(move);
    }
    const remove = button('移除', () => {
      if (!confirm(`移除${label} ${index + 1}？保存前可用“重新载入”恢复。`)) return;
      values.splice(index, 1); render();
    }, 'danger');
    remove.setAttribute('aria-label', `移除${label} ${index + 1}`);
    actions.append(remove); header.append(element('h3', `${label} ${index + 1}`), actions);
    card.append(header, ...renderItem(item, index)); container.append(card);
  });
  if (!values.length) container.append(element('p', `尚未添加${label}。`, 'empty'));
  if (blank) container.append(button(`添加${label}`, () => {
    draft[key] ??= []; draft[key].push(clone(blank)); render();
  }));
  return container;
}
function image(src) {
  const node = element('img', undefined, 'image-preview'); node.src = src; node.alt = '素材预览'; node.loading = 'lazy'; return node;
}
function uploader(label, multiple, onUpload) {
  const wrapper = element('label', undefined, 'field upload');
  const input = element('input'); input.type = 'file'; input.accept = 'image/jpeg,image/png,image/webp,image/gif'; input.multiple = multiple;
  input.addEventListener('change', async () => {
    busy = true; updateStatus(); notice();
    try {
      for (const file of input.files) {
        if (file.size > 10 * 1024 * 1024) throw new Error(`${file.name} 超过 10 MB，请先压缩。`);
        const result = await api(`/api/media?slug=${encodeURIComponent(draft.slug)}`, { method: 'POST', body: file });
        onUpload(result.src);
      }
      notice('图片已上传到本地。请保存项目以应用图片修改。');
    } catch (error) { notice(error.message); }
    finally { busy = false; render(); }
  });
  wrapper.append(element('span', label), input, element('small', 'JPG / PNG / WebP / GIF，每张最多 10 MB。')); return wrapper;
}
function renderNavigation() {
  const nav = $('#projects'); nav.replaceChildren();
  const query = $('#search').value.toLowerCase();
  for (const project of projects.filter((project) => `${project.title} ${project.category} ${project.slug}`.toLowerCase().includes(query))) {
    const node = button(project.title, () => {
      if (busy || project.slug === draft?.slug) return;
      if (dirty() && !confirm('当前项目有未保存更改。放弃这些更改并切换项目？')) return;
      selectProject(project); notice(); window.scrollTo(0, 0);
    });
    node.setAttribute('aria-current', String(project.slug === draft?.slug));
    node.append(element('small', `${project.hidden ? '隐藏 · ' : ''}${project.category}`)); nav.append(node);
  }
  if (!nav.children.length) nav.append(element('p', '没有匹配的项目。', 'empty'));
}
function selectProject(project) { draft = clone(project); baseline = JSON.stringify(draft); render(); }
function render() {
  $('#project-title').textContent = draft.title;
  $('#project-category').textContent = draft.category;
  renderNavigation();
  const basics = block('01 / 基本信息',
    field('项目标题', draft, 'title', { required: true }),
    field('副标题', draft, 'subtitle'),
    grid(field('分类', draft, 'category', { choices: categories }), field('项目地址（固定）', draft, 'slug', { readonly: true })),
    grid(field('年份 / 时间（用于排序）', draft, 'time'), field('展示时间', draft, 'period')),
    grid(field('地点', draft, 'location'), field('项目状态', draft, 'status')),
    field('担任角色', draft, 'role'),
    field('卡片摘要', draft, 'excerpt', { multiline: true }),
    field('项目介绍 / 核心陈述', draft, 'statement', { multiline: true }));
  const content = block('02 / 正文与亮点',
    element('p', '段落之间空一行；要点与亮点每行一条。关闭正文展示时，已有章节仍会保留。', 'hint'),
    field('项目亮点（每行一条）', draft, 'highlights', { lines: true }),
    check('显示正文章节', 'showSections'),
    repeatItems('sections', '章节', { label: '', title: '', body: [], points: [] }, (section) => [
      grid(field('章节标签', section, 'label'), field('章节标题', section, 'title')),
      field('正文（空行分段）', section, 'body', { paragraphs: true }),
      field('章节要点（每行一条）', section, 'points', { lines: true }),
    ]));
  const facts = block('03 / 项目资料与链接',
    repeatItems('facts', '资料', { label: '', value: '' }, (fact) => [grid(field('资料名称', fact, 'label'), field('资料内容', fact, 'value'))]),
    repeatItems('links', '链接', { label: '', href: 'https://' }, (link) => [grid(field('链接名称', link, 'label'), field('链接地址', link, 'href', { required: true }))]));
  const cover = element('div');
  if (draft.cover) cover.append(image(draft.cover));
  cover.append(field('封面路径', draft, 'cover'), field('封面替代文字', draft, 'coverAlt'),
    uploader('上传 / 替换封面', false, (src) => { draft.cover = src; }),
    check('完整显示封面（不裁切）', 'containCover'));
  if (draft.cover) cover.append(button('移除封面引用', () => { delete draft.cover; render(); }));
  const gallery = block('04 / 封面与图库', cover,
    element('p', '替换或移除只改变项目引用，原始文件会保留。新增图片上传后也需要保存项目。', 'hint'),
    check('显示图库', 'showGallery', true),
    grid(field('图库标签', draft, 'galleryLabel'), field('图库标题', draft, 'galleryTitle')),
    field('图库布局', draft, 'galleryLayout', { choices: [['', '普通图库'], ['process-triptych', '前三张并排，其余逐张展示']] }),
    repeatItems('gallery', '图片', { src: '', alt: '', caption: '' }, (item) => [
      ...(item.src ? [image(item.src)] : []), field('图片路径', item, 'src', { required: true }),
      field('图片替代文字', item, 'alt'), field('图片说明', item, 'caption'),
      uploader('替换这张图片', false, (src) => { item.src = src; }),
    ]),
    uploader('上传图片到图库（可多选）', true, (src) => { draft.gallery ??= []; draft.gallery.push({ src, alt: '', caption: '' }); }));
  const display = block('05 / 展示设置',
    check('隐藏项目（从索引和首页精选移除）', 'hidden'),
    check('纯图片展示（隐藏介绍、亮点、资料和正文）', 'visualOnly'),
    element('p', '隐藏项目的详情页返回 404；需要公开并保存后才能在网站中预览。', 'hint'),
    grid(field('主题颜色', draft, 'accent', { type: 'color' }), field('代码卡片颜色（可选，例 #c7d7e6）', draft, 'codeAccent')),
    field('卡片尺寸', draft, 'cardSize', { choices: [['', '默认'], ['standard', '标准'], ['wide', '宽卡片']] }));
  $('#fields').replaceChildren(basics, content, facts, gallery, display);
  updateStatus();
}
async function load() {
  busy = true; updateStatus();
  try {
    const data = await api('/api/projects'); projects = data.projects; revision = data.revision;
    const selected = projects.find((project) => project.slug === draft?.slug) ?? projects[0];
    if (selected) selectProject(selected);
    else {
      draft = undefined; baseline = ''; renderNavigation(); $('#fields').replaceChildren();
      $('#project-title').textContent = '暂无项目'; $('#project-category').textContent = 'PORTFOLIO';
    }
  } catch (error) { notice(error.message); }
  finally { busy = false; updateStatus(); }
}
$('#editor').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!dirty() || busy) return;
  busy = true; updateStatus(); notice();
  try {
    const saved = clone(draft);
    for (const key of ['cover', 'codeAccent']) if (saved[key] === '') delete saved[key];
    const result = await api('/api/projects', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project: saved, revision }) });
    revision = result.revision;
    projects[projects.findIndex((project) => project.slug === saved.slug)] = result.project;
    selectProject(result.project);
    notice('已保存到本地。预览页面可查看保存后的效果；线上网站尚未发布。');
  } catch (error) { notice(error.message); }
  finally { busy = false; updateStatus(); }
});
$('#reload').addEventListener('click', () => {
  if (dirty() && !confirm('重新载入将放弃当前未保存的更改。继续？')) return;
  notice(); load();
});
$('#preview').addEventListener('click', (event) => {
  if ($('#preview').getAttribute('aria-disabled') === 'true') { event.preventDefault(); notice('此项目目前隐藏。取消隐藏并保存后即可预览。'); }
});
$('#search').addEventListener('input', renderNavigation);
for (const category of categories) {
  const option = element('option', category); option.value = category; $('#new-category').append(option);
}
$('#new-project').addEventListener('click', () => {
  if (busy || !revision) return;
  if (dirty() && !confirm('当前项目有未保存更改。创建成功后将放弃这些更改，继续？')) return;
  $('#create-project').reset();
  $('#create-error').hidden = true;
  $('#create-dialog').showModal();
});
$('#cancel-create').addEventListener('click', () => $('#create-dialog').close());
$('#create-dialog').addEventListener('cancel', (event) => { if (busy) event.preventDefault(); });
$('#create-project').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy) return;
  const form = new FormData(event.currentTarget);
  const project = {
    title: form.get('title').trim(), slug: form.get('slug').trim(), category: form.get('category'),
    subtitle: '', time: '', period: '', role: '', status: '', excerpt: '', statement: '',
    accent: '#315f94', hidden: true, showSections: true, facts: [], sections: [],
  };
  busy = true; updateStatus(); $('#create-error').hidden = true;
  try {
    const result = await api('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project, revision }) });
    revision = result.revision; projects.push(result.project); $('#search').value = '';
    selectProject(result.project); $('#create-dialog').close();
    notice('项目已创建为隐藏草稿。可以继续编辑内容和上传图片；准备好后取消隐藏并保存。');
    window.scrollTo(0, 0);
  } catch (error) {
    $('#create-error').textContent = error.message; $('#create-error').hidden = false;
  } finally { busy = false; updateStatus(); }
});
window.addEventListener('beforeunload', (event) => { if (dirty() || busy) { event.preventDefault(); event.returnValue = ''; } });
await load();
