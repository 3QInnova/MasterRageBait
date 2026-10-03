# Godot + VS Code workflow

Verified October 2, 2026. Standard Godot with typed GDScript; no .NET dependency.

## Installed and prepared

- Your completed download was installed as `/Applications/Godot.app`. Executable: `/Applications/Godot.app/Contents/MacOS/Godot`. Verified version: `4.7.2.stable.official.ed1daf0bf`.
- Official [Godot Tools](https://github.com/godotengine/godot-vscode-plugin) VS Code extension, `geequlim.godot-tools`, version 2.7.1.
- Project-local `gdtoolkit` 4.5.0 in `.venv-tools/` for `gdformat` and `gdlint`. [Tool source and docs](https://github.com/Scony/godot-gdscript-toolkit). The formatter/linter is an independent community tool; Godot's parser remains the authority for the installed engine.
- `EdgeCase.code-workspace` with the Godot project, browser reference, headless language-server setting, F5 debugging configuration, and build/test tasks.
- A native `godot/project.godot` with an animated Edge Case character preview and a startup smoke test. This is toolchain scaffolding, not the native gameplay port.
- Generated offline engine API XML in `outputs/godot-api/`, matching the installed engine. Start with `doc/classes/Node.xml`, `Node2D.xml`, `Control.xml`, `CharacterBody2D.xml`, `AnimationPlayer.xml`, `InputEventScreenTouch.xml`, and `InputEventScreenDrag.xml`.

## Open and use

Open `EdgeCase.code-workspace` in VS Code. It supplies two roots: Godot and Prototype & tools. The Godot folder is a workspace root so the extension can find its `project.godot` directly. F5 selects **Edge Case · Godot**. Cmd+Shift+B checks scripts. Terminal > Run Task lists the other commands.

Godot's language server can run headlessly through the extension. This is supported by the [official extension configuration](https://github.com/godotengine/godot-vscode-plugin#configuration); a visible editor window is not required for completion in this setup.

In a terminal from the repository root:

```sh
python3 tools/godot.py version
python3 tools/godot.py editor
python3 tools/godot.py run
python3 tools/godot.py check
python3 tools/godot.py smoke
python3 tools/godot.py lint
python3 tools/godot.py format
python3 tools/godot.py api
```

The wrapper locates the app without changing your shell profiles. Other machines can set `GODOT_BIN` or create ignored `tools/godot.local.json` with an `executable` field. Run `sh tools/setup.sh` to reproduce the extension and local Python-tool installation. See [Godot's CLI reference](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html).

If you want script double-clicks in Godot to open VS Code, set Editor Settings > Text Editor > External > Use External Editor; Exec Path `/usr/local/bin/code`; Exec Flags `{project} --goto {file}:{line}:{col}`. Enable Auto Reload Scripts on External Change under Text Editor > Behavior > Files. These are optional global editor preferences; this setup did not overwrite them. [Official external-editor guide](https://docs.godotengine.org/en/stable/tutorials/editor/external_editor.html).

## How AI-assisted building works here

The development workflow uses editable `.gd`, `.tscn`, `.tres`, and configuration files plus Godot's CLI. Scene creation can happen through code and scene files, imports through `--import`, checks through `--check-only`, and startup tests through `--script`. Runtime logs are written under `outputs/` by the wrapper. The game's fictional PATCH assistant is separate from development tooling.

The existing VS Code installation already includes the AI coding extensions. A separate game-specific AI subscription is not required for this workflow.

Reviewed [Coding-Solo/godot-mcp](https://github.com/Coding-Solo/godot-mcp): a community MCP server providing editor launch, project run/logs, scene operations, and UID utilities. Its documented implementation invokes the CLI and bundled GDScript. It is optional and was not installed or configured because the project-local workflow already covers the immediate tasks. We can reassess when direct editor interaction becomes useful. No new MCP tool connection is claimed in this session.

## Mobile build requirements

The engine project uses Compatibility rendering, portrait orientation, and a 420 × 840 viewport. Touch movement, safe-area layout, interruptions, and performance will need real-device tests after gameplay is ported.

For iPhone: Xcode 27.0 is already installed and verified using `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer`. Export templates matching the engine and an Apple signing team are still needed before producing a device build. [Godot iOS export guide](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_ios.html).

For Android: the documented workflow requires the Android SDK and a suitable JDK; Godot currently recommends JDK 17. Those were not installed during this editor-tooling setup. [Godot Android export guide](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_android.html).

Once templates and a real preset are configured, the wrapper accepts:

```sh
python3 tools/godot.py export "PRESET NAME" builds/OUTPUT_FILE
```

This is a debug export command, not a store submission or signing setup. Export output must use the correct format for its preset. No mobile exports have been produced yet.

## Documentation map for the port

- [Typed GDScript](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/static_typing.html): explicit types for player state, patch packages, and input.
- [CLI operations](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html): imports, script checks, run, tests, exports, API generation.
- [External editor and LSP/DAP](https://docs.godotengine.org/en/stable/tutorials/editor/external_editor.html): VS Code completion/debug integration.
- [Editor automation](https://docs.godotengine.org/en/stable/tutorials/plugins/running_code_in_the_editor.html): future editor scripts and tools.
- The generated local XML reference: exact installed API names and signatures. Online `stable` docs can advance; use the local reference when version differences matter.

Next implementation: port the fixed-step jump model and one patch package, preserve a completion trace from the browser reference, and confirm touch feel on a phone before expanding content.
