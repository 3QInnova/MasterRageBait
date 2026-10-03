#!/usr/bin/env python3
"""Check a running Godot language server without changing editor settings."""
import json
from pathlib import Path
import socket

root = Path(__file__).resolve().parents[1]
with socket.create_connection(('127.0.0.1', 6005), timeout=8) as connection:
    request = {'jsonrpc': '2.0', 'id': 1, 'method': 'initialize', 'params': {
        'processId': None, 'rootUri': (root / 'godot').as_uri(), 'capabilities': {}}}
    payload = json.dumps(request).encode()
    connection.sendall(b'Content-Length: ' + str(len(payload)).encode() + b'\r\n\r\n' + payload)
    stream = connection.makefile('rb')
    for _ in range(20):
        length = None
        while True:
            line = stream.readline()
            if not line:
                raise RuntimeError('Godot closed the language-server connection')
            if line == b'\r\n':
                break
            if line.lower().startswith(b'content-length:'):
                length = int(line.split(b':', 1)[1].strip())
        if length is None:
            raise RuntimeError('Missing language-server frame length')
        response = json.loads(stream.read(length))
        if response.get('id') == 1:
            if 'result' not in response:
                raise RuntimeError(response)
            capabilities = response['result']['capabilities']
            report = {'status': 'pass', 'transport': '127.0.0.1:6005',
                      'completion': bool(capabilities.get('completionProvider')),
                      'definition': bool(capabilities.get('definitionProvider')),
                      'hover': bool(capabilities.get('hoverProvider'))}
            if not all(report[k] for k in ('completion', 'definition', 'hover')):
                raise RuntimeError(report)
            (root / 'outputs' / 'godot-lsp-check.json').write_text(json.dumps(report, indent=2) + '\n')
            print(json.dumps(report, indent=2))
            break
    else:
        raise RuntimeError('No initialization response from Godot')
