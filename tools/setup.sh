#!/bin/sh
set -eu
task_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
python3 -m venv "$task_root/.venv-tools"
"$task_root/.venv-tools/bin/python" -m pip install -r "$task_root/tools/requirements.txt"
code --install-extension geequlim.godot-tools
