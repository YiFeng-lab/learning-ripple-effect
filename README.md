# Learning Ripple Effect

An interactive exploration of generative AI use and attitudes.  

## Explore

Open **[index.html](index.html)** in a browser. No installation or backend is required.

- **Rings:** agreement from 1 (strongly disagree) to 5 (strongly agree).
- **Halos:** AI-use frequency from 1 (never) to 5 (very often).
- **Filters:** degree, major and gender.
- **Interactions:** hover for response details; select a question for an expanded view.

## Data & contribution

The original course files contained **131 questionnaire records and 28 attitude items**. This public demo uses **131 synthetic records**, clearly labelled on the page. The original responses are not included. Question IDs are retained because the item wording was not supplied.

Yi Feng participated across project stages. The original team's implementation used Python, SQLite, React, D3.js and Node.js; these are project technologies, not a claim of independent proficiency in every tool.

This portfolio edition simplifies the original visualization into plain HTML, CSS and JavaScript / SVG for direct viewing and GitHub Pages hosting. It is a presentation adaptation, not an unchanged copy of the original implementation.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and controls |
| `styles.css` | Layout and visual styling |
| `app.js` | Concentric-circle rendering, filters and detail view |
| `data.js` | Synthetic demo records |
| `prepare_data.py` | Reproducible pandas → SQLite → demo-data pipeline |

To regenerate demo data, install pandas and run `python prepare_data.py`. Generated CSV / SQLite files stay in the ignored `build/` folder.

## GitHub Pages

In the repository's **Settings → Pages**, select **Deploy from a branch**, then **main / (root)** and save. The root contains `index.html`, so there is no build step.
