from threading import Thread
from flask_mail import Message, Mail
from flask import request, render_template
from .config import BaseConfig


def send_async_email(app, msg):
    from api import mail
    with app.app_context():
        try:
            mail.send(msg)
        except ConnectionRefusedError:
            raise "[MAIL SERVER] not working"



def send_email(user, subject, template):
    from api import app
    token = user.get_reset_token()
    base_url = request.host_url + "reset?token={}".format(token)
    username = user.username



    msg = Message()
    msg.subject = subject
    #msg.sender = os.getenv('MAIL_USERNAME')
    msg.sender = BaseConfig.MAIL_USERNAME
    msg.recipients = [user.email]
    msg.html = render_template(template,
                                base_url=base_url + token, username=username)

    Thread(target=send_async_email, args=(app, msg)).start()





