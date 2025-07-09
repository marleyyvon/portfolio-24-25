import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.load_data import load_cgus2020_data
from src.filters import filter_completed_adult_base

df, meta = load_cgus2020_data("CGUS2020/Data - 2020 CG in US Public Use file FINAL.sav")
print("Raw shape:", df.shape)

filtered_df = filter_completed_adult_base(df)
print("Filtered shape:", filtered_df.shape)

print(filtered_df[["agecg", "sexcg", "raceCG"]].describe())
