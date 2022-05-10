from datetime import datetime
import pandas as pd


# [BEGIN mirwald]
def mirwald(sitting_height: float,
            standing_height: float,
            current_date: str,
            birthdate: str,
            weight: float,
            gender: int) -> dict:
    """This function returns the maturity offset according to the Mirwald method, calculated from the given parameters.

        Args:
            sitting_height (float) : Sitting height in centimeters.
            standing_height (float): Standing height in centimeters.
            current_date (str): Date of the mesurement as string with format: year-month-day (e.g. 2022-01-08).
            birthdate (str): Birthdate as string with format: year-month-day (e.g. 2022-01-08).
            weight (float): Weight in kilograms
            gender (str): String with gender (0 or 1).

        Raises:
            ValueError: gender must be 0 or 1.

        Returns:
            result (dict):
                offset (float): Maturity offset rounded to two decimal places. Value can be negative and positive.
                phv (float): peak height velocity
                ak_bio (string): age group by phv

    """

    # Convert date string to datetime object
    current_date = datetime.strptime(current_date, '%Y-%m-%d')
    birthdate = datetime.strptime(birthdate, '%Y-%m-%d')

    # Get chronological age as rounded float
    chronological_age = round((current_date - birthdate).days / 365, 2)

    # Calculate leg_length
    leg_length = standing_height - sitting_height

    # Determine gender-specific ratio
    if gender == 0:
        ratio = 0.0002708
    elif gender == 1:
        ratio = 0.0001882
    else:
        raise ValueError("gender must be 0 (female) or 1 (male).")

    # Calculate maturity offset according to the Mirwald method
    offset = round(-9.236 + (ratio * leg_length * sitting_height) + (-0.001663 * chronological_age * leg_length) + (
            0.007216 * chronological_age * sitting_height) + (0.02292 * (weight / standing_height) * 100), 2)

    # Calulate the biological age (phv)
    phv = chronological_age + offset

    # Calculate puberty category
    if offset < -2.5:
        ak_bio = "PHV -2.5"
    elif -2.5 <= offset < -1.5:
        ak_bio = "PHV -2.5 bis -1.5"
    elif -1.5 <= offset < -0.5:
        ak_bio = "PHV -1.5 bis -0.5"
    elif -0.5 <= offset < 0.5:
        ak_bio = "PHV -0.5 bis 0.5"
    elif 0.5 <= offset < 1.5:
        ak_bio = "PHV 0.5 bis 1.5"
    elif 1.5 <= offset < 2.5:
        ak_bio = "PHV 1.5 bis 2.5"
    else:
        ak_bio = "PHV 2.5"

    return {"offset": offset, "phv": phv, "ak_bio": ak_bio}


# [END mirwald]


# [BEGIN bmi]
def bmi(height: float, weight: float) -> float:
    """
    Calculate the body mass index (bmi)

    Args:
        height (float): persons height in cm
        weight (float): persons weight in kg

    Returns:
        res_bmi (float): calculated bmi
    """

    # convert cm to m
    height = height / 100
    # calculate bmi
    res_bmi = weight / pow(height, 2)

    return round(res_bmi, 1)


# [END bmi]


# Smoothed Values of the Intercepts (beta) and Regression Coefficients for white males
male_coefficients_df = pd.DataFrame(
    [[4.0, -10.2567, 1.23812, -0.0087235, 0.50286],
     [4.5, -10.7190, 1.15964, -0.0074454, 0.52887],
     [5.0, -11.0213, 1.10674, -0.0064778, 0.53919],
     [5.5, -11.1556, 1.07480, -0.0057760, 0.53691],
     [6.0, -11.1138, 1.05923, -0.0052947, 0.52513],
     [6.5, -11.0221, 1.05542, -0.0049892, 0.50692],
     [7.0, -10.9984, 1.05877, -0.0048144, 0.48538],
     [7.5, -11.0214, 1.06467, -0.0047256, 0.46361],
     [8.0, -11.0696, 1.06853, -0.0046778, 0.44469],
     [8.5, -11.1220, 1.06572, -0.0046261, 0.43171],
     [9.0, -11.1571, 1.05166, -0.0045254, 0.42776],
     [9.5, -11.1405, 1.02174, -0.0043311, 0.43593],
     [10.0, -11.0380, 0.97135, -0.0039981, 0.45931],
     [10.5, -10.8286, 0.89589, -0.0034814, 0.5010],
     [11.0, -10.4917, 0.81239, -0.0029050, 0.54781],
     [11.5, -10.0065, 0.74134, -0.0024167, 0.58409],
     [12.0, -9.3522, 0.68325, -0.0020076, 0.60927],
     [12.5, -8.6055, 0.63869, -0.0016681, 0.62279],
     [13.0, -7.8631, 0.60818, -0.0013895, 0.62407],
     [13.5, -7.1348, 0.59228, -0.0011624, 0.61253],
     [14.0, -6.4299, 0.59151, -0.0009776, 0.58762],
     [15.5, -5.7578, 0.60643, -0.0008261, 0.54875],
     [15.0, -5.1282, 0.63757, -0.0006988, 0.49536],
     [15.5, -4.5092, 0.68548, -0.0005863, 0.42687],
     [16.0, -3.9393, 0.75069, -0.0004795, 0.34271],
     [16.5, -3.4873, 0.83375, -0.0003695, 0.24231],
     [17.0, -3.2830, 0.93520, -0.0002470, 0.12510],
     [17.5, -3.4156, 1.05558, -0.0001027, -0.00950]],

    columns=['age', 'beta', 'statue', 'weight', 'midparent_stature'])

# Smoothed Values of the Intercepts (beta) and Regression Coefficients for white females
female_coefficients_df = pd.DataFrame(
    [[4.0, -8.13250, 1.24768, -0.019435, 0.44774],
     [4.5, -6.47656, 1.22177, -0.018519, 0.42381],
     [5.0, -5.13582, 1.19932, -0.017530, 0.38467],
     [5.5, -4.13791, 1.17880, -0.016484, 0.36039],
     [6.0, -3.51039, 1.15866, -0.015400, 0.34105],
     [6.5, -3.14322, 1.13737, -0.014294, 0.32672],
     [7.0, -2.87645, 1.11342, -0.013184, 0.31748],
     [7.5, -2.66291, 1.08525, -0.012086, 0.31340],
     [8.0, -2.45559, 1.05135, -0.011019, 0.31457],
     [8.5, -2.20728, 1.01018, -0.009999, 0.32105],
     [9.0, -1.87098, 0.96020, -0.009044, 0.33291],
     [9.5, -1.06330, 0.89989, -0.008171, 0.35025],
     [10.0, 0.33468, 0.82771, -0.007397, 0.37312],
     [10.5, 1.97366, 0.74213, -0.006739, 0.40161],
     [11.0, 3.50436, 0.67173, -0.006136, 0.42042],
     [11.5, 4.57747, 0.64159, -0.005518, 0.41686],
     [12.0, 4.84365, 0.64452, -0.004894, 0.39490],
     [12.5, 4.27869, 0.67386, -0.004272, 0.35850],
     [13.0, 3.21417, 0.72260, -0.003661, 0.31163],
     [13.5, 1.83456, 0.78383, -0.003067, 0.25826],
     [14.0, 0.32425, 0.85062, -0.002500, 0.20235],
     [14.5, -1.13224, 0.91605, -0.001967, 0.14787],
     [15.0, -2.35055, 0.97319, -0.001477, 0.09880],
     [15.5, -3.10326, 1.01514, -0.001037, 0.05909],
     [16.0, -3.17885, 1.03496, -0.000655, 0.03272],
     [16.5, -2.42657, 1.02573, -0.000340, 0.02364],
     [17.0, -0.65579, 0.98054, -0.000100, 0.03584],
     [17.5, 2.26429, 0.89246, 0.000057, 0.07327]],

    columns=['age', 'beta', 'statue', 'weight', 'midparent_stature'])


# [BEGIN predicted_adult_height]
def predicted_adult_height(sex_m_0_f_1: int, height: float, weight: float, age: float,
                           father_height: float, mother_height: float) -> dict:
    """
    Calculate the predicted adult height according to the Khamis Roche method.

    Args:
        sex_m_0_f_1 (int): Gender of the child (0 = male & 1 = female)
        height (float): child's height in cm
        weight (float): child's weight in kg
        age (float): child's chronological age (min = 4 yrs & max = 17.5 yrs)
        father_height (float): height of the child's father in cm
        mother_height (float): height of the child's mother in cm

    Raises:
        ValueError: if sex_m_0_f_1 is not 0 or 1
        ValueError: if 4 > age > 17.5

    Return:
        res (dict): {'pah': value, 'pmh': value,  }
    """

    # Get gender specific coefficient set
    if sex_m_0_f_1 == 0:
        coefficients_df = male_coefficients_df
    elif sex_m_0_f_1 == 1:
        coefficients_df = female_coefficients_df
    else:
        raise ValueError("sex_m_0_f_1 must be 0 or 1")

    # Round age to nearest 0.5 step
    age = round(age * 2) / 2

    # Get age specific coefficients
    if 4 > age > 17.5:
        raise ValueError("Age must be between 4 and 17.5 years")
    else:
        coeff = coefficients_df[coefficients_df['age'] == age].values

    # Average calculation
    midparent_height_cm = (father_height + mother_height) / 2

    # Convert cm to inches
    midparent_height_in = midparent_height_cm / 2.54
    height_in = height / 2.54
    # convert convert kg to lbs
    weight_lbs = weight * 2.20462262185

    # Khamis Roche regression equation
    pah_in = coeff[0][1] + coeff[0][2] * height_in + coeff[0][3] * weight_lbs + coeff[0][4] * midparent_height_in

    # Convert inches back to centimerts
    pah = pah_in * 2.54

    # Calculate percentage mature height (PMH)
    pmh = height / pah

    # Calculate remaining growth in cm
    remaining_growth = pah - height

    return {'pah': round(pah, 2), 'pmh': round(pmh, 2), 'remaining_growth': round(remaining_growth, 2)}
# [END predicted_adult_height]
