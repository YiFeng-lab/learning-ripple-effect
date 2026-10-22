"""Build synthetic portfolio data through a small pandas / SQLite pipeline.

Run from any working directory: python prepare_data.py
The original questionnaire responses are not included in this repository.
"""
from pathlib import Path
import json
import random
import sqlite3

import pandas as pd

ROOT = Path(__file__).resolve().parent
QUESTIONS = [f"Q{group}.{item}" for group, count in [(5, 6), (6, 8), (7, 4), (8, 5), (9, 5)] for item in range(1, count + 1)]
ATTITUDES = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
FREQUENCIES = ["Never", "Rarely", "Sometimes", "Often", "Very often"]
MAJORS = ["Marketing", "Economics", "Accounting", "Finance", "Business Management", "Public Administration"]


def main():
    rng = random.Random(42)
    raw_records = []
    for index in range(131):
        row = {
            "id": f"demo-{index + 1:03d}",
            "degree": rng.choice(["Bachelor", "Master"]),
            "major": rng.choice(MAJORS),
            "gender": rng.choice(["Female", "Male"]),
            "frequency": rng.choice(FREQUENCIES),
        }
        row.update({question: rng.choice(ATTITUDES) for question in QUESTIONS})
        raw_records.append(row)

    frame = pd.DataFrame(raw_records)
    output = ROOT / "build"
    output.mkdir(exist_ok=True)
    frame.to_csv(output / "synthetic-survey.csv", index=False)

    agreement_mapping = {label.lower(): index + 1 for index, label in enumerate(ATTITUDES)}
    frequency_mapping = {label.lower(): index + 1 for index, label in enumerate(FREQUENCIES)}
    for column in QUESTIONS + ["frequency"]:
        mapping = frequency_mapping if column == "frequency" else agreement_mapping
        encoded = frame[column].astype("string").str.strip().str.lower().map(mapping)
        if encoded.isna().any():
            raise ValueError(f"Unrecognized answer in {column}")
        frame[column] = encoded.astype(int)

    with sqlite3.connect(output / "synthetic-survey.db") as connection:
        frame.to_sql("responses", connection, if_exists="replace", index=False)
        stored = pd.read_sql_query("SELECT * FROM responses ORDER BY id", connection)

    records = []
    for row in stored.to_dict(orient="records"):
        records.append({
            "id": row["id"], "degree": row["degree"], "major": row["major"],
            "gender": row["gender"], "frequency": int(row["frequency"]),
            "answers": [int(row[question]) for question in QUESTIONS],
        })
    payload = {"synthetic": True, "questions": QUESTIONS, "records": records}
    encoded = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    (ROOT / "data.js").write_text("// Synthetic demonstration data. Not original questionnaire responses.\nwindow.RIPPLE_DATA = " + encoded + ";\n", encoding="utf-8")
    print(f"Prepared {len(records)} synthetic records across {len(QUESTIONS)} items.")


if __name__ == "__main__":
    main()
