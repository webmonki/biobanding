import { Selector } from 'testcafe';
import { ClientFunction } from 'testcafe';


fixture`Login`
    .page`http://localhost:8080`;

    const NO_MEASUREMENTS = Selector('div').withText('')
    const DIVISION_EMAIL = Selector('div').withExactText('E-Mail')
    const DIVISION_PASSWORD = Selector('div').withExactText('Passwort')
    const ADMIN_EMAIL = 'admin@example.org'
    const ADMIN_PASSWORD = 'admin'
    const ADMIN_PASSWORD_WRONG = '123456789'
    const ANMELDEN_BUTTON = Selector('button').withExactText('ANMELDEN')
    const getWindowLocation = ClientFunction(() => window.location);
    const LINK_MEASUREMENTS = Selector('a').withText('Messungen')
    const LINK_USERS = Selector('a').withText('Benutzer')
    const LINK_PROFILE = Selector('a').withText('Profil')
    const LINK_EINSTELLUNGEN = Selector('a').withText('Einstellungen')
    const LINK_FEHLER_MELDEN = Selector('a').withText('Fehler melden')
//    const INFO_PASSWORD_TOO_SHORT = Selector('div').withText('is too short') //this message shows up no more
    const INFO_PASSWORD_WRONG = Selector('div').withText('Wrong credentials.')
    const INFO_EMAIL_WRONG = Selector('div').withText('This email does not exist.')
    
    const LOGIN_VIEW = ":8080/login"
    const LOGIN_LOGO = Selector('#page').find('img')
    const LOGIN_ANMELDUNG_DIV = Selector('div').withExactText('Anmeldung')
    const LOGIN_INPUT_EMAIL = Selector('input').withAttribute('label', 'E-Mail')
    const LOGIN_INPUT_PASSWORD = Selector('input').withAttribute('label', 'Passwort')
    const LOGIN_LINK_PASSWORT_VERGESSEN = Selector('a').withText('Passwort vergessen?')
    const LOGIN_BUTTON_REGISTRIEREN = Selector('button').withExactText('REGISTRIEREN')
    const LOGIN_BUTTON_ANMELDEN = Selector('button').withExactText('ANMELDEN')
    
    const FORGOT_VIEW = ":8080/forgot"
    const FORGOT_LOGO = Selector('#page').find('img')
    const FORGOT_PASSVER_DIV = Selector('div').withText('Passwort vergessen')
    const FORGOT_INPUT_EMAIL = Selector('input').withAttribute('label', 'E-Mail')
    const FORGOT_INPUT_EMAIL_LABEL = Selector('label').withText('E-Mail')
    const FORGOT_BUTTON_ANMELDEN = Selector('button').withExactText('ANMELDEN')
    const FORGOT_BUTTON_SENDEN = Selector('button').withExactText('SENDEN')

    const SIGNUP_VIEW = ":8080/signup"
    const SIGNUP_LOGO = Selector('#page').find('img')
    const SIGNUP_CODE_EINGEBEN_DIV = Selector('div').withText('Registrierungscode eingeben')
    const SIGNUP_CODE_INPUT1 = Selector('#code1')
    const SIGNUP_CODE_INPUT2 = Selector('#code2')
    const SIGNUP_CODE_INPUT3 = Selector('#code3')
    const SIGNUP_CODE_INPUT4 = Selector('#code4')
    const SIGNUP_INPUT_BENUTZERNAME = Selector('input').withAttribute('label', 'Benutzername')
    const SIGNUP_INPUT_EMAIL = Selector('input').withAttribute('label', 'E-Mail')
    const SIGNUP_INPUT_PASSWORT = Selector('input').withAttribute('label', 'Passwort')
    const SIGNUP_INPUT_PASSWORT_WIEDERHOLEN = Selector('input').withAttribute('label', 'Passwort wiederholen')
    const SIGNUP_INPUT_CHECKBOX = Selector('input').withAttribute('type', 'checkbox')
    const SIGNUP_BUTTON_ANMELDEN = Selector('button').withExactText('ANMELDEN')
    const SIGNUP_BUTTON_REGISTRIEREN = Selector('button').withExactText('REGISTRIEREN')

    const PROF_VIEW = ":8080/profile"
    const PROF_LINK = Selector('a').withText('Profil')
    const PROF_LABEL_NAME = Selector('label').withText('Vorname')
    const PROF_LABEL_LAST_NAME = Selector('label').withText('Nachname')
//    const PROF_LABEL_BIRTHDAY = Selector('div').withText('Geburtstag')
    const PROF_LABEL_BIRTHDAY = Selector('input').withAttribute('type', 'date')
    const PROF_LABEL_HEIGHT_MOM = Selector('label').withText('Größe der Mutter')
    const PROF_LABEL_HEIGHT_DAD = Selector('label').withText('Größe des Vaters')
    const PROF_LABEL_MALE = Selector('label').withText('männlich')
    const PROF_LABEL_FEMALE = Selector('label').withText('weiblich')

    const BUTTON_MESSUNG_ADDIEREN = Selector('button').withText('MESSUNG')
    const MESSUNG_DIALOG_MESSUNG_ERSTELLEN = Selector('header').withText('Messung erstellen')
    const MESSUNG_DIALOG_MESSUNG_ANTH = Selector('span').withText('Anthropometrische Daten')
    const MESSUNG_NO_MEASUREMENTS_INFO = Selector('table').withText('Keine Messungen vorhanden')
    //    const MEAS_SELECT_ADMIN = Selector('select').withText('admin')
    const MEASUREMENTS_VIEW = ":8080/measurements"
    const MEAS_HEIGHT_LABEL = Selector('label').withText('Größe')
    const MEAS_SITTING_HEIGHT_LABEL = Selector('label').withText('Größe im Sitzen')
    const MEAS_BODY_SPAN_LABEL = Selector('label').withText('Arm Spannweite')
    const MEAS_WEIGHT_LABEL = Selector('label').withText('Gewicht')
    const BUTTON_i_TAGGED_NEUE_MESSUNG_PLUS = Selector('#page > div > div > div > div > div > div > button').withText('add_circle')
    const BUTTON_i_TAGGED_DOWNLOAD = Selector('button').withText('file_download')
    const BUTTON_i_TAGGED_FILTER_LIST = Selector('button').withText('filter_list')
    const BUTTON_i_TAGGED_IN_FILTER_ADD_CIRCLE = Selector('#MessungenfilterContainer').find('button').withText('add_circle')
    const BUTTON_i_TAGGED_LETZTE_MESSUNGEN_ADD_CIRCLE = Selector('i').withText('add_circle')
    const CHECKBOX_DELETE_ALL_CHECK = Selector('input').withAttribute('name', 'deleteCheckAll')
    const LETZTE_MESSUNGEN_CHIP_CONTAINER = Selector('div').withText('Letzte Messungen')
    const LETZTE_MESSUNGEN_CHIP = Selector('i').withText('check')
    const MEAS_FILTER_CONTAINER = Selector('#MessungenfilterContainer')
    const BUTTON_i_TAGGED_CANCEL = Selector('button').withText('cancel')
    const MEAS_FILTER_CONTAINER_SELECT = Selector('#MessungenfilterContainer').find('select')
    const MEAS_DROPDOWN_OPTIONS = ['Benutzer', 'Datum', 'Alter',
                                    'YAPHV', 'PHV', 'AK_BIO', 'BMI',
                                    'PMH', 'PAH', 'CM until PAH',
                                    'Größe', 'Sitzgröße', 'Körperspanne', 'Gewicht']
    const MEAS_EDIT_BUTTON = Selector('button').withText('edit')
    const MEAS_EDIT_DIALOG = Selector('h2').withText('Messung bearbeiten')
    const MEAS_PAGINATION_NUMBERS = Selector('div').withText('1/1')
    const MEAS_PAGINATION_CHEVRON_LEFT = Selector('button').withText('chevron_left')
    const MEAS_PAGINATION_CHEVRON_RIGHT = Selector('button').withText('chevron_right')
    const MEAS_DELETE_CHECK_BOX = Selector('input').withAttribute('name', 'deleteCheck')
    const MEAS_DELETE_BUTTON = Selector('div').withText('1 Messung ausgewählt')

    const BUTTON_SPEICHERN = Selector('button').withText('SPEICHERN')
    const BUTTON_MESSUNG_ABBRECHEN = Selector('button').withText('ABBRECHEN')

    const SETTINGS_VIEW = ":8080/settings"
    const SETTINGS_HEADER = Selector('span').withExactText('Einstellungen')
    const SETTINGS_ERINNERUNG_IN_TAGEN = Selector('input').withAttribute('label', 'Erinnerung in Tagen')
    const SETTINGS_MAIL_SERVER = Selector('input').withAttribute('label', 'E-Mail-Server')
    const SETTINGS_PORT = Selector('input').withAttribute('label', 'Port')
    const SETTINGS_USERNAME = Selector('input').withAttribute('label', 'Benutzername')
    const SETTINGS_PASSWORT = Selector('input').withAttribute('label', 'Passwort')
    const SETTINGS_SLL_CHECKBOX = Selector('input').withAttribute('name', 'serverCheck')
    const SETTINGS_CODE = Selector('span').withText(/Code: [0-9][0-9][0-9][0-9]/)
    const SETTINGS_COPY_CODE_BUTTON = Selector('button').withText('content_copy')
    const SETTINGS_SEND_EMAIL_TEST = Selector('button').withExactText('TESTMAIL SENDEN')
    const SETTINGS_GENERATE_CODE_BUTTON = Selector('button').withText('CODE GENERIEREN')
    const SETTINGS_SPEICHERN_BUTTON = Selector('button').withExactText('SPEICHERN')
    const SETTINGS_INPUT_MAIL_SERVER = 'smtp.example.org'
    const SETTINGS_INPUT_PORT = '465'
    const SETTINGS_INPUT_USERNAME = 'doe'

    const USERS_VIEW = ":8080/users"
    const USERS_HEADER = Selector('span').withExactText('Benutzer')
    const USERS_DELETE_INFO_ALL_SELECTED = Selector('div').withText('2 Benutzer ausgewählt')
    const USERS_DELETE_INFO_1_SELECTED = Selector('div').withText('1 Benutzer ausgewählt')
    const USERS_DELETE_BIN_ICON = Selector('i').withText('delete')
    const USERS_PAGINATION_NUMBERS = Selector('div').withText('1/1')
    const USERS_PAGINATION_CHEVRON_LEFT = Selector('button').withText('chevron_left')
    const USERS_PAGINATION_CHEVRON_RIGHT = Selector('button').withText('chevron_right')
    const USERS_PAGINATION_FIRST_PAGE = Selector('button').withText('first_page')
    const USERS_PAGINATION_LAST_PAGE = Selector('button').withText('last_page')
    const USERS_DELETE_CHECK_BOX = Selector('input').withAttribute('name', 'deleteCheck')
    const USERS_BUTTON_i_TAGGED_NEUE_MESSUNG_PLUS = Selector('button').withText('add_circle')
    const USERS_EDIT_DIALOGBOX_HEADER = Selector('h2').withText('Benutzer bearbeiten')
    const USERS_EDIT_DIALOGBOX_BENUTZERNAME = Selector('input').withAttribute('label', 'Benutzername')
    const USERS_EDIT_DIALOGBOX_EMAIL = Selector('input').withAttribute('label', 'E-Mail')
    const USERS_FILTER_CONTAINER_SELECT = Selector('#BenutzerfilterContainer').find('select')
    const USERS_FILTER_CONTAINER_INPUT = Selector('#BenutzerfilterContainer').find('input')
    const USERS_FILTER_DROPDOWN_OPTIONS = ['Benutzername', 'E-Mail', 'Admin']
    const USERS_STRING_ENTHALT = Selector('div').withExactText('enthält')

    const BUTTON_USERS_CANCEL = Selector('button').withText('cancel')
    const BUTTON_USERS_FILTER = Selector('button').withText('filter_list')
    const BUTTON_USERS_SPEICHERN = Selector('button').withText('SPEICHERN')
    const BUTTON_USERS_ABBRECHEN = Selector('button').withText('ABBRECHEN')
    const BUTTON_USERS_NEW_BENUTZER = Selector('#page > div > div > div > div > div > div > div > button').withText('add_circle')
    const BUTTON_USERS_NEW_BENUTZER_IN_DIALOGB = Selector('#BenutzeraddFilterContainer > button').withText('add_circle')
    const BUTTON_USERS_EDIT = Selector('#tableData > div > button').withText('edit')
    const BUTTON_USERS_EQUAL_SIGN = Selector('button').withText('=')
    const BUTTON_USERS_ADMIN_CHECK = Selector('button').withText('check')
    const BUTTON_USERS_ADMIN_UNCHECKED = Selector('button').withText('clear')

    const FRAME_FEHLER_MELDUNG = '#atlwdg-frame'
    const FEHLER_MELDEN_HEADER = Selector('h2').withText('Raise a bug')
    const FEHLER_MELDEN_INFO = Selector('div.info')
    const LABEL_FEHLER_MELDEN_DESCRIPTION = Selector('label').withAttribute('for', 'description')
    const TEXTAREA_FEHLER_MELDEN_DESCRIPTION = Selector('textarea').withAttribute('name', 'description')
    const LABEL_FOR_SCREENSHOT_FRHLER_MELDEN = Selector('label').withAttribute('for', 'screenshot')
    const BUTTON_CHOOSE_FILES_FRHLER_MELDEN = Selector('input').withAttribute('name', 'screenshot')
    const LABEL_NAME_FRHLER_MELDEN = Selector('label').withAttribute('for', 'fullname')
    const INPUT_FULL_NAME_FRHLER_MELDEN = Selector('input').withAttribute('name', 'fullname')
    const LABEL_EMAIL_FRHLER_MELDEN = Selector('label').withAttribute('for', 'email')
    const INPUT_CHECKBOX_FRHLER_MELDEN = Selector('input').withAttribute('name', 'recordWebInfo')
    const LABEL_FOR_WEB_INFO_CONSENT_FEHLER_MELDEN = Selector('label').withAttribute('for', 'recordWebInfoConsent')
    const LINK_SHOW_RECORDED_WEB_INFO_FEHLER_MELDEN = Selector('#show-recorded-web-info')
    const INPUT_SUBMIT_FEHLER_MELDEN = Selector('input').withAttribute('type', 'submit')
    const LINK_CANCEL_FEHLER_MELDUMG = Selector('a.cancel')
    const IFRAME_FEHLER_MELDUNF = Selector('#atlwdg-frame')

    //today
    let date = new Date();
    // adjust 0 before single digit date
    let day = ("0" + date.getDate()).slice(-2);
    // current month
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    // current year
    let year = date.getFullYear();
    const today = month + '-' + day + '-' + year

test('/login view - check if all HTML elements are displayed.',  async t => {
    // e2e Test: 
    // GIVEN
    // WHEN
    // THEN
    const location = await getWindowLocation();
    await t.expect(location.href).contains(LOGIN_VIEW)
        .expect(LOGIN_LOGO.visible).ok()
        .expect(LOGIN_LOGO.count).eql(2)
        .expect(LOGIN_ANMELDUNG_DIV.visible).ok()
        .expect(LOGIN_INPUT_EMAIL.visible).ok()
        .expect(LOGIN_INPUT_PASSWORD.visible).ok()
        .expect(LOGIN_LINK_PASSWORT_VERGESSEN.visible).ok()
        .expect(LOGIN_BUTTON_REGISTRIEREN.visible).ok()
        .expect(LOGIN_BUTTON_ANMELDEN.visible).ok()
        .expect(LOGIN_BUTTON_ANMELDEN.hasAttribute('disabled')).ok()
});


test('/forgot view - check if all HTML elements are displayed.',  async t => {
    // e2e Test: 
    // GIVEN
    // WHEN
    // THEN
    await t.click(LOGIN_LINK_PASSWORT_VERGESSEN)
    const location = await getWindowLocation();
    await t.expect(location.href).contains(FORGOT_VIEW)
        .expect(FORGOT_LOGO.visible).ok()
        .expect(FORGOT_LOGO.count).eql(2)
        .expect(FORGOT_PASSVER_DIV.visible).ok()
        .expect(FORGOT_INPUT_EMAIL.visible).ok()
        .expect(FORGOT_INPUT_EMAIL_LABEL.visible).ok()
        .expect(FORGOT_BUTTON_ANMELDEN.visible).ok()
        .expect(FORGOT_BUTTON_SENDEN.visible).ok()
        .expect(FORGOT_BUTTON_SENDEN.hasAttribute('disabled')).ok()
});


test('/signup view - check if all HTML elements are displayed.',  async t => {
    // e2e Test: 
    // GIVEN
    // WHEN
    // THEN
    // login as admin@example.org
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).ok();
    await t.click(DIVISION_EMAIL);
    for (let i = 0; i < ADMIN_EMAIL.length; i++) {
        await t.pressKey(ADMIN_EMAIL.charAt(i));
    }
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).notOk();
    await t.click(DIVISION_PASSWORD);
    for (let i = 0; i < ADMIN_PASSWORD.length; i++) {
        await t.pressKey(ADMIN_PASSWORD.charAt(i));
    }
    await t.click(ANMELDEN_BUTTON);
    // navigate to /settings view
    await t.click(LINK_EINSTELLUNGEN);
    // grab the registration code
    const codeSelector = await Selector('span').withText('Code:');
    const registration_code = await codeSelector.textContent;
    // log out
    await t.click(Selector('button').withExactText('ABMELDEN'))
    // navigate to signup
    await t.click(LOGIN_BUTTON_REGISTRIEREN)
    const location = await getWindowLocation();
    await t.expect(location.href).contains(SIGNUP_VIEW)
        .expect(SIGNUP_LOGO.visible).ok()
        .expect(SIGNUP_LOGO.count).eql(2)
        .expect(SIGNUP_CODE_EINGEBEN_DIV.visible).ok()
        .expect(Selector(SIGNUP_CODE_INPUT1).visible).ok()
        .expect(Selector(SIGNUP_CODE_INPUT2).visible).ok()
        .expect(Selector(SIGNUP_CODE_INPUT3).visible).ok()
        .expect(Selector(SIGNUP_CODE_INPUT4).visible).ok()
        // type in the code
        .click(SIGNUP_CODE_INPUT1)
        .pressKey(registration_code[6])
        .pressKey(registration_code[7])
        .pressKey(registration_code[8])
        .pressKey(registration_code[9])
    // check if all inputs are displayed
    await t.expect(SIGNUP_LOGO.visible).ok()
        .expect(SIGNUP_LOGO.count).eql(2)
        .expect(SIGNUP_INPUT_BENUTZERNAME.visible).ok()
        .expect(SIGNUP_INPUT_EMAIL.visible).ok()
        .expect(SIGNUP_INPUT_PASSWORT.visible).ok()
        .expect(SIGNUP_INPUT_PASSWORT_WIEDERHOLEN.visible).ok()
        .expect(SIGNUP_INPUT_CHECKBOX.visible).ok()
        .expect(SIGNUP_BUTTON_ANMELDEN.visible).ok()
        .expect(SIGNUP_BUTTON_REGISTRIEREN.visible).ok()
        .expect(SIGNUP_BUTTON_REGISTRIEREN.hasAttribute('disabled')).ok()
        // enter data
        .click(SIGNUP_INPUT_BENUTZERNAME)
        .pressKey('J')
        .pressKey('o')
        .pressKey('h')
        .pressKey('n')
        .pressKey('n')
        .pressKey('y')
        .click(SIGNUP_INPUT_EMAIL)
        .pressKey('j')
        .pressKey('o')
        .pressKey('h')
        .pressKey('n')
        .pressKey('n')
        .pressKey('y')
        .pressKey('@')
        .pressKey('a')
        .pressKey('.')
        .pressKey('d')
        .pressKey('e')
        .click(SIGNUP_INPUT_PASSWORT)
        .pressKey('i')
        .pressKey('d')
        .pressKey('e')
        .pressKey('s')
        .pressKey('t')
        .pressKey('2')
        .pressKey('0')
        .pressKey('2')
        .pressKey('2')
        .click(SIGNUP_INPUT_PASSWORT_WIEDERHOLEN)
        .pressKey('i')
        .pressKey('d')
        .pressKey('e')
        .pressKey('s')
        .pressKey('t')
        .pressKey('2')
        .pressKey('0')
        .pressKey('2')
        .pressKey('2')
        .click(SIGNUP_INPUT_CHECKBOX)
        .expect(SIGNUP_BUTTON_REGISTRIEREN.hasAttribute('disabled')).notOk()
        .click(SIGNUP_BUTTON_REGISTRIEREN)

});

// 'message' about üassword being too short shows up no more
// test.skip('Log in as admin@example.org - invalid password', async t => {
//     // e2e Test: Logging in as admin@example
//     // GIVEN Valid email and invalid passsword
//     // WHEN Logging in
//     // THEN Check for unsuccessful log in
//     await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).ok();
//     await t.click(DIVISION_EMAIL);
//     for (let i = 0; i < ADMIN_EMAIL.length; i++) {
//         await t.pressKey(ADMIN_EMAIL.charAt(i));
//     }
//     await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).notOk();
//     await t.click(DIVISION_PASSWORD);
//     await t.pressKey('a');
//     await t.click(ANMELDEN_BUTTON);
//     await t.expect(INFO_PASSWORD_TOO_SHORT.visible).eql(true);
//     const location = await getWindowLocation();
//     await t.expect(location.href).contains(LOGIN_VIEW);
// });


test('Log in as admin@example.org - wrong password', async t => {
    // e2e Test: Logging in as admin@example
    // GIVEN Valid email and wrong passsword
    // WHEN Logging in
    // THEN Check for unsuccessful log in
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).ok();
    await t.click(DIVISION_EMAIL);
    for (let i = 0; i < ADMIN_EMAIL.length; i++) {
        await t.pressKey(ADMIN_EMAIL.charAt(i));
    }
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).notOk();
    await t.click(DIVISION_PASSWORD);
    for (let i = 0; i < ADMIN_PASSWORD_WRONG.length; i++) {
        await t.pressKey(ADMIN_PASSWORD_WRONG.charAt(i));
    }
    await t.click(ANMELDEN_BUTTON);
    await t.expect(INFO_PASSWORD_WRONG.visible).eql(true);
    const location = await getWindowLocation();
    await t.expect(location.href).contains(LOGIN_VIEW);
});


test('Log in as aadmin@example.org - nonexistent email', async t => {
    // e2e Test: Logging in as aadmin@example
    // GIVEN Not registered email
    // WHEN Logging in
    // THEN Check for unsuccessful log in
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).ok();
    await t.click(DIVISION_EMAIL);
    await t.pressKey('a');
    for (let i = 0; i < ADMIN_EMAIL.length; i++) {
        await t.pressKey(ADMIN_EMAIL.charAt(i));
    }
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).notOk();
    await t.click(DIVISION_PASSWORD);
    for (let i = 0; i < ADMIN_PASSWORD_WRONG.length; i++) {
        await t.pressKey(ADMIN_PASSWORD_WRONG.charAt(i));
    }
    await t.click(ANMELDEN_BUTTON);
    await t.expect(INFO_EMAIL_WRONG.visible).eql(true);
    const location = await getWindowLocation();
    await t.expect(location.href).contains(LOGIN_VIEW);
});


test('Log in as admin@example.org - valid credentials', async t => {
    // e2e Test: Log in as admin@example
    // GIVEN Valid credentials
    // WHEN Logging in
    // THEN Check for successful log in
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).ok();
    await t.click(DIVISION_EMAIL);
    for (let i = 0; i < ADMIN_EMAIL.length; i++) {
        await t.pressKey(ADMIN_EMAIL.charAt(i));
    }
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).notOk();
    await t.click(DIVISION_PASSWORD);
    for (let i = 0; i < ADMIN_PASSWORD.length; i++) {
        await t.pressKey(ADMIN_PASSWORD.charAt(i));
    }
    await t.click(ANMELDEN_BUTTON);
    await t.expect(LINK_MEASUREMENTS.visible).eql(true);
    const location = await getWindowLocation();
    await t.expect(location.href).contains(MEASUREMENTS_VIEW);
});


test('Profile view - add details', async t => {
    // e2e Test: Add profile details
    // GIVEN
    // WHEN
    // THEN
    // Log in as admin@example.org
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).ok();
    await t.click(DIVISION_EMAIL);
    for (let i = 0; i < ADMIN_EMAIL.length; i++) {
        await t.pressKey(ADMIN_EMAIL.charAt(i));
    }
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).notOk();
    await t.click(DIVISION_PASSWORD);
    for (let i = 0; i < ADMIN_PASSWORD.length; i++) {
        await t.pressKey(ADMIN_PASSWORD.charAt(i));
    }
    await t.click(ANMELDEN_BUTTON);
    await t.expect(LINK_MEASUREMENTS.visible).eql(true);
    let location = await getWindowLocation();
    await t.expect(location.href).contains(MEASUREMENTS_VIEW);
    // Navigate to 'Profil'
    await t.click(PROF_LINK);
    let location_current = await getWindowLocation();
    await t.expect(location_current.href).contains(PROF_VIEW);
    // Enter data
    await t.click(PROF_LABEL_NAME)
        .pressKey('M')
        .pressKey('a')
        .pressKey('r')
        .pressKey('k')
        .click(PROF_LABEL_LAST_NAME)
        .pressKey('M')
        .pressKey('ü')
        .pressKey('l')
        .pressKey('l')
        .pressKey('e')
        .pressKey('r')
    await t.typeText(PROF_LABEL_BIRTHDAY, '2015-05-25', {replace: true, caretPos: 0})
    await t.click(PROF_LABEL_MALE.parent(0))
    await t.click(PROF_LABEL_HEIGHT_MOM)
        .pressKey('1')
        .pressKey('6')
        .pressKey('8')
    await t.click(PROF_LABEL_HEIGHT_DAD)
        .pressKey('1')
        .pressKey('8')
        .pressKey('6')
    await t.click(BUTTON_SPEICHERN)
});


test('Measurements view - add new measurement', async t => {
    // e2e Test dialog box in /measurement viewA Add new measurement
    // GIVEN
    // WHEN
    // THEN
    // Log in as admin@example.org
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).ok();
    await t.click(DIVISION_EMAIL);
    for (let i = 0; i < ADMIN_EMAIL.length; i++) {
        await t.pressKey(ADMIN_EMAIL.charAt(i));
    }
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).notOk();
    await t.click(DIVISION_PASSWORD);
    for (let i = 0; i < ADMIN_PASSWORD.length; i++) {
        await t.pressKey(ADMIN_PASSWORD.charAt(i));
    }
    await t.click(ANMELDEN_BUTTON);
    await t.expect(LINK_MEASUREMENTS.visible).eql(true);
    const location = await getWindowLocation();
    await t.expect(location.href).contains(MEASUREMENTS_VIEW);
    
    // Add measurement
    await t.click(BUTTON_MESSUNG_ADDIEREN)
        .expect(MESSUNG_DIALOG_MESSUNG_ERSTELLEN.visible).ok()
        .expect(MESSUNG_DIALOG_MESSUNG_ANTH.visible).ok()
        .expect(MEAS_HEIGHT_LABEL.visible).ok()
        .expect(MEAS_SITTING_HEIGHT_LABEL.visible).ok()
        .expect(MEAS_BODY_SPAN_LABEL.visible).ok()
        .expect(MEAS_WEIGHT_LABEL.visible).ok()
        .expect(BUTTON_MESSUNG_ABBRECHEN.visible).ok()
        .expect(BUTTON_SPEICHERN.hasAttribute('disabled')).ok()
        .click(MEAS_HEIGHT_LABEL)
        .pressKey('2')
        .pressKey('0')
        .pressKey('0')
        .expect(BUTTON_SPEICHERN.hasAttribute('disabled')).ok()
        .click(MEAS_SITTING_HEIGHT_LABEL)
        .pressKey('9')
        .pressKey('8')
        .expect(BUTTON_SPEICHERN.hasAttribute('disabled')).ok()
        .click(MEAS_BODY_SPAN_LABEL)
        .pressKey('9')
        .pressKey('2')
        .expect(BUTTON_SPEICHERN.hasAttribute('disabled')).ok()
        .click(MEAS_WEIGHT_LABEL)
        .pressKey('9')
        .pressKey('9')
        .expect(BUTTON_SPEICHERN.hasAttribute('disabled')).notOk()
        .click(BUTTON_SPEICHERN)
        .expect(Selector('th').withText('Benutzer').visible).ok()
        .expect(Selector('th').withText('Datum').visible).ok()
        .expect(Selector('th').withText('Alter').visible).ok()
        .expect(Selector('th').withText('YAPHV').visible).ok()
        .expect(Selector('th').withText('PHV').visible).ok()
        .expect(Selector('td').withText('admin').visible).ok()
        .expect(Selector('td').withText(today).visible).ok()
        .expect(Selector('td').withText('7').visible).ok()
        .expect(Selector('td').withText('-1.6').visible).ok()
//        .expect(Selector('td').withText('5.37').visible).ok() // 5.38 in db
});


test('Measurements view - check if all HTML elements are displayed.', async t => {
    // e2e Test dialog box in /measurement view, add new measurement, edit measurement, delete measurement.
    // GIVEN
    // WHEN
    // THEN
    // Log in as admin@example.org
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).ok();
    await t.click(DIVISION_EMAIL);
    for (let i = 0; i < ADMIN_EMAIL.length; i++) {
        await t.pressKey(ADMIN_EMAIL.charAt(i));
    }
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).notOk();
    await t.click(DIVISION_PASSWORD);
    for (let i = 0; i < ADMIN_PASSWORD.length; i++) {
        await t.pressKey(ADMIN_PASSWORD.charAt(i));
    }
    await t.click(ANMELDEN_BUTTON);
    await t.expect(LINK_MEASUREMENTS.visible).eql(true);
    const location = await getWindowLocation();
    await t.expect(location.href).contains(MEASUREMENTS_VIEW);

    // check if links and buttons are displayed
    await t.expect(LINK_MEASUREMENTS.visible).ok()
            .expect(LINK_USERS.visible).ok()
            .expect(LINK_PROFILE.visible).ok()
            .expect(LINK_EINSTELLUNGEN.visible).ok()
            // + button in top right corner
            .expect(BUTTON_i_TAGGED_NEUE_MESSUNG_PLUS.visible).ok()
            .expect(BUTTON_i_TAGGED_DOWNLOAD.visible).ok()
            .expect(LETZTE_MESSUNGEN_CHIP_CONTAINER.visible).ok()
            .expect(LETZTE_MESSUNGEN_CHIP.visible).notOk()
//            .click(LETZTE_MESSUNGEN_CHIP_CONTAINER)
//            .expect(LETZTE_MESSUNGEN_CHIP.visible).ok()
//            .click(LETZTE_MESSUNGEN_CHIP_CONTAINER)
//            .expect(LETZTE_MESSUNGEN_CHIP.visible).notOk()
            .expect(BUTTON_i_TAGGED_FILTER_LIST.visible).ok()
            // in filter container:
    await t.click(BUTTON_i_TAGGED_FILTER_LIST)
            .expect(MEAS_FILTER_CONTAINER.visible).ok()
            .expect(BUTTON_i_TAGGED_IN_FILTER_ADD_CIRCLE.visible).ok()
            .click(BUTTON_i_TAGGED_IN_FILTER_ADD_CIRCLE)
            .expect(BUTTON_i_TAGGED_CANCEL.visible).ok()
            .click(MEAS_FILTER_CONTAINER_SELECT)
            .click(MEAS_FILTER_CONTAINER_SELECT.find('option').withText(MEAS_DROPDOWN_OPTIONS[0]))
            .expect(MEAS_FILTER_CONTAINER_SELECT.value).eql(MEAS_DROPDOWN_OPTIONS[0])
            .click(MEAS_FILTER_CONTAINER_SELECT)
            .click(MEAS_FILTER_CONTAINER_SELECT.find('option').withText(MEAS_DROPDOWN_OPTIONS[1]))
            .expect(MEAS_FILTER_CONTAINER_SELECT.value).eql(MEAS_DROPDOWN_OPTIONS[1])
            .click(MEAS_FILTER_CONTAINER_SELECT)
            .click(MEAS_FILTER_CONTAINER_SELECT.find('option').withText(MEAS_DROPDOWN_OPTIONS[2]))
            .expect(MEAS_FILTER_CONTAINER_SELECT.value).eql(MEAS_DROPDOWN_OPTIONS[2])
            .click(MEAS_FILTER_CONTAINER_SELECT)
            .click(MEAS_FILTER_CONTAINER_SELECT.find('option').withText(MEAS_DROPDOWN_OPTIONS[3]))
            .expect(MEAS_FILTER_CONTAINER_SELECT.value).eql(MEAS_DROPDOWN_OPTIONS[3])
            // .click(MEAS_FILTER_CONTAINER_SELECT)
            // .expect(MEAS_FILTER_CONTAINER_SELECT.find('option').withText(MEAS_DROPDOWN_OPTIONS[4]).visible).ok()
            // .click(MEAS_FILTER_CONTAINER_SELECT.find('option').withText(MEAS_DROPDOWN_OPTIONS[4]))
            // .expect(MEAS_FILTER_CONTAINER_SELECT.value).eql(MEAS_DROPDOWN_OPTIONS[4])
            .click(MEAS_FILTER_CONTAINER_SELECT)
            .click(MEAS_FILTER_CONTAINER_SELECT.find('option').withText(MEAS_DROPDOWN_OPTIONS[5]))
            .expect(MEAS_FILTER_CONTAINER_SELECT.value).eql(MEAS_DROPDOWN_OPTIONS[5])
            .click(MEAS_FILTER_CONTAINER_SELECT)
            .click(MEAS_FILTER_CONTAINER_SELECT.find('option').withText(MEAS_DROPDOWN_OPTIONS[6]))
            .expect(MEAS_FILTER_CONTAINER_SELECT.value).eql(MEAS_DROPDOWN_OPTIONS[6])
            .click(MEAS_FILTER_CONTAINER_SELECT)
            .click(MEAS_FILTER_CONTAINER_SELECT.find('option').withText(MEAS_DROPDOWN_OPTIONS[7]))
            .expect(MEAS_FILTER_CONTAINER_SELECT.value).eql(MEAS_DROPDOWN_OPTIONS[7])
            .click(MEAS_FILTER_CONTAINER_SELECT)
            .click(MEAS_FILTER_CONTAINER_SELECT.find('option').withText(MEAS_DROPDOWN_OPTIONS[8]))
            .expect(MEAS_FILTER_CONTAINER_SELECT.value).eql(MEAS_DROPDOWN_OPTIONS[8])
            .click(MEAS_FILTER_CONTAINER_SELECT)
            .click(MEAS_FILTER_CONTAINER_SELECT.find('option').withText(MEAS_DROPDOWN_OPTIONS[9]))
            .expect(MEAS_FILTER_CONTAINER_SELECT.value).eql(MEAS_DROPDOWN_OPTIONS[9])
            .click(MEAS_FILTER_CONTAINER_SELECT)
            .click(MEAS_FILTER_CONTAINER_SELECT.find('option').withText(MEAS_DROPDOWN_OPTIONS[10]))
            .expect(MEAS_FILTER_CONTAINER_SELECT.value).eql(MEAS_DROPDOWN_OPTIONS[10])
            .click(MEAS_FILTER_CONTAINER_SELECT)
            .click(MEAS_FILTER_CONTAINER_SELECT.find('option').withText(MEAS_DROPDOWN_OPTIONS[11]))
            .expect(MEAS_FILTER_CONTAINER_SELECT.value).eql(MEAS_DROPDOWN_OPTIONS[11])
            .click(MEAS_FILTER_CONTAINER_SELECT)
            .click(MEAS_FILTER_CONTAINER_SELECT.find('option').withText(MEAS_DROPDOWN_OPTIONS[12]))
            .expect(MEAS_FILTER_CONTAINER_SELECT.value).eql(MEAS_DROPDOWN_OPTIONS[12])
            .click(MEAS_FILTER_CONTAINER_SELECT)
            .click(MEAS_FILTER_CONTAINER_SELECT.find('option').withText(MEAS_DROPDOWN_OPTIONS[13]))
            .expect(MEAS_FILTER_CONTAINER_SELECT.value).eql(MEAS_DROPDOWN_OPTIONS[13])
            .click(BUTTON_i_TAGGED_FILTER_LIST)
            .expect(MEAS_PAGINATION_NUMBERS.visible).ok()
            .expect(MEAS_PAGINATION_CHEVRON_LEFT.visible).ok()
            .expect(MEAS_PAGINATION_CHEVRON_RIGHT.visible).ok()
            .expect(MEAS_PAGINATION_CHEVRON_RIGHT.visible).ok()
            .expect(MEAS_PAGINATION_CHEVRON_RIGHT.hasAttribute('disabled')).ok()
            // edit dialog box
            .wait(250)
            .click(MEAS_EDIT_BUTTON)
            .wait(250)
            .expect(MEAS_EDIT_DIALOG.visible).ok()
            .wait(250)
            .expect(BUTTON_SPEICHERN.visible).ok()
            .expect(BUTTON_MESSUNG_ABBRECHEN.visible).ok()
            .click(BUTTON_MESSUNG_ABBRECHEN)
            .expect(MEAS_EDIT_DIALOG.visible).notOk()
            // delete measurement
            .click(MEAS_DELETE_CHECK_BOX)
            .expect(MEAS_DELETE_BUTTON.visible).ok()
            .click(MEAS_DELETE_BUTTON)
            .expect(NO_MEASUREMENTS.visible).ok()
        });


test('Settings view - check if all HTML elements are displayed in /settings view..', async t => {
    // e2e Test 
    // GIVEN
    // WHEN
    // THEN
    // Log in as admin@example.org
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).ok()
            .click(DIVISION_EMAIL);
    for (let i = 0; i < ADMIN_EMAIL.length; i++) {
        await t.pressKey(ADMIN_EMAIL.charAt(i));
    }
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).notOk()
            .click(DIVISION_PASSWORD);
    for (let i = 0; i < ADMIN_PASSWORD.length; i++) {
        await t.pressKey(ADMIN_PASSWORD.charAt(i));
    }
    await t.click(ANMELDEN_BUTTON)
            .expect(LINK_EINSTELLUNGEN.visible).eql(true);
    // Navigate to 'settings'
    await t.click(LINK_EINSTELLUNGEN);
    let location = await getWindowLocation();
    await t.expect(location.href).contains(SETTINGS_VIEW)
            .expect(SETTINGS_HEADER.visible).ok()
            .expect(SETTINGS_ERINNERUNG_IN_TAGEN.visible).ok()
            .expect(SETTINGS_MAIL_SERVER.visible).ok()
            .expect(SETTINGS_PORT.visible).ok()
            .expect(SETTINGS_USERNAME.visible).ok()
            .expect(SETTINGS_PASSWORT.visible).ok()
            .expect(SETTINGS_SLL_CHECKBOX.visible).ok()
            .expect(SETTINGS_CODE.visible).ok()
            .expect(SETTINGS_COPY_CODE_BUTTON.visible).ok()
            .expect(SETTINGS_SEND_EMAIL_TEST.visible).ok()
            .expect(SETTINGS_SPEICHERN_BUTTON.visible).ok()
            .expect(SETTINGS_GENERATE_CODE_BUTTON.visible).ok()
            //check values in these input fields
            .expect(SETTINGS_ERINNERUNG_IN_TAGEN.value).eql('90')
            .expect(SETTINGS_MAIL_SERVER.value).eql(SETTINGS_INPUT_MAIL_SERVER)
            .expect(SETTINGS_PORT.value).eql(SETTINGS_INPUT_PORT)
            .expect(SETTINGS_USERNAME.value).eql(SETTINGS_INPUT_USERNAME)
            .expect(SETTINGS_PASSWORT.value).eql('')
            .expect(SETTINGS_SLL_CHECKBOX.checked).ok()
});


test('Users view - check if all HTML elements in /users view are displayed.', async t => {
    // e2e Test 
    // GIVEN
    // WHEN
    // THEN
    // Log in as admin@example.org
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).ok()
            .click(DIVISION_EMAIL);
    for (let i = 0; i < ADMIN_EMAIL.length; i++) {
        await t.pressKey(ADMIN_EMAIL.charAt(i));
    }
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).notOk()
            .click(DIVISION_PASSWORD);
    for (let i = 0; i < ADMIN_PASSWORD.length; i++) {
        await t.pressKey(ADMIN_PASSWORD.charAt(i));
    }
    // 
    await t.click(ANMELDEN_BUTTON)
            .expect(LINK_USERS.visible).eql(true);
    // Navigate to 'users'
    await t.click(LINK_USERS);

    
    let location = await getWindowLocation();
    await t.expect(location.href).contains(USERS_VIEW)
            //check if all links are displayed
            .expect(LINK_MEASUREMENTS.visible).ok()
            .expect(LINK_USERS.visible).ok()
            .expect(LINK_PROFILE.visible).ok()
            .expect(LINK_EINSTELLUNGEN.visible).ok()
            .expect(USERS_HEADER.visible).ok()
            //check if all buttons/icons are visible
            .expect(BUTTON_i_TAGGED_FILTER_LIST.visible).ok()
            .expect(BUTTON_i_TAGGED_DOWNLOAD.visible).ok()
            .expect(CHECKBOX_DELETE_ALL_CHECK.visible).ok()
            .click(CHECKBOX_DELETE_ALL_CHECK)
            .expect(USERS_DELETE_INFO_ALL_SELECTED.visible).ok()
            .expect(USERS_DELETE_BIN_ICON.visible).ok()
            .click(CHECKBOX_DELETE_ALL_CHECK)
            .expect(USERS_DELETE_CHECK_BOX.visible).ok()
            .click(USERS_DELETE_CHECK_BOX)
            .expect(USERS_DELETE_INFO_1_SELECTED.visible).ok()
            .expect(USERS_DELETE_BIN_ICON.visible).ok()
            .click(USERS_DELETE_CHECK_BOX)
            .expect(BUTTON_USERS_EDIT.visible).ok()
            .expect(BUTTON_USERS_NEW_BENUTZER.visible).ok()
            .click(BUTTON_USERS_NEW_BENUTZER)
            //check content of a table
            .expect(Selector('th').withText('Benutzername').visible).ok()
            .expect(Selector('th').withText('E-Mail').visible).ok()
            .expect(Selector('th').withText('Admin').visible).ok()
            .expect(Selector('td').withText('admin').visible).ok()
            .expect(Selector('td').withText('admin@example.org').visible).ok()
            .expect(Selector('td > i').withText('check').visible).ok()
            //check pagination
            .expect(USERS_PAGINATION_NUMBERS.visible).ok()
            .expect(USERS_PAGINATION_CHEVRON_LEFT.visible).ok()
            .expect(USERS_PAGINATION_CHEVRON_RIGHT.visible).ok()
            .expect(USERS_PAGINATION_FIRST_PAGE.visible).ok()
            .expect(USERS_PAGINATION_LAST_PAGE.visible).ok()
            .click(BUTTON_USERS_ABBRECHEN)
            //check edit dialogbox
            .click(BUTTON_USERS_EDIT)
            .expect(USERS_EDIT_DIALOGBOX_HEADER.visible).ok()
            .expect(USERS_EDIT_DIALOGBOX_BENUTZERNAME.visible).ok()
            .expect(USERS_EDIT_DIALOGBOX_BENUTZERNAME.value).eql('admin')
            .expect(USERS_EDIT_DIALOGBOX_EMAIL.visible).ok()
            .expect(USERS_EDIT_DIALOGBOX_EMAIL.value).eql('admin@example.org')
            .expect(BUTTON_USERS_SPEICHERN.visible).ok()
            .click(BUTTON_USERS_ABBRECHEN)
            //check filter & filter dialog box
            .expect(BUTTON_USERS_FILTER.visible).ok()
            .click(BUTTON_USERS_FILTER)
            .expect(BUTTON_USERS_NEW_BENUTZER_IN_DIALOGB.visible).ok()
            .click(BUTTON_USERS_NEW_BENUTZER_IN_DIALOGB)
            .expect(BUTTON_USERS_CANCEL.visible).ok()
            .click(USERS_FILTER_CONTAINER_SELECT)
            .click(USERS_FILTER_CONTAINER_SELECT.find('option').withText(USERS_FILTER_DROPDOWN_OPTIONS[0]))
            .expect(USERS_FILTER_CONTAINER_SELECT.value).eql(USERS_FILTER_DROPDOWN_OPTIONS[0])
            .expect(USERS_FILTER_CONTAINER_INPUT.withText('').visible).ok()
            .click(USERS_FILTER_CONTAINER_SELECT)
            .click(USERS_FILTER_CONTAINER_SELECT.find('option').withText(USERS_FILTER_DROPDOWN_OPTIONS[1]))
            .expect(USERS_FILTER_CONTAINER_SELECT.value).eql(USERS_FILTER_DROPDOWN_OPTIONS[1])
            .expect(USERS_FILTER_CONTAINER_INPUT.withText('').visible).ok()
            .click(USERS_FILTER_CONTAINER_SELECT)
            .click(USERS_FILTER_CONTAINER_SELECT.find('option').withText(USERS_FILTER_DROPDOWN_OPTIONS[2]))
            .expect(USERS_FILTER_CONTAINER_SELECT.value).eql(USERS_FILTER_DROPDOWN_OPTIONS[2])
            .expect(BUTTON_USERS_EQUAL_SIGN.visible).ok()
            .expect(BUTTON_USERS_ADMIN_CHECK.visible).ok()
            .click(BUTTON_USERS_ADMIN_CHECK)
            .expect(BUTTON_USERS_ADMIN_UNCHECKED.visible).ok()
            .click(BUTTON_USERS_ADMIN_UNCHECKED)
});


test('Users view - check if all HTML elements are displayed in "Fehler melden" iframe.', async t => {
    // e2e Test 
    // GIVEN
    // WHEN
    // THEN
    // Log in as admin@example.org
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).ok()
            .click(DIVISION_EMAIL);
    for (let i = 0; i < ADMIN_EMAIL.length; i++) {
        await t.pressKey(ADMIN_EMAIL.charAt(i));
    }
    await t.expect(ANMELDEN_BUTTON.hasAttribute('disabled')).notOk()
            .click(DIVISION_PASSWORD);
    for (let i = 0; i < ADMIN_PASSWORD.length; i++) {
        await t.pressKey(ADMIN_PASSWORD.charAt(i));
    }
    await t.click(ANMELDEN_BUTTON)
            .expect(LINK_FEHLER_MELDEN.visible).eql(true);
    // Bring up 'Fehler melden' dialog box
    await t.expect(LINK_FEHLER_MELDEN.visible).ok()
            .click(LINK_FEHLER_MELDEN)
            .wait(5000)
            .switchToIframe(IFRAME_FEHLER_MELDUNF)
            .expect(FEHLER_MELDEN_HEADER.visible).ok()
            .expect(FEHLER_MELDEN_INFO.visible).ok()
            .expect(LABEL_FEHLER_MELDEN_DESCRIPTION.visible).ok()
            .expect(TEXTAREA_FEHLER_MELDEN_DESCRIPTION.visible).ok()
            .expect(LABEL_FOR_SCREENSHOT_FRHLER_MELDEN.visible).ok()
            .expect(BUTTON_CHOOSE_FILES_FRHLER_MELDEN.visible).ok()
            .expect(LABEL_NAME_FRHLER_MELDEN.visible).ok()
            .expect(INPUT_FULL_NAME_FRHLER_MELDEN.visible).ok()
            .expect(LABEL_EMAIL_FRHLER_MELDEN.visible).ok()
            .expect(INPUT_CHECKBOX_FRHLER_MELDEN.visible).ok()
            .expect(LABEL_FOR_WEB_INFO_CONSENT_FEHLER_MELDEN.visible).ok()
            .expect(LINK_SHOW_RECORDED_WEB_INFO_FEHLER_MELDEN.visible).ok()
            .expect(INPUT_SUBMIT_FEHLER_MELDEN.visible).ok()
            .expect(LINK_CANCEL_FEHLER_MELDUMG.visible).ok()
            .click(LINK_CANCEL_FEHLER_MELDUMG)
            .switchToMainWindow()
            .expect(Selector('button').withExactText('ABMELDEN').visible).ok()
});