# Benutzerhandbuch

## 01 Benuterverwaltung

### Rollen
Ein Benutzer kann der Rolle Admin zugewiesen werden. Ein normaler Benutzer 
kann seine Profildaten verwalten und neue Messungen anlegen.
Ein Admin kann zusätzlich Systemeinstellungen vornehmen, Benutzer verwalten und 
die Messungen aller Benutzer einsehen. 

### Benutzer anlegen & Registrieren
Ein Admin kann über den Menüpunkt __Benutzer__ neue Benutzer anlegen. Im Anschluss
erhalten diese eine E-Mail zum Abschließen der Registrierung an die 
hinterlegter E-Mail-Adresse. Für die Registrierung neuer Benutzer außerhalb des Adminbereichs
wird ein Registrierungscode benötigt. Dieser kann in den Systemeinstellungen generiert werden.
EIn Benutzer kann sich nur einloggen wenn seine E-Mail-Adresse bestätigt hat und die 
Registrierung über den zugesendeten Link abgeschlossen hat.

### Benutzer löschen
Ein Admin kann einen oder mehrere Benutzer über die den Menüpunkt __Benutzer__ löschen. Ein Benutzer kann seinen
Account über den Menüpunkt __Profil__ löschen. Beim Löschen eines Accounts werden 
die personenbezogenen Daten des Benutzers gelöscht. Die erhobenen Messungen bleiben in anonymisierter Form erhalten.



## 02 Profileinstellungen

### Benutzerdaten
Die Benutzerdaten werden für die Anmeldung in der Anwendung benötigt. Die konfigurierte E-Mail-Adresse
wird für das Zusenden von Systemnachrichten (Passwort vergessen, Erinnungsmail & Registrierung) benötigt.

### Persönliche Daten
Der Vor- und Nachname eines Benutzers wird für eine bessere Zuordnung der Messungen benötigt.
Geburtsdatum, Geschlecht und Größe der Eltern wird als Berechnungsgrundlage benötigt.


## 03 Systemeinstellungen

### Erinnerungsmail
In den Systemeinstelllungen kein ein Erinnerungsintervall von x Tagen konfiguriert werden. 
Benutzer die deren Messung länger als x Tage zurückliegt erhalten eine Erinnerungsmail 
an ihre hinterlegte E-Mail-Adresse zugesendet. Sofern nach der ersten Erinnerung keine neue
Messung erstellt wird, erhält der Benutzer alle 7 Tage eine erneute Erinnerung zugesendet.

### E-Mail-Server
Um Systemnachrichten verschicken zu können muss ein E-Mail-Server in den Systemeinstellungen 
konfiguriert werden. Hierzu müssen die Zugangsdaten für den SMTP-Server hinterlegt werden.

### Registrierungscode
Benutzer können sich selber nur registrieren, wenn sie einen gültigen Registrierungscode
haben. Dieser kann von einem Admin in den Systemeinstellungen generiert und kopiert werden.


## 04 Messungen

### Messungen erstellen, bearbeiten und löschen
Benutzer können über den Menüpunkt __Messungen__ oder über den Button in der Navigationsleiste
neue Messungen für ihren Account anlegen. Ein Admin kann zusätzlich Messungen für andere Benutzer eintragen.
Erstellte Messungen können über den Edit-Button nachträglich bearbeitet werden, wobei die Ergebnisse der
anthropometrischen Auswertung erneut berechnet werden. Benutzer können ihre eingetragenen Messungen
nicht löschen. Ein Admin kann sowohl seine eigenen als auch Messungen anderer Benutzer löschen.

### Anthropometrischen Auswertung
Auf Grundlage der persönlichen Daten und der eingetragenen Messwerte wird über verschiedene
Verfahren der biologische Reifegrad eines Benutzers bestimmt. Die Auswertung liefert Ergebnisse für
Benutzer deren Alter zwischen 4 und 17.5 Jahren liegt.

#### Biologisches Alter (Mirwald Methode)
Mit Hilfe der Mirwald Methode [^fn1] wird der biologische Reifegrad bestimmt. Hierzu wird neben dem chronologischen Alter
das biologische Alter (PHV) ermittelt. Der Abstand zwischen chronologischen Alter und PHV
wird durch den Wert YAPHV (Years Away from Peak Height Velocity) angegeben.
Eine Einteilung in biologische Altersklassen wird über den Wert AK_BIO dargestellt. 

#### Erwachsenengröße (Khamis & Roche Methode)
Durch Anwendung der Khamis & Roche Methode [^fn2] kann die voraussichtliche Größe im
Erwachsenenalter (Predicted Adult Height - PAH) bestimmt werden. Der prozentuale Anteil 
zwischen aktueller Größe und PAH wird durch den Wert PMH (Prozentuale Mature Height) dargestellt.
Eine einfache Übersicht über das verbleibende Wachstum in CM liefert der Wert CM until PAH.

#### Body Mass Index (BMI)
Der Body-Mass-Index (BMI) dient zur Abschätzung des Körperfettanteils. Für die Berechnung des BMI (Body Mass Index) wird 
das Körpergewicht in ein Verhältnis zur Körpergröße gesetzt. Der BMI berechnet sich aus dem Quotienten aus Körpergewicht
und Körpergröße zum Quadrat (kg/m2). Er ist die Beurteilungsgrundlage für die Gewichtsklassifikation.


## 05 Bug Report
Benutzer können innerhalb der Anwendung Fehler melden und Feedback geben. Hierzu steht über die Benutzeroberfläche auf 
rechten Bildschirmseite der Button __Fehler melden__ zur Verfügung. Gemeldete Fehler werden direkt an das Entwickler-Team weitergeleitet.


[^fn1]: Mirwald, R. & Baxter-Jones, Adam & Bailey, Donald & Beunen, Gaston. (2002). An assessment of maturity from 
anthropometric measurements. Medicine and science in sports and exercise. 34. 689-94. 10.1097/00005768-200204000-00020. 

[^fn2]: Khamis HJ, Roche AF. Predicting adult stature without using skeletal age: the Khamis-Roche method. Pediatrics. 
1994 Oct;94(4 Pt 1):504-7. Erratum in: Pediatrics 1995 Mar;95(3):457. PMID: 7936860.


