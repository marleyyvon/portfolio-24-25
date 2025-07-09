from reportlab.platypus import SimpleDocTemplate, Table
from reportlab.lib.pagesizes import letter
import pandas as pd

df = pd.read_csv("outputs/CGUS2020_variable_labels.csv")
data = [df.columns.tolist()] + df.values.tolist()

pdf = SimpleDocTemplate("outputs/CGUS2020_variable_labels.pdf", pagesize=letter)
table = Table(data)
pdf.build([table])

print("✅ PDF created: outputs/CGUS2020_variable_labels.pdf")
