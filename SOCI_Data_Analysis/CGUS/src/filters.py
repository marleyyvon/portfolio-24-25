def filter_completed_adult_base(df):
    return df[
        (df["status"] == 1) &
        (df["year"] == 2019) &
        (df["smptyp14"] < 5) &
        (df["ageCRcat"].isin([2, 3]))
    ]

def filter_completed(df):
    return df[df["status"] == 1]

def filter_2020(df):
    return df[df["year"] == 2019]

def filter_base_sample(df):
    return df[df["smptyp14"] < 5]

def filter_adult_recipients(df):
    return df[df["ageCRcat"].isin([2, 3])]

def filter_child_recipients(df):
    return df[df["ageCRcat"] == 1]

def filter_asian_adult_caregivers(df):
    return df[
        ((df["smptyp14"] < 5) | (df["smptyp14"] == 7)) &
        (df["year"] == 2019) &
        (df["status"] == 1) &
        (df["raceCG"] == 3) &
        (df["ageCRcat"].isin([2, 3]))
    ]

def filter_65plus_caregivers(df):
    return df[
        (df["smptyp14"] < 7) &
        (df["year"] == 2019) &
        (df["status"] == 1) &
        (df["ageCRcat"].isin([2, 3])) &
        (df["agecg"] > 64) & (df["agecg"] < 998)
    ]

def apply_full_filter(df):
    return (
        filter_adult_recipients(
            filter_base_sample(
                filter_completed(
                    filter_2020(df)
                )
            )
        )
    )
