"""A pandas-backed waitlist persisted atomically to CSV."""

import os
from pathlib import Path
import re
import tempfile
from threading import Lock
import unicodedata

import pandas as pd


class WaitlistStore:
    columns = ["full_name", "email"]

    def __init__(self, path: str | Path):
        self.path = Path(path)
        self._lock = Lock()

    def join(self, payload: object) -> None:
        if not isinstance(payload, dict):
            raise ValueError("Please enter your full name and email address.")
        full_name = payload.get("fullName")
        email = payload.get("email")
        if not isinstance(full_name, str) or not isinstance(email, str):
            raise ValueError("Please enter your full name and email address.")
        full_name = full_name.strip()
        email = email.strip().lower()
        if not full_name or len(full_name) > 120 or any(
            unicodedata.category(char) == "Cc" for char in full_name
        ):
            raise ValueError("Please enter your full name (up to 120 characters).")
        if len(email) > 254 or not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
            raise ValueError("Please enter a valid email address.")

        # Serialize requests so concurrent joins cannot overwrite one another.
        with self._lock:
            if self.path.exists():
                frame = pd.read_csv(self.path, dtype=str, keep_default_na=False)
                if list(frame.columns) != self.columns:
                    raise OSError("Unexpected waitlist CSV columns")
            else:
                frame = pd.DataFrame(columns=self.columns)

            # Repeated submissions are successful without changing an existing name.
            if frame["email"].str.strip().str.lower().eq(email).any():
                return
            frame.loc[len(frame)] = [full_name, email]
            self.path.parent.mkdir(parents=True, exist_ok=True)
            temporary_path = None
            try:
                with tempfile.NamedTemporaryFile(
                    mode="w", encoding="utf-8", newline="", dir=self.path.parent,
                    prefix=".waitlist-", suffix=".csv", delete=False,
                ) as temporary:
                    temporary_path = Path(temporary.name)
                    frame.to_csv(temporary, index=False)
                    temporary.flush()
                    os.fsync(temporary.fileno())
                os.replace(temporary_path, self.path)
            finally:
                if temporary_path is not None:
                    temporary_path.unlink(missing_ok=True)
