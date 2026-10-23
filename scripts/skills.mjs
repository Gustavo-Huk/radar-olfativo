import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const skillsRoot = fileURLToPath(new URL('../skills/', import.meta.url));
const projectRoot = fileURLToPath(new URL('../', import.meta.url));

function inside(root, path) {
  const target = resolve(root, path);
  const child = relative(root, target);
  if (isAbsolute(path) || child === '..' || child.startsWith('../') || child.startsWith('..\\')) {
    throw new Error(`Caminho fora da pasta de skills: ${path}`);
  }
  return target;
}

export async function verifySkills(root = skillsRoot) {
  const manifest = JSON.parse(await readFile(resolve(root, 'manifest.json'), 'utf8'));
  const errors = [];
  for (const entry of manifest.files) {
    try {
      const bytes = await readFile(inside(root, entry.path));
      const hash = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
      if (hash !== entry.gitBlob) errors.push(`Conteúdo alterado: ${entry.path}`);
    } catch (error) {
      errors.push(`Arquivo indisponível: ${entry.path} (${error.message})`);
    }
  }
  const names = new Set();
  for (const skill of manifest.skills) {
    if (names.has(skill.name) || !/^[a-z0-9-]+$/.test(skill.name)) errors.push(`Nome de skill inválido ou repetido: ${skill.name}`);
    names.add(skill.name);
    const base = inside(root, skill.path);
    const markdown = await readFile(resolve(base, 'SKILL.md'), 'utf8');
    if (!markdown.startsWith('---\n') || !markdown.includes(`\nname: ${skill.name}\n`)) errors.push(`Frontmatter inválido: ${skill.name}`);
    // As referências próprias do playbook precisam estar presentes. Menções a
    // arquivos do produto (PRODUCT.md, DESIGN.md) não são arquivos da skill.
    const links = [...markdown.matchAll(/(?:\]\(|`)((?:\.\.\/\.\.\/references\/|reference\/)[^\s)`#]+\.md)/g)];
    for (const [, link] of links) {
      try { await readFile(inside(root, relative(root, resolve(base, link)))); }
      catch { errors.push(`Referência ausente em ${skill.name}: ${link}`); }
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return manifest;
}

/** A pasta de destino é explícita para permitir testar sem alterar instalações reais. */
export async function installSkills(destination, root = skillsRoot) {
  const manifest = await verifySkills(root);
  for (const skill of manifest.skills) {
    const source = inside(root, skill.path);
    const target = inside(destination, skill.name);
    await mkdir(target, { recursive: true });
    await cp(source, target, { recursive: true, force: true });
    const origin = manifest.sources.find(entry => entry.id === skill.source);
    if (origin) await cp(inside(root, `${origin.root}/LICENSE`), resolve(target, 'LICENSE'));
    if (skill.sharedReferences) {
      // A instalação isolada não carrega ../../references do pacote Addy.
      // Copiar e ajustar só esses links mantém cada skill autocontida.
      await cp(inside(root, skill.sharedReferences), resolve(target, 'references'), { recursive: true, force: true });
      const entry = resolve(target, 'SKILL.md');
      const markdown = await readFile(entry, 'utf8');
      await writeFile(entry, markdown.replaceAll('../../references/', 'references/'));
    }
  }
  return manifest.skills.map(skill => skill.name);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const command = process.argv[2] ?? 'verify';
    if (command === 'verify') {
      const manifest = await verifySkills();
      console.log(`${manifest.skills.length} skills e ${manifest.files.length} arquivos: integridade e referências conferidas.`);
    } else if (command === 'install') {
      const destination = resolve(projectRoot, '.agents/skills');
      const names = await installSkills(destination);
      console.log(`Skills instaladas em ${relative(projectRoot, destination)}: ${names.join(', ')}.`);
      console.log('Abra uma nova conversa do projeto para atualizar a descoberta de skills.');
    } else {
      throw new Error('Use verify ou install.');
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
