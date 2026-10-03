#!/usr/bin/env python3
"""Project-local Godot commands. No shell aliases or global PATH changes."""
import argparse
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / 'godot'


def executable():
    configured = os.environ.get('GODOT_BIN')
    config = ROOT / 'tools' / 'godot.local.json'
    if not configured and config.exists():
        configured = json.loads(config.read_text()).get('executable')
    candidates = [configured, '/Applications/Godot.app/Contents/MacOS/Godot',
                  str(Path.home() / 'Applications/Godot.app/Contents/MacOS/Godot'),
                  shutil.which('godot')]
    for candidate in candidates:
        if candidate and Path(candidate).is_file() and os.access(candidate, os.X_OK):
            return str(candidate)
    raise SystemExit('Godot not found. Install Godot.app in Applications or set GODOT_BIN to its executable.')


def engine(args, log_name=None):
    command = [executable(), '--path', str(PROJECT), *args]
    result = subprocess.run(command, text=True, stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT, check=False)
    print(result.stdout, end='')
    if log_name:
        output = ROOT / 'outputs'
        output.mkdir(exist_ok=True)
        (output / log_name).write_text(result.stdout)
    # Some engine import/parse failures do not produce a non-zero status.
    failed = re.search(r'(^|\n)(?:SCRIPT ERROR:|ERROR:)', result.stdout)
    if result.returncode or failed:
        raise SystemExit(result.returncode or 1)
    return result.stdout


def run_tool(name, args):
    binary = ROOT / '.venv-tools' / 'bin' / name
    if not binary.exists():
        raise SystemExit('Run tools/setup.sh first to install the local GDScript tools.')
    subprocess.run([str(binary), *args], cwd=ROOT, check=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['version', 'editor', 'run', 'import',
                                           'check', 'smoke', 'lint', 'format', 'api', 'export'])
    parser.add_argument('extra', nargs='*')
    args = parser.parse_args()
    scripts = sorted(str(p) for p in (PROJECT / 'scripts').rglob('*.gd'))
    if args.command == 'version':
        engine(['--version'])
    elif args.command in ('editor', 'run'):
        command = [executable(), '--path', str(PROJECT)]
        if args.command == 'editor':
            command.append('--editor')
        subprocess.run(command, check=True)
    elif args.command == 'import':
        engine(['--headless', '--import'], 'godot-import.log')
    elif args.command == 'check':
        engine(['--headless', '--import'], 'godot-import.log')
        for script in scripts:
            engine(['--headless', '--check-only', '--script', script])
        print(f'Godot checked {len(scripts)} GDScript files.')
    elif args.command == 'smoke':
        engine(['--headless', '--import'], 'godot-import.log')
        engine(['--headless', '--script', 'res://tests/smoke.gd'], 'godot-smoke.log')
    elif args.command == 'lint':
        run_tool('gdlint', [*scripts, str(PROJECT / 'tests' / 'smoke.gd')])
    elif args.command == 'format':
        run_tool('gdformat', [*scripts, str(PROJECT / 'tests' / 'smoke.gd')])
    elif args.command == 'api':
        destination = ROOT / 'outputs' / 'godot-api'
        destination.mkdir(parents=True, exist_ok=True)
        engine(['--headless', '--doctool', str(destination), '--quit'])
    elif args.command == 'export':
        if len(args.extra) != 2:
            parser.error('export requires PRESET OUTPUT, e.g. export "iOS" builds/ios/EdgeCase.zip')
        output = Path(args.extra[1]).expanduser().resolve()
        output.parent.mkdir(parents=True, exist_ok=True)
        engine(['--headless', '--export-debug', args.extra[0], str(output)], 'godot-export.log')


if __name__ == '__main__':
    main()
