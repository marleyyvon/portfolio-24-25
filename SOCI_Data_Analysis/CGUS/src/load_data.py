import pyreadstat
import pandas as pd

def load_cgus2020_data(filepath):
    df, meta = pyreadstat.read_sav(filepath)
    return df, meta
