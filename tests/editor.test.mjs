import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { get } from 'node:http';
import { dirname, join } from 'node:path';
import { createEditorServer } from '../scripts/editor/server.mjs';

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');

test('local editor validates requests, saves atomically, detects conflicts and isolates uploads', async (t) => {
  const root = mkdtempSync(join(tmpdir(), 'portfolio-editor-'));
  const data = JSON.parse(readFileSync(new URL('../lib/projects/data.json', import.meta.url)));
  mkdirSync(join(root, 'lib/projects'), { recursive: true });
  const dataFile = join(root, 'lib/projects/data.json');
  writeFileSync(dataFile, JSON.stringify(data));
  for (const project of data) {
    for (const src of [project.cover, ...(project.gallery ?? []).map((item) => item.src)].filter(Boolean)) {
      const file = join(root, 'public', src); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, png);
    }
  }
  const server = createEditorServer(root);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await new Promise((resolve) => server.close(resolve)); rmSync(root, { recursive: true, force: true }); });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const html = await (await fetch(origin)).text();
  const token = html.match(/name="editor-token" content="([^"]+)"/)[1];
  const headers = { 'X-Editor-Token': token, 'Content-Type': 'application/json' };
  const read = async () => (await fetch(`${origin}/api/projects`, { headers })).json();
  const save = (project, revision) => fetch(`${origin}/api/projects`, { method: 'PUT', headers, body: JSON.stringify({ project, revision }) });
  assert.equal((await fetch(`${origin}/api/projects`)).status, 403);
  assert.equal((await fetch(`${origin}/api/projects`, { headers: { ...headers, Origin: 'https://example.com' } })).status, 403);
  const hostileHostStatus = await new Promise((resolve, reject) => {
    get(origin, { headers: { Host: 'attacker.example' } }, (response) => {
      response.resume(); resolve(response.statusCode);
    }).on('error', reject);
  });
  assert.equal(hostileHostStatus, 403);
  assert.equal((await fetch(`${origin}/lib/projects/data.json`)).status, 404);
  let state = await read();
  // Every existing record must survive validation and a round-trip unchanged.
  for (const project of state.projects) {
    const response = await save(project, state.revision);
    assert.equal(response.status, 200, await response.clone().text());
    state.revision = (await response.json()).revision;
  }
  assert.deepEqual((await read()).projects, data);
  const changed = { ...data[0], title: 'Edited title', highlights: ['A useful outcome'], sections: [{ label: '01', title: 'New chapter', body: ['First paragraph', 'Second paragraph'], points: ['One point'] }], showSections: true };
  const oldRevision = state.revision;
  const result = await save(changed, oldRevision);
  assert.equal(result.status, 200);
  state = await read();
  assert.deepEqual(state.projects[0], changed);
  assert.equal((await save({ ...changed, title: 'Stale write' }, oldRevision)).status, 409);
  for (const invalid of [
    { ...changed, title: '' }, { ...changed, hidden: 'yes' },
    { ...changed, slug: '../escape' }, { ...changed, category: 'invented' },
    { ...changed, links: [{ label: 'Unsafe', href: 'javascript:alert(1)' }] },
    { ...changed, cover: '/media/../../private.png' },
    { ...changed, sections: [{ label: 'x', title: 'y', body: 'not an array' }] },
  ]) assert.equal((await save(invalid, state.revision)).status, 400);
  assert.deepEqual((await read()).projects[0], changed);
  const upload = (body, slug = changed.slug) => fetch(`${origin}/api/media?slug=${slug}`, { method: 'POST', headers: { 'X-Editor-Token': token }, body });
  assert.equal((await upload('<svg onload="alert(1)"></svg>')).status, 400);
  assert.equal((await upload(png, '../outside')).status, 400);
  const first = await (await upload(png)).json();
  const second = await (await upload(png)).json();
  assert.notEqual(first.src, second.src);
  assert.deepEqual(Buffer.from(await (await fetch(origin + first.src)).arrayBuffer()), png);
  const withMedia = { ...changed, cover: first.src, gallery: [{ src: second.src, alt: 'New image', caption: 'Caption' }] };
  assert.equal((await save(withMedia, state.revision)).status, 200);
  state = await read();
  assert.equal((await save({ ...withMedia, hidden: true }, state.revision)).status, 200);
  assert.equal((await read()).projects[0].hidden, true);
  const outside = join(root, 'outside.png'); writeFileSync(outside, png);
  symlinkSync(outside, join(root, 'public/media/escape.png'));
  assert.equal((await fetch(`${origin}/media/escape.png`)).status, 403);
  assert.equal((await save({ ...changed, cover: '/media/escape.png' }, (await read()).revision)).status, 403);
  assert.deepEqual(readFileSync(join(root, 'public', first.src)), png);
});
