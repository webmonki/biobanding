# -*- encoding: utf-8 -*-

import sys
import os
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))
import openpyxl
from pathlib import Path
from api.config import BaseConfig
from datetime import datetime, timedelta
from api_requests import Reguests
import jwt


filePath = './test_data/Biobanding Datenerhebung_VFL Astrostars_08.01.2022.xlsx'

xlsx_file = Path('./test_data', 'Biobanding Datenerhebung_VFL Astrostars_08.01.2022.xlsx')

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

adminToken, admin = req.login_admin()

regisCode = req.getRegistrationCode(adminToken)

for user in sheet:
	
	if user[0].value != None and user[0].value != 'ID':

		firstname = str(user[2].value)
		lastname = str(user[1].value)
		birthday = str(user[4].value).split(' ')[0]
		date_measured = str(user[5].value)
		height = str(user[12].value)
		sitting_height = str(user[13].value)
		body_span = str(user[15].value)
		weight = str(user[14].value)


		charList = ['Ä', 'ä', 'Ö', 'ö', 'Ü', 'ü', 'ß']

		firstname = firstname.replace(' ', '')
		lastname = lastname.replace(' ', '')


		if user[10].value == 'männlich':
			sex = str(0)
		elif user[10].value == 'weiblich':
			sex = str(1)

		height_mother = user[16].value
		height_father = user[17].value

		req.register_user(firstname, lastname, regisCode)

		username = firstname + '.' + lastname


		token = jwt.encode({'username': username, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)

		heightMother = str(user[16].value)
		heightFather = str(user[17].value)


		req.confirmUser(token, firstname, lastname, birthday, sex, heightFather, heightMother)

		token, user_id = req.login_user(firstname, lastname)


		# req.create_player_details(token, user_id, firstname, lastname, birthday, sex, height_father, height_mother)


		req.create_measurement(token, user_id, date_measured, height, sitting_height, body_span, weight)


exit()