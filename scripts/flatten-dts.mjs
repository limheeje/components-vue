// vue-tsc 는 rootDir="src" 기준으로 dist/components/<Name>/ 와 dist/lib/ 에 선언을 방출한다.
// package.json exports 의 types 경로(dist/<Name>/index.d.ts)에 맞게 한 단계 끌어올리고,
// 소스의 `~/` 절대경로 참조를 flatten 후 정합성에 맞는 상대경로로 되돌린다.
import {existsSync} from 'node:fs'
import {cp, readdir, readFile, rm, writeFile} from 'node:fs/promises'
import {fileURLToPath, URL} from 'node:url'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const nested = `${dist}components/`
if (!existsSync(nested)) process.exit(0)

async function walk(dir) {
  const out = []
  for (const ent of await readdir(dir, {withFileTypes: true})) {
    const p = `${dir}${ent.name}`
    if (ent.isDirectory()) out.push(...(await walk(`${p}/`)))
    else if (ent.name.endsWith('.d.ts')) out.push(p)
  }
  return out
}

for (const name of await readdir(nested)) {
  await cp(`${nested}${name}`, `${dist}${name}`, {recursive: true})
}
await rm(nested, {recursive: true, force: true})

for (const file of await walk(dist)) {
  // dist/<Name>/xxx.d.ts → 자기 컴포넌트명
  const self = file.slice(dist.length).split(/[/\\]/)[0]
  let src = await readFile(file, 'utf8')

  // 토큰 side-effect import 제거 (값은 dist/style.css 에 이미 인라인됨)
  src = src.replace(/^\s*import\s+['"]~\/assets\/[^'"]+['"];?\s*$/gm, '')

  // ~/components/<X>/  →  자기면 ./  아니면 ../<X>/
  src = src.replace(/(from\s+['"]|import\(['"])~\/components\/([A-Za-z0-9_-]+)\//g, (_m, prefix, comp) =>
    comp === self ? `${prefix}./` : `${prefix}../${comp}/`
  )
  // ~/lib/  →  ../lib/
  src = src.replace(/(from\s+['"]|import\(['"])~\/lib\//g, '$1../lib/')

  await writeFile(file, src)
}
