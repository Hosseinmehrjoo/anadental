#!/usr/bin/env python3
"""Send backup report email with optional attachments (SMTP)."""
from __future__ import annotations

import os
import smtplib
import ssl
import sys
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path


def main() -> int:
    to_addr = os.environ.get("BACKUP_EMAIL_TO", "").strip()
    if not to_addr:
        print("BACKUP_EMAIL_TO is not set", file=sys.stderr)
        return 2

    host = os.environ.get("BACKUP_SMTP_HOST", "").strip()
    port = int(os.environ.get("BACKUP_SMTP_PORT", "587"))
    user = os.environ.get("BACKUP_SMTP_USER", "").strip()
    password = os.environ.get("BACKUP_SMTP_PASS", "")
    pass_file = os.environ.get("BACKUP_SMTP_PASS_FILE", "").strip()
    if not password and pass_file:
        path = Path(pass_file)
        if path.is_file():
            password = path.read_text(encoding="utf-8").strip()
    from_addr = os.environ.get("BACKUP_EMAIL_FROM", user or "backup@localhost").strip()
    use_tls = os.environ.get("BACKUP_SMTP_TLS", "1").strip() not in ("0", "false", "no")
    subject = os.environ.get("BACKUP_EMAIL_SUBJECT", "بکاپ روزانه آنادنت").strip()
    body = os.environ.get("BACKUP_EMAIL_BODY", "")
    attach_paths = [p.strip() for p in os.environ.get("BACKUP_EMAIL_ATTACHMENTS", "").split(",") if p.strip()]
    max_mb = float(os.environ.get("BACKUP_EMAIL_MAX_ATTACH_MB", "18"))

    if not host:
        print("BACKUP_SMTP_HOST is not set", file=sys.stderr)
        return 2

    local_mta = host in ("127.0.0.1", "localhost", "::1") and not user

    msg = MIMEMultipart()
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to_addr
    msg.attach(MIMEText(body, "plain", "utf-8"))

    total_bytes = 0
    max_bytes = int(max_mb * 1024 * 1024)
    for path_str in attach_paths:
        path = Path(path_str)
        if not path.is_file():
            print(f"skip missing attachment: {path}", file=sys.stderr)
            continue
        size = path.stat().st_size
        if total_bytes + size > max_bytes:
            print(f"skip {path.name}: attachment budget exceeded", file=sys.stderr)
            continue
        with path.open("rb") as fh:
            part = MIMEApplication(fh.read(), Name=path.name)
        part.add_header("Content-Disposition", "attachment", filename=path.name)
        msg.attach(part)
        total_bytes += size

    ctx = ssl.create_default_context()
    with smtplib.SMTP(host, port, timeout=120) as smtp:
        smtp.ehlo()
        if use_tls and not local_mta:
            smtp.starttls(context=ctx)
            smtp.ehlo()
        if user and not local_mta:
            if not password:
                print("SMTP password missing (BACKUP_SMTP_PASS or BACKUP_SMTP_PASS_FILE)", file=sys.stderr)
                return 3
            smtp.login(user, password)
        smtp.sendmail(from_addr, [to_addr], msg.as_string())

    print(f"email sent to {to_addr} ({total_bytes} bytes attached)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
