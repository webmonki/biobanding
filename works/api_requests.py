import requests
from requests.structures import CaseInsensitiveDict
import json



class Reguests:

	url = 'http://127.0.0.1:5000'

	def register_user(self, firstname, lastname):

		url_register = self.url + '/api/users/register'

		username = firstname + '.' + lastname
		email = firstname + '.' + lastname + '@test.de'
		password = 'string'

		data = '{"username": ' + '"' + username + '",' +\
			'"email": ' + '"' + email + '",' +\
			'"password": ' + '"' + password + '",' +\
			'"is_admin": ' +  'false}' 

		headers = CaseInsensitiveDict()
		headers['accept'] = 'application/json'
		headers['Content-Type'] = 'application/json'

		resp = requests.post(url_register, headers=headers, data=data)

		resdict = json.loads(resp.text)

		if resp.status_code == 200:
			print("SUCCESS")
		else:
			print("ERROR: ", resdict)




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

		resdict = json.loads(resp.text)

		if resp.status_code == 200:
			print("SUCCESS: " + email + " logged in.")
			return resdict['token'], resdict['user']['_id']
		else:
			print("ERROR: ", resdict)
			return None

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

		resp = requests.post(url_create_player_details, headers=headers, data=json.dumps(data))

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

		data = {
			"userID": user_id,
			"date_measured": str(date_measured).split(' ')[0],
			"height": height,
			"sitting_height": sitting_height,
			"body_span": body_span,
			"weight": weight
		}

		resp = requests.post(url_create_player_details, headers=headers, data=json.dumps(data))

		resdict = json.loads(resp.text)

		if resp.status_code == 200:
			print("SUCCESS: Measurement created")
		else:
			print("ERROR: ", resdict)






