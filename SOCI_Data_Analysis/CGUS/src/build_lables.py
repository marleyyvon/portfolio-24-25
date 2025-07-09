import pyreadstat
import os

def build_labels(input_sav, output_py):
    _, meta = pyreadstat.read_sav(input_sav)
    labels = {var: meta.column_labels[i] for i, var in enumerate(meta.column_names)}

    with open(output_py, "w") as f:
        f.write("# Auto-generated variable labels from CGUS2020 metadata\n")
        f.write("variable_labels = {\n")
        for var, label in labels.items():
            label = label.replace('"', '\\"')
            f.write(f'    "{var}": "{label}",\n')
        f.write("}\n")

if __name__ == "__main__":
    input_sav = os.path.join("CGUS2020", "Data - 2020 CG in US Public Use file FINAL.sav")
    output_py = os.path.join("src", "labels.py")
    build_labels(input_sav, output_py)
    print("✅ labels.py generated with all variable labels.")
