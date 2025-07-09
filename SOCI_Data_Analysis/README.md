# Medicare Caregiving Data Analysis
Short and focused study on how technology use affects unpaid caregivers in the United States.

I analyze the **Caregiving in the U.S. 2020** public use micro data (≈15k cases) as part of a faculty-led sociology thesis. Survey weighted linear, count, and logistic models test whether tools like tele‑health, online peer groups, or digital trackers reduce caregiver stress, time burden, or isolation while accounting for demographics and care recipient needs.

## ⭐️ Model Details


## ⭐️ Layout
```
CGUS/
├─ CGUS2020/        # Raw dataset
├─ models/          # Jupyter Notebooks
├─ src/             # Cleaning, features, modelling and helper functions.
├─ outputs/ 
└─ README.md
```

### Quick start
```bash
# Get data from: https://www.caregiving.org/research/open-data/
unzip CGUS2020.zip -d data/raw
cd cgus2020 
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
jupyter notebook
```

## References
- National Alliance for Caregiving & AARP. *Caregiving in the U.S. 2020*.
- Duffy, M. (2020). *Driven by Inequalities: Domestic Work in U.S. Cities*.
- Chiaraluce, C. (2025). *Expert Caregiving, Health Equity, and Digital Inclusion*.

---