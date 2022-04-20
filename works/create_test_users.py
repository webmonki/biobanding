import openpyxl
from pathlib import Path

from api_requests import Reguests

xlsx_file = Path('.', 'Biobanding Datenerhebung_VFL Astrostars_08.01.2022.xlsx')

wb_obj = openpyxl.load_workbook(xlsx_file)

sheet = wb_obj.active

# 
# 0: ID
# 1: Nachname
# 2: Vorname
# 3: Name
# 4: Geburtsdatum
# 5: Testdatum
# 6: Saison
# 7: Testzeitpunkt
# 8: Team
# 9: Position (none)
# 10: Geschlecht
# 11: Trainingsalter
# 12: Größe
# 13: Sitzgröße gemessen
# 14: Gewicht
# 15: Armspannweite
# 16: Größe Mutter
# 17: Größe Vater
# 18: Sitzgröße berechnet
# 19: chrono. Alter
# 20: Beinlänge
# 21: BMI
# 22: PHV
# 23: YAPHV
# 24: AK_Bio

req = Reguests()

for user in sheet:

	
	if user[0].value != None and user[0].value != 'ID':

		firstname = user[2].value
		lastname = user[1].value
		birthday = user[4].value
		date_measured = user[5].value
		height = user[12].value
		sitting_height = user[13].value
		body_span = user[15].value
		weight = user[14].value

		charList = ['Ä', 'ä', 'Ö', 'ö', 'Ü', 'ü', 'ß']

		firstname = list(firstname)
		for i in range(len(firstname)):
			if firstname[i] in charList:
				firstname[i] = '%'

		firstname = "".join(firstname)

		lastname = list(lastname)
		for i in range(len(lastname)):
			if lastname[i] in charList:
				lastname[i] = '%'

		lastname = "".join(lastname)

		if user[10].value == 'männlich':
			sex = 0
		elif user[10].value == 'weiblich':
			sex = 1

		height_mother = user[16].value
		height_father = user[17].value

		req.register_user(firstname, lastname)

		token, user_id = req.login_user(firstname, lastname)


		req.create_player_details(token, user_id, firstname, lastname, birthday, sex, height_father, height_mother)


		req.create_measurement(token, user_id, date_measured, height, sitting_height, body_span, weight)


exit()