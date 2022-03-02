CREATE TABLE player_master (
	user_id INTEGER NOT NULL, 
	first_name VARCHAR NOT NULL, 
	last_name VARCHAR NOT NULL, 
	PRIMARY KEY (user_id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE TABLE player_detail (
	user_id INTEGER NOT NULL, 
	birthday DATETIME NOT NULL, 
	sex_m_0_f_1 INTEGER NOT NULL, 
	height_father INTEGER NOT NULL, 
	height_mother INTEGER NOT NULL, 
	PRIMARY KEY (user_id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE TABLE anthropometric_data (
	id INTEGER NOT NULL, 
	date_measured DATETIME, 
	user_id INTEGER NOT NULL, 
	height INTEGER NOT NULL, 
	sitting_height INTEGER NOT NULL, 
	body_span INTEGER NOT NULL, 
	weight FLOAT NOT NULL, 
	result FLOAT NOT NULL, 
	PRIMARY KEY (id, user_id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);	

CREATE TABLE users (
	id INTEGER NOT NULL, 
	username VARCHAR(32) NOT NULL, 
	email VARCHAR(64) NOT NULL, 
	password TEXT, 
	date_joined DATETIME, 
	jwt_auth_active BOOLEAN, 
	PRIMARY KEY (id)
)

CREATE TABLE admin_config (
	id INTEGER NOT NULL, 
	days_reminder INTEGER, 
	PRIMARY KEY (id)
);
