#!/usr/bin/env python3
"""Genera el QR real usando el owner/repo donde se publica Pages."""
import argparse
from pathlib import Path
from urllib.parse import quote
import qrcode

parser = argparse.ArgumentParser()
parser.add_argument('--repo', required=True, help='owner/repository')
parser.add_argument('--out', default='_site/qr.png')
args = parser.parse_args()
owner, repo = args.repo.split('/', 1)
if repo.lower() == f'{owner.lower()}.github.io':
    link = f'https://{owner.lower()}.github.io/'
else:
    link = f'https://{owner.lower()}.github.io/{quote(repo)}/'
path = Path(args.out)
path.parent.mkdir(parents=True, exist_ok=True)
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=4)
qr.add_data(link)
qr.make(fit=True)
qr.make_image(fill_color='#252a50', back_color='white').save(path)
print('Aplicación pública:', link)
print('QR generado:', path)
