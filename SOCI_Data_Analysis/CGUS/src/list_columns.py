import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.load_data import load_cgus2020_data

df, meta = load_cgus2020_data("CGUS2020/Data - 2020 CG in US Public Use file FINAL.sav")
print(df.columns.tolist())
from src.load_data import load_cgus2020_data

df, meta = load_cgus2020_data("CGUS2020/Data - 2020 CG in US Public Use file FINAL.sav")
print(df.columns.tolist())

