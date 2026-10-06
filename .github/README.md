# Mojavecraft (MineNV)

Real Minecraft inside Fallout: New Vegas: build with Minecraft blocks on the Mojave, salvage junk into Minecraft items, unlock Courier perks.

**Mojavecraft (MineNV) is made by [polysilicon](https://github.com/polysilicon).** All credit for the mod goes to them. It is built on [rehan-remade/universal-modder](https://github.com/rehan-remade/universal-modder) by Rehan and universal-modder contributors.

- Original project: https://github.com/polysilicon/MineNV
- Report bugs and ask questions there: https://github.com/polysilicon/MineNV/issues
- Upstream version packaged here: 0.1.0 (commit [`85c6b3e`](https://github.com/polysilicon/MineNV/tree/85c6b3e275d14f8b8de9a3c1171fb65b512dd0c6))
- **Built by SIGF from commit [`85c6b3e275d14f8b8de9a3c1171fb65b512dd0c6`](https://github.com/polysilicon/MineNV/tree/85c6b3e275d14f8b8de9a3c1171fb65b512dd0c6)**, on a disposable build machine (AWS EC2 i-00060cf3f910425e5 (c6i.xlarge, Windows Server 2022, terminated after the build); JDK Temurin 25.0.4.1+1 + Gradle 9.7.1 wrapper (Loom 1.18.2), MSVC 19.44.35229 x86 (/Brepro), Go 1.27.1). The app installs these SIGF builds, not binaries from the author.

> **Beta.** Nobody at SIGF has played this build yet. Back up your saves.
> Bugs in the mod itself go to the author's issue tracker above; problems with the one-click install go to this repository's issues.

## What you need

- **Fallout: New Vegas** ([Steam](https://store.steampowered.com/app/22380/)): 1.4.0.525 only (the plugin refuses other runtimes); Steam or GOG.
- **Minecraft**: Java Edition 26.3.
- xnvse 6.4.9 or newer: install it yourself before Play: nvse_loader.exe and its DLLs in the New Vegas folder (the app neither installs nor checks it; without it New Vegas never opens) (https://github.com/xNVSE/NVSE/releases).
- Windows and the [SIGF app](https://sigf.ai). The app installs fabric-loader 0.19.5, fabric-api 0.161.0+26.3 for you.

## Install

In the SIGF app, open **Mojavecraft (MineNV)** in the catalog, press **Install**, then **Play**. **Restore** puts your game folders back exactly as they were.
The app follows `mashup.json` in this repository: every download is pinned by sha256. The files come from the release [`v0.1.0`](../../releases/tag/v0.1.0).

### How to play

- Real Minecraft 26.3 runs hidden behind Fallout: New Vegas and is drawn inside it: place and break Minecraft blocks on the Mojave's own ground.
- Press Play: Minecraft starts hidden, then New Vegas. Load a save and go outdoors; "Minecraft is linked." appears when both are connected.
- B toggles build mode (outdoors only): left click breaks, right click places, 1-9 pick a block, I opens Minecraft's inventory (Esc or I closes it).
- J salvages New Vegas junk (scrap metal, tin cans, Wonderglue...) into Minecraft items. A farm, a house and a lit beacon unlock Courier perks.
- Four early New Vegas quests (Ain't That a Kick in the Head, Back in the Saddle...) drop a Fallout-themed Minecraft chest next to you.

### Good to know

- Install xNVSE 6.4.9 or newer yourself first (nvse_loader.exe in the New Vegas folder, github.com/xNVSE/NVSE/releases): the app neither installs nor checks it. Without it Play starts a hidden Minecraft and New Vegas never opens (end javaw.exe in Task Manager).
- You need Fallout: New Vegas 1.4.0.525 (Steam or GOG) and a Microsoft account that owns Minecraft: Java Edition, on Windows.
- The first Play opens Prism Launcher: sign in with your Microsoft account. Prism then downloads Minecraft 26.3 and Java once (about 1 GB).
- Single player. Your builds live in the Minecraft world "mojave" of the bundled Prism instance; New Vegas saves keep the perk state. Back up your New Vegas saves first.
- Beta, not yet run in New Vegas: upstream tested the Minecraft side against a stand-in for the game only, never this plugin in real New Vegas. Expect bugs and report them to the author with Data/NVSE/Plugins/osl.log and Minecraft's latest.log.
- Both games run at once, so CPU and GPU load is high. The local link (127.0.0.1:25599) has no password while Minecraft runs. Each Play writes Data/NVSE/Plugins/osl_forms.ini and OSL/osl-launch.log; Restore leaves these two small files.

## Beta: not yet run in New Vegas

Upstream tested the Minecraft side against a stand-in for New Vegas (`tools/fake_newvegas.py`), never the plugin in the real game. SIGF built the plugin from upstream's sources with MSVC (upstream's own script cross-compiles with clang-cl); nobody has played this build yet.

## What this repository holds

1. The upstream source tree at commit [`85c6b3e275d14f8b8de9a3c1171fb65b512dd0c6`](https://github.com/polysilicon/MineNV/tree/85c6b3e275d14f8b8de9a3c1171fb65b512dd0c6), every file unchanged (same git blobs). Upstream's own `README.md` is there, unchanged; GitHub shows this file (`.github/README.md`) first.
2. Added by SIGF in the same commit: this file, and `sigf/` (the scripts that built the release assets, for reference: they run inside the SIGF repository).
3. `mashup.json`, the SIGF app recipe (the next commit).
4. The release `v0.1.0` (its tag is the first commit):

| Asset | Size | sha256 | What it is |
|---|---|---|---|
| `minenv-falloutnv.zip` | 1267046 B | `4758097418043ed3dc2d8d2d57598b4bfccb3ba4ac221e0e548a25589be2e198` | the SIGF builds of `Data/NVSE/Plugins/OverworldSupplyLine.dll` (the xNVSE plugin, MSVC x86) and `OSL/osl-launch.exe` (the Go launcher) from the pinned commit, `osl.ini` with upstream's settings, upstream's LICENSE and THIRD-PARTY-NOTICES under `OSL/`; into the New Vegas folder. |
| `minenv.mrpack` | 195343 B | `a0532af85cf7523b1a96d4232da2c4b63bc69c15819917e302d3a9c03f11e92d` | the Minecraft side: the SIGF build of `osl-0.1.0.jar` from the pinned commit (Java-WebSocket 1.6.0 inside, MIT), with upstream's LICENSE, for Minecraft 26.3 with Fabric Loader 0.19.5; Fabric API 0.161.0+26.3 is a Modrinth download link, not stored here. |

The sha256 of every file inside the zips is in `mashup.json` (`contents`).

## Licenses

| Part | License | Where |
|---|---|---|
| MineNV (all of the upstream tree, and the SIGF builds) | MIT, Copyright 2026 polysilicon; derived from universal-modder (MIT) | `LICENSE`, `THIRD-PARTY-NOTICES.md` |
| Java-WebSocket 1.6.0 (inside the Fabric jar) | MIT | https://github.com/TooTallNate/Java-WebSocket |
| Fabric API (downloaded from Modrinth by the app, not stored here) | Apache-2.0 | https://github.com/FabricMC/fabric |

## Why this repository exists

The SIGF app (https://sigf.ai) installs mods from recipes (`mashup.json`) whose downloads are pinned release files. This repository makes Mojavecraft (MineNV) installable in one click, credited to polysilicon. If you are the author and want anything changed or taken down, open an issue here.
