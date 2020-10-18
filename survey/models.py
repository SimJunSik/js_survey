from django.db import models

# Create your models here.


class Survey(models.Model):
    """
        설문 Model
    """
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title

    @property
    def response_count(self):
        return self.responses.all().count()


class Question(models.Model):
    """
        질문 Model
    """
    TYPE_CHOICES = (
        ('select', 'select'),
        ('radio', 'radio'),
        ('checkbox', 'checkbox'),
    )

    survey = models.ForeignKey(
        Survey, on_delete=models.CASCADE, related_name='questions', null=True, blank=True)
    title = models.CharField(max_length=100, default='제목없음')
    question_type = models.CharField(
        max_length=10, choices=TYPE_CHOICES, default='select')
    limit = models.IntegerField(default=1)

    def __str__(self):
        return self.title

    @property
    def answer_count(self):
        """
            해당 Question 총 응답 갯수 return
        """
        return self.answers.all().count()


class Option(models.Model):
    """
        질문에 달리는 옵션 Model
    """
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name='options')
    content = models.CharField(max_length=50, default='내용없음')

    def __str__(self):
        return '{} : {}'.format(self.question, self.content)

    @property
    def response_rate(self):
        """
            question_type에 따라 해당 Option 응답 비율 return
        """
        answers = self.question.answers.all()
        if self.question.question_type == 'checkbox':
            total_count = 0
            this_count = 0
            for answer in answers:
                total_count += answer.answer_count
                if self.content in answer.content:
                    this_count += 1
        else:
            total_count = answers.count()
            this_count = answers.filter(content=self.content).count()

        try:
            result = this_count/total_count * 100
        except ZeroDivisionError:
            result = 0
        return result


class Response(models.Model):
    """
        설문결과를 응답자별로 다루기 위한 Model
    """
    survey = models.ForeignKey(
        Survey, on_delete=models.CASCADE, related_name='responses', null=True, blank=True)
    responser = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.responser


class Answer(models.Model):
    """
        응답자의 각 질문에 대한 선택결과 저장 Model
    """
    response = models.ForeignKey(
        Response, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name='answers')
    content = models.CharField(max_length=50)
    answer_count = models.IntegerField(default=1)

    def __str__(self):
        return '{} : {}'.format(self.question, self.content)
