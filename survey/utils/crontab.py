from django.core.mail import send_mail
import datetime

from ..models import Survey


def send_result():
    """
        관리자에게 응답자 통계 email 전송
    """
    now = datetime.datetime.now()
    now_date = now.strftime('%Y-%m-%d %H:%M')
    survey = Survey.objects.get(id=1)
    response_count = survey.responses.all().count()

    title = '[JS-Survey] {} 응답자 통계'.format(now_date)
    message = '{} 까지 응답자 통계\n총 : {}명'.format(now_date, response_count)

    send_mail(
        title,
        message,
        'no-reply@example.com',
        ['wnstlr24@gmail.com'],
        fail_silently=False,
    )

    pass
