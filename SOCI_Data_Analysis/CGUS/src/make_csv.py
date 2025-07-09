import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from src.load_data import load_cgus2020_data
from src.filters import apply_full_filter

def export_filtered_csv():
    df, meta = load_cgus2020_data("CGUS2020/Data - 2020 CG in US Public Use file FINAL.sav")
    filtered_df = apply_full_filter(df)
    os.makedirs("outputs", exist_ok=True)
    filtered_df.to_csv("outputs/filtered_caregivers_2020.csv", index=False)
    print("✅ CSV exported to outputs/filtered_caregivers_2020.csv")

if __name__ == "__main__":
    export_filtered_csv()
