from datetime import datetime

def mirwald_formula(leg_length:float, 
                    sitting_height:float, 
                    standing_height:float, 
                    current_date:str, 
                    birthdate:str, 
                    weight:float,
                    gender:str):
    
    """This function returns the maturity offset according to the Mirwald method, calculated from the given parameters.

        Args:
            leg_length (float): Leg length in centimeters.
            sitting_height (float) : Sitting height in centimeters.
            standing_height (float): Standing height in centimeters.
            current_date (str): Date of the mesurement as string with format: year-month-day (e.g. 2022-01-08).
            birthdate (str): Birthdate as string with format: year-month-day (e.g. 2022-01-08).
            weight (float): Weight in kilograms
            gender (str): String with gender ('female' or 'male').

        Raises:
            ValueError: gender must be 'female' or 'male'.

        Returns:
            phv (float): Maturity offset rounded to two decimal places. Value can be negative and positive.
    """
    
    # Convert date string to datetime object
    current_date: float = datetime.strptime(current_date, '%Y-%m-%d')
    birthdate: float = datetime.strptime(birthdate, '%Y-%m-%d')
    
    # Get chronological age as rounded float
    chronological_age =  round((current_date - birthdate).days / 365, 2)
    
    # Determine gender-specific ratio
    if gender == 'memale':
        ratio = 0.0002708
    elif gender == 'female':
        ratio: 0.0001882
    else:
        raise ValueError("gender must be 'female' or 'male'.")
        
    # Calculate maturity offset according to the Mirwald method
    phv = round(-9.236 + (ratio * leg_length * sitting_height) + (-0.001663 * chronological_age * leg_length) + (0.007216 * chronological_age * sitting_height ) + (0.02292 * (weight / standing_height) * 100), 2)
    
    return phv