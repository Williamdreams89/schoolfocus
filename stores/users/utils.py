from django.core.mail import EmailMessage

class Utils:
    @staticmethod
    def send_email(payload):
        email = EmailMessage(subject=payload["EMAIL_SUBJECT"], body=payload["EMAIL_BODY"], to=(payload["EMAIL_TO"],), from_email="admin@livingcareservices.org")
        email.send(fail_silently=False)