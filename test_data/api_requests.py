# -*- encoding: utf-8 -*-

import requests
from requests.structures import CaseInsensitiveDict
import json



class Reguests:

	url = 'http://127.0.0.1:5000'

	def confirmUser(self, token, firstname, lastname, birthday, sex, heightFather, heightMother):
		url_config = self.url + '/api/users/confirm'


		headers = CaseInsensitiveDict()
		headers['accept'] = 'application/json'
		headers['Content-Type'] = 'application/json'
		headers['authorization'] = token

		data = '{' +\
			'"first_name": ' + '"' + firstname + '",' +\
			'"last_name": ' + '"' + lastname + '",' +\
			'"birthday": ' + '"' + birthday + '",' +\
			'"sex_m_0_f_1": ' + sex + ',' +\
			'"height_father": ' + heightFather + ',' +\
			'"height_mother": ' + heightMother + '}' 

		
		print(data)

		data = data.encode()

		resp = requests.post(url_config, headers=headers, data=data)
		print("CONFIRM USER:")



		try:
			resdict = json.loads(resp.text)

			if resp.status_code == 200:
				print("SUCCESS: UserConfirmed")

			else:
				print("ERROR: ", resp.text)


		except:
			print("ERROR: JSON LAOD STANDARD ERROR")

	def getRegistrationCode(self, token):
		url_config = self.url + '/api/configurations'


		headers = CaseInsensitiveDict()
		headers['accept'] = 'application/json'
		headers['Content-Type'] = 'application/json'
		headers['authorization'] = token

		resp = requests.get(url_config, headers=headers)

		resdict = json.loads(resp.text)

		if resp.status_code == 200:
			print("SUCCESS: Registration Code loaded")
			return resdict['config']['registration_code']
		else:
			print("ERROR: ", resdict)
			return None

	def login_admin(self):
		url_login = self.url + '/api/users/login'

		password = 'admin'
		email = 'admin@example.org'

		data = '{' +\
			'"email": ' + '"' + email + '",' +\
			'"password": ' + '"' + password + '"}' 

		headers = CaseInsensitiveDict()
		headers['accept'] = 'application/json'
		headers['Content-Type'] = 'application/json'

		resp = requests.post(url_login, headers=headers, data=data)

		resdict = json.loads(resp.text)


		if resp.status_code == 200:
			print("SUCCESS: " + email + " logged in.")
			return resdict['token'], resdict['user']['_id']
		else:
			print("ERROR: ", resdict)
			return None


	def register_user(self, firstname, lastname, registrationCode):

		url_register = self.url + '/api/users/register'

		username = firstname + '.' + lastname
		email = firstname + '.' + lastname + '@test.de'
		password = 'string'
		registrationCode = str(registrationCode)


		data = '{"username": ' + '"' + username + '",' +\
			'"email": ' + '"' + email + '",' +\
			'"password": ' + '"' + password + '",' +\
			'"registration_code": ' + registrationCode + ',' +\
			'"is_admin": ' +  'false}'

		data  = data.encode()

		headers = CaseInsensitiveDict()
		headers['accept'] = 'application/json'
		headers['Content-Type'] = 'application/json'

		resp = requests.post(url_register, headers=headers, data=data)

		print("REGISTER USER:")
		try:
			resdict = json.loads(resp.text)

			if resp.status_code == 200:
				print("SUCCESS", resdict['msg'])
			else:
				print("ERROR: ", resdict)
		except:
			print("JSON LOAD ERROR")






	def login_user(self, firstname, lastname):

		url_login = self.url + '/api/users/login'


		email = firstname + '.' + lastname + '@test.de'
		password = 'string'

		data = '{' +\
			'"email": ' + '"' + email + '",' +\
			'"password": ' + '"' + password + '"}' 

		headers = CaseInsensitiveDict()
		headers['accept'] = 'application/json'
		headers['Content-Type'] = 'application/json'

		resp = requests.post(url_login, headers=headers, data=data)

		print("LOGIN USER:")
		try:
			resdict = json.loads(resp.text)

			if resp.status_code == 200:
				print("SUCCESS: " + email + " logged in.")
				return resdict['token'], resdict['user']['_id']
			else:
				print("ERROR: ", resdict)
				return None, None
		except:
			print("ERROR")

	def create_player_details(self, token, user_id, firstname, lastname, birthday, sex, height_father, height_mother):

		url_create_player_details = self.url + '/api/user/' + str(user_id) + '/details'

		data = {
			"userID": user_id,
			"first_name": firstname,
			"last_name": lastname,
			"birthday": str(birthday).split(' ')[0],
			"sex_m_0_f_1": sex,
			"height_father": height_father,
			"height_mother": height_mother
		}

		headers = CaseInsensitiveDict()
		headers['accept'] = 'application/json'
		headers['Content-Type'] = 'application/json'
		headers['authorization'] = token


		data = data.encode()

		resp = requests.post(url_create_player_details, headers=headers, data=data)

		resdict = json.loads(resp.text)

		if resp.status_code == 200:
			print("SUCCESS: Player Details created")
		else:
			print("ERROR: ", resdict)


	def create_measurement(self, token, user_id, date_measured, height, sitting_height, body_span, weight):

		url_create_player_details = self.url + '/api/user/' + str(user_id) + '/anthropometric'

		headers = CaseInsensitiveDict()
		headers['accept'] = 'application/json'
		headers['Content-Type'] = 'application/json'
		headers['authorization'] = token

		data = '{' +\
			'"userID": ' + str(user_id) + ',' +\
			'"date_measured": ' + '"' + str(date_measured.split(' ')[0]) + '",' +\
			'"height": ' + str(height) + ',' +\
			'"sitting_height": ' + str(sitting_height) + ',' +\
			'"body_span": ' + str(body_span) + ',' +\
			'"weight": ' + str(weight) + '}' 

		data = data.encode()

		resp = requests.post(url_create_player_details, headers=headers, data=data)

		try:
			resdict = json.loads(resp.text)

			if resp.status_code == 200:
				print("SUCCESS: Measurement created")
			else:
				print("ERROR: ", resdict)
		except:
			print("JSON ERROR")







