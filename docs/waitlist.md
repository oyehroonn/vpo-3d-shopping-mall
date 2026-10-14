# Premium waitlist

The Premium loader offers a small expandable waitlist. Its form stays mounted over
the experience after loading, preserving typed values and focus. Like the nav, it
has a transparent background and a 12px hover blur. Finishing loading gives an open
form an initial blur; moving the pointer away clears it. Keyboard and touch users
can focus the fields to get the same effect. Browsers cannot reposition the mouse.

## Run locally

Requires Python 3.10+ and the project's existing Node/npm setup.

```sh
python3 -m pip install -r server/requirements.txt
npm run dev:api
```

In a second terminal, run `npm run dev`. Vite proxies `/api` to port 8788. The form
shows a retry message if the backend is unavailable and never claims an unsaved join
succeeded. `npm run preview` also proxies to the same backend.

## Data

`data/waitlist.csv` is created on the first successful join, with exactly two columns:

```csv
full_name,email
```

The Python backend reads and appends rows with pandas, normalizes email addresses,
and treats duplicate emails as an already successful join. A process lock serializes
requests; an atomic file replacement prevents partially written CSV files. Run one
backend process against each CSV file. The CSV is outside the served files, ignored
by Git, and has no public read endpoint. Names and addresses are not logged or stored
in the browser.

To inspect or export it from Python:

```python
import pandas as pd
waitlist = pd.read_csv("data/waitlist.csv", dtype=str, keep_default_na=False)
```

## Hosting

Build with `npm run build`, then run `npm start` to serve both `dist/` and the API.
`HOST` defaults to `127.0.0.1`; set `HOST=0.0.0.0` for container hosting. `PORT`
defaults to `8788`. Set `WAITLIST_CSV_PATH` to a file on a persistent volume in
production, and back it up. Put the Python server behind the host's HTTPS reverse
proxy. A static-only deployment of `dist/` also needs `/api/waitlist` proxied to this
backend. Redeployments must retain the data volume.

Run API/storage checks with `npm run test:waitlist`.
