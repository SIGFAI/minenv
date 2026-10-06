// MineNV / Mojavecraft (polysilicon, MIT): real Minecraft 26.3 running hidden next to Fallout: New Vegas and drawn
// inside it (xNVSE plugin OverworldSupplyLine.dll + a Fabric mod, linked over 127.0.0.1:25599 and the shared memory
// Local\OSLFrame), with a Go launcher that resolves form IDs from the player's FalloutNV.esm and starts xNVSE.
// No upstream release: SIGF built the three binaries from the pinned commit on a disposable AWS builder (library/QC.md
// section 4; source.json "built"), no change to upstream's source. Minecraft runs in the app's Prism instance instead
// of upstream's bundled portable Prism, so the launcher is started without --mc (it then never starts Prism itself).
// Upstream never ran the plugin in real New Vegas (only the Minecraft side, against tools/fake_newvegas.py): beta.
//   SIGF_LIBRARY_BUILDS=<dir> node library/minenv/build.mjs      (outputs: library/lib.mjs)
import { mrpack, resolveFabricApi } from '../../orchestrator/src/recipe.js';
import { asset, card, dl, emit, player, zipAsset } from '../lib.mjs';
import { builtArtifacts, builtField, sourceOf } from '../um-gta5-passthrough/sigf-build.mjs';

const ID = 'minenv', VERSION = '0.1.0', NAME = 'Mojavecraft (MineNV)';
const SRC = sourceOf(ID);
const UP = { repo: SRC.repo, commit: SRC.commit, authors: ['polysilicon'] };
const MC = { mc: '26.3', loader: '0.19.5', fabricApi: '0.161.0+26.3', java: '25' }; // minecraft/gradle.properties at the commit
const JAR = 'osl-0.1.0.jar';
const TAGLINE = 'Real Minecraft inside Fallout: New Vegas: build with Minecraft blocks on the Mojave, salvage junk into Minecraft items, unlock Courier perks.';
// Upstream's osl.ini values (tools/package.py), which are also the plugin's defaults (newvegas/src/main.cpp:399-401).
const OSL_INI = [
  '; Overworld Supply Line: settings for the New Vegas plugin.',
  '[Composite]',
  '; 1: New Vegas objects in front hide Minecraft blocks. 0: Minecraft is always drawn on top.',
  'bDepthTest=1',
  '; How far (game units, 70 = one block) behind New Vegas\'s surface a Minecraft block may still show.',
  'iDepthBiasUnits=2',
  '',
].join('\r\n');

const files = builtArtifacts(ID);
// Upstream's own layout (tools/package.py): the plugin and its ini in Data/NVSE/Plugins, the launcher and notices in OSL/.
const fnv = zipAsset(`${ID}-falloutnv.zip`, [
  { name: 'Data/NVSE/Plugins/OverworldSupplyLine.dll', data: files.get('OverworldSupplyLine.dll') },
  { name: 'Data/NVSE/Plugins/osl.ini', data: Buffer.from(OSL_INI) },
  { name: 'OSL/osl-launch.exe', data: files.get('osl-launch.exe') },
  { name: 'OSL/LICENSE.txt', data: files.get('LICENSE') },
  { name: 'OSL/THIRD-PARTY-NOTICES.md', data: files.get('THIRD-PARTY-NOTICES.md') },
]);
const pack = async (offline) => {
  const fabricApi = offline ? null : await resolveFabricApi(MC.fabricApi, MC.mc);
  if (!offline && !fabricApi?.download) throw new Error(`Fabric API ${MC.fabricApi} not resolved on Modrinth`);
  return asset(`${ID}.mrpack`, mrpack({ name: NAME, summary: TAGLINE, versions: MC, versionId: VERSION, fabricApi,
    jars: [{ name: JAR, data: files.get(JAR) }], extra: [{ name: 'overrides/licenses/minenv-LICENSE.txt', data: files.get('LICENSE') }] }));
};
const assets = [fnv, await pack(false)];

const make = (urls, set) => {
  const mp = set.find(a => a.name.endsWith('.mrpack'));
  return {
    id: `sigf/${ID}`,
    version: VERSION,
    name: NAME,
    tagline: player(ID).tagline ?? TAGLINE,
    how_to_play: player(ID).howToPlay,
    kind: 'passthrough',
    games: [
      { game: 'falloutnv', role: 'host', label: 'Fallout: New Vegas', engine: 'Fallout: New Vegas (Gamebryo, D3D9, x86) + xNVSE plugin OverworldSupplyLine (C++) + Go launcher', apps: { steam: '22380' }, runtime: '1.4.0.525 only (the plugin refuses other runtimes); Steam or GOG' },
      { game: 'minecraft', role: 'guest', label: 'Minecraft', engine: 'Minecraft Java 26.3 + Fabric mod osl (Java)', mc: MC.mc, loader: `fabric@${MC.loader}`, java: MC.java },
    ],
    requires: [
      // The format has no presence check for a prerequisite file: launch exe checks only cover the exe itself (ours), and
      // they run after Minecraft has started. So xNVSE is a player prerequisite, first card note.
      { id: 'xnvse', version: '6.4.9 or newer', page: 'https://github.com/xNVSE/NVSE/releases', license: 'linked, not shipped', note: 'install it yourself before Play: nvse_loader.exe and its DLLs in the New Vegas folder (the app neither installs nor checks it; without it New Vegas never opens)' },
      { id: 'fabric-loader', version: MC.loader },
      { id: 'fabric-api', version: MC.fabricApi, note: 'in the Minecraft pack (downloaded from Modrinth)' },
    ],
    install: [
      { game: 'falloutnv', strategy: 'game-dir-snapshot', loader: 'xnvse', files: [
        { src: fnv.name, dst: '{game}', unpack: true, contents: fnv.contents, ...dl(fnv, urls) },
      ] },
      // -Dosl.startHidden=true: the window is hidden from the start and Minecraft quits 30 s after New Vegas goes
      // (upstream's instance.cfg; its --enable-native-access is not on the app's whitelist and only silences a warning).
      { game: 'minecraft', strategy: 'mrpack', jvm_args: ['-Dosl.startHidden=true'], pack: { src: mp.name, ...dl(mp, urls) } },
    ],
    // Minecraft first (its mod serves the link on 127.0.0.1:25599). Then upstream's launcher, without --mc: it writes
    // Data/NVSE/Plugins/osl_forms.ini from the player's FalloutNV.esm and starts nvse_loader.exe.
    launch: [
      { game: 'minecraft', wait: 'port:25599' },
      { game: 'falloutnv', exe: 'OSL/osl-launch.exe', args: ['--fnv', '{game}'] },
    ],
    files: set.map(a => ({ name: a.name, ...dl(a, urls) })),
    source: {
      repo: UP.repo, license: 'MIT', upstream_license: SRC.license, commit: UP.commit,
      hosted: `https://github.com/SIGFAI/${ID}`,
      based_on: 'https://github.com/rehan-remade/universal-modder',
      built: builtField(ID),
    },
    media: {},
    built_by: { author: UP.authors[0], authors: [...UP.authors, 'Rehan and universal-modder contributors'], packaged_by: 'SIGF' },
    idea_by: UP.authors[0],
    built_at: '2026-10-06T00:00:00.000Z',
    ...card(UP.repo),
    notes: player(ID).notes,
  };
};

emit({ slug: ID, version: VERSION, assets, make });
