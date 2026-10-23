import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { installSkills, verifySkills } from './skills.mjs';

test('fontes fixadas têm frontmatter, referências e integridade válidos', async () => {
  const manifest = await verifySkills();
  assert.equal(manifest.skills.length, 5);
  assert(manifest.sources.every(source => /^[a-f0-9]{40}$/.test(source.revision)));
});

test('instalação produz skills autocontidas e preserva arquivos alheios', async () => {
  const destination = await mkdtemp(join(tmpdir(), 'radar-skills-'));
  try {
    await writeFile(join(destination, 'arquivo-do-usuario.txt'), 'preservar');
    const names = await installSkills(destination);
    for (const name of names) {
      const markdown = await readFile(join(destination, name, 'SKILL.md'), 'utf8');
      assert(markdown.includes(`name: ${name}`));
      assert(!markdown.includes('../../references/'));
      assert((await readFile(join(destination, name, 'LICENSE'), 'utf8')).length > 0);
    }
    const reference = await readFile(join(destination, 'incremental-implementation', 'references', 'definition-of-done.md'), 'utf8');
    assert(reference.length > 0);
    assert.equal(await readFile(join(destination, 'arquivo-do-usuario.txt'), 'utf8'), 'preservar');
    await installSkills(destination);
    assert.equal(await readFile(join(destination, 'arquivo-do-usuario.txt'), 'utf8'), 'preservar');
  } finally {
    await rm(destination, { recursive: true, force: true });
  }
});

test('verificação recusa arquivo alterado antes de qualquer instalação', async () => {
  const root = await mkdtemp(join(tmpdir(), 'radar-skills-invalid-'));
  try {
    await writeFile(join(root, 'alterado.md'), 'conteúdo diferente');
    await writeFile(join(root, 'manifest.json'), JSON.stringify({
      files: [{ path: 'alterado.md', gitBlob: '0000000000000000000000000000000000000000' }], skills: [],
    }));
    await assert.rejects(verifySkills(root), /Conteúdo alterado/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
