import time
from threading import Thread
from email.mime.text import MIMEText
from flask import request, render_template
from .models import AdminConfig

import smtplib
import email.utils


def send_async_email(to_email, config, msg):

    if config.mail_port:
        serverport = int(config.mail_port)
    else:
        serverport = 25

    if config.mail_use_ssl:
        server = smtplib.SMTP_SSL(config.mail_server, serverport)
    else:
        server = smtplib.SMTP(config.mail_server, serverport)

    try:
        # Enable for SMTP Debugging
        # server.set_debuglevel(True)

        # identify ourselves, prompting server for supported features
        server.ehlo()

        # If we can encrypt this session, do it
        if server.has_extn('STARTTLS'):
            server.starttls()
            server.ehlo()  # reidentify ourselves over TLS connection

        if server.has_extn('AUTH'):
            server.login(config.mail_username, config.mail_password)

        server.sendmail(config.mail_server,
                        [to_email],
                        msg.as_string())
    finally:
        server.quit()


# [BEGIN send_email_password_reset]
def send_email_with_token(user, subject, template, url):
    username = user.username
    content = render_template(template, url=url, username=username)

    try:
        config = AdminConfig.get_config()
    except ConnectionRefusedError:
        raise 'Could not read server config from database'

    # Prompt the user for connection info
    to_email = user.email
    sender_mail = config.mail_username

    # Create the message
    msg = MIMEText(content, 'html')
    msg.set_unixfrom('author')
    msg['To'] = email.utils.formataddr(('Recipient', to_email))
    msg['From'] = email.utils.formataddr(('BioBanding', sender_mail))
    msg['Subject'] = subject

    Thread(target=send_async_email, args=(to_email, config, msg)).start()
# [END send_email_password_reset]

# [BEGIN send_email]
def send_email(to_mail, content, subject):

    try:
        config = AdminConfig.get_config()
    except ConnectionRefusedError:
        raise 'Could not read server config from database'

    # Prompt the user for connection info
    to_email = to_mail
    sender_mail = config.mail_username

    # Create the message
    msg = MIMEText(content, 'plain')
    msg.set_unixfrom('author')
    msg['To'] = email.utils.formataddr(('Recipient', to_email))
    msg['From'] = email.utils.formataddr(('BioBanding', sender_mail))
    msg['Subject'] = subject

    Thread(target=send_async_email, args=(to_email, config, msg)).start()
# [END send_email]









