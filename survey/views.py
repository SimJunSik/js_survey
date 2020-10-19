import datetime
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import csv

from .models import *


def edit(request):
    """
        설문 내용 편집 페이지 render
    """
    survey = Survey.objects.filter(
        id=1).prefetch_related('questions__options')[0]

    context = {
        'survey': survey,
        'category': 'edit'
    }

    return render(request, 'survey/edit.html', context)


@csrf_exempt
def create_question(request):
    """
        새로운 Question 생성
    """
    try:
        req_json = json.load(request)
        survey = Survey.objects.get(id=1)
        new_question = Question.objects.create(
            survey=survey
        )

        return JsonResponse({
            'result': 'SUCCESS',
            'description': 'SUCCESSED CREATE QUESTION',
            "new_question_id": new_question.id
        })
    except:
        return JsonResponse({
            'result': 'FAIL',
            'description': 'FAILED CREATE QUESTION',
        })


@csrf_exempt
def delete_update_question(request, question_id):
    """
        question_id 에 해당하는 Question 삭제 혹은 업데이트

        # DELETE
            - question_id 에 해당하는 Question 삭제
        # PUT
            - question_id 에 해당하는 Question 업데이트

        ---
        # Query Params
            - question_id : Integer
    """
    if request.method == 'DELETE':
        try:
            question = Question.objects.get(id=question_id)
            question.delete()

            return JsonResponse({
                'result': 'SUCCESS',
                'description': 'SUCCESSED DELETE QUESTION'
            })
        except Exception as e:
            print(e)
            return JsonResponse({
                'result': 'FAIL',
                'description': 'FAILED DELETE QUESTION'
            })
    elif request.method == 'PUT':
        try:
            req_json = json.load(request)
            question_obj = req_json.get('question_obj')

            question = Question.objects.get(id=question_id)
            question.title = question_obj.get('title')
            question.question_type = question_obj.get('question_type')
            question.limit = question_obj.get('limit')
            question.save()

            for option_obj in question_obj.get('options'):
                option = Option.objects.get(id=option_obj.get('id'))
                option.content = option_obj.get('content')
                option.save()

            return JsonResponse({
                'result': 'SUCCESS',
                'description': 'SUCCESSED UPDATE QUESTION'
            })
        except Exception as e:
            print(e)
            return JsonResponse({
                'result': 'FAIL',
                'description': 'FAILED UPDATE QUESTION'
            })


@csrf_exempt
def create_option(request, question_id):
    """
        question_id 에 해당하는 Question에 새로운 option 생성

        ---
        # Query Params
            - question_id : Integer
    """
    try:
        question = Question.objects.get(id=question_id)
        new_option = Option.objects.create(
            question=question
        )

        return JsonResponse({
            'result': 'SUCCESS',
            'description': 'SUCCESSED CREATE OPTION',
            "new_option_id": new_option.id
        })
    except Exception as e:
        print(e)
        return JsonResponse({
            'result': 'FAIL',
            'description': 'FAILED CREATE OPTION',
        })


@csrf_exempt
def delete_option(request, question_id, option_id):
    """
        option_id 에 해당하는 Option 삭제

        ---
        # Query Params
            - option_id : Integer
    """
    try:
        option = Option.objects.get(id=option_id)
        option.delete()

        return JsonResponse({
            'result': 'SUCCESS',
            'description': 'SUCCESSED DELETE OPTION'
        })
    except Exception as e:
        print(e)
        return JsonResponse({
            'result': 'FAIL',
            'description': 'FAILED DELETE OPTION'
        })


@csrf_exempt
def update_all_question(request):
    """
        설문 전체 내용 업데이트
            - 관리자가 [설문 전체 저장] 버튼 클릭 시 호출
    """
    try:
        req_json = json.load(request)
        survey_obj = req_json.get('survey')
        question_objs = req_json.get('questions')

        survey = Survey.objects.get(id=survey_obj.get('id'))
        survey.title = survey_obj.get('title')
        survey.save()

        for question_obj in question_objs:
            question = Question.objects.get(id=question_obj.get('id'))
            question.title = question_obj.get('title')
            question.question_type = question_obj.get('question_type')
            question.limit = question_obj.get('limit')
            question.save()

            for option_obj in question_obj.get('options'):
                option = Option.objects.get(id=option_obj.get('id'))
                option.content = option_obj.get('content')
                option.save()

        return JsonResponse({
            'result': 'SUCCESS',
            'description': 'SUCCESSED UPDATE SURVEY'
        })
    except Exception as e:
        print(e)
        return JsonResponse({
            'result': 'FAIL',
            'description': 'FAILED UPDATE SURVEY'
        })


@csrf_exempt
def responser(request):
    """
        # GET
            - 사용자들이 설문에 참여하는 페이지 render
        # POST
            - 사용자들이 제출한 설문 결과 DB에 저장
    """
    if request.method == 'GET':
        survey = Survey.objects.filter(
            id=1).prefetch_related('questions__options')[0]

        context = {
            'survey': survey
        }
        return render(request, 'survey/responser.html', context)
    elif request.method == 'POST':
        phone_number = request.POST.get('phone_number')
        survey = Survey.objects.get(id=1)
        new_response = Response.objects.create(
            survey=survey,
            responser=phone_number
        )

        for key in request.POST:
            data = request.POST.getlist(key)
            content = ", ".join(data)

            if key.isnumeric():
                answer_count = len(data)
                question = Question.objects.get(id=key)
                new_answer = Answer.objects.create(
                    response=new_response,
                    question=question,
                    content=content,
                    answer_count=answer_count
                )
            elif 'order' in key:
                question_id = key.split('_')[0].split('question')[1]
                question = Question.objects.get(id=question_id)
                answer = Answer.objects.get(
                    response=new_response,
                    question=question,
                )
                answer.content = content
                answer.save()

        return redirect('/survey/result/')


def responser_result(request):
    return render(request, 'survey/responser_result.html')


def responses(request):
    """
        현재까지 저장된 설문결과를 응답자 별로 보여주는 페이지 render
    """
    survey = Survey.objects.filter(
        id=1).prefetch_related('responses__answers__question__options')[0]

    context = {
        'survey': survey,
        'category': 'responses'
    }
    return render(request, 'survey/response_list.html', context)


def statistics(request):
    """
        현재까지 저장된 설문결과의 통계를 보여주는 페이지 render
    """
    survey = Survey.objects.prefetch_related(
        'questions__answers').prefetch_related('questions__options').all()[0]

    context = {
        'survey': survey,
        'category': 'statistics'
    }
    return render(request, 'survey/statistics.html', context)


def download_result(reqeust):
    """
        현재까지 저장된 설문결과를 응답자별로 저장한 result.csv 파일을
        http response에 붙여서 반환
    """
    res = HttpResponse(content_type='text/csv')
    now = datetime.datetime.now()
    now_date = now.strftime('%Y-%m-%d_%H:%M')
    res['Content-Disposition'] = 'attachment; filename="[{}]result.csv"'.format(
        now_date)

    survey = Survey.objects.filter(
        id=1).prefetch_related('responses__answers__question__options')[0]
    responses = survey.responses.all()
    writer = csv.writer(res)

    # 현재 날짜/시간 표시
    writer.writerow([])
    writer.writerow(['', '', '', '', '', '', '', '', now_date])
    writer.writerow([])

    # 문항별 통계
    writer.writerow(['', '', '', '', '', '문항별 통계'])
    writer.writerow([])
    questions = survey.questions.all()
    for idx, question in enumerate(questions):
        writer.writerow(['Q{}.'.format(idx+1), question.title])
        writer.writerow(['type', question.question_type])
        writer.writerow(['limit', question.limit])
        writer.writerow(['옵션'])

        for option in question.options.all():
            response_rate = '{}%'.format(round(option.response_rate, 2))
            writer.writerow(['', option.content, response_rate])

        writer.writerow([])
        writer.writerow([])

    writer.writerow([])
    writer.writerow([])

    # 응답 리스트
    writer.writerow(['', '', '', '', '', '응답 리스트'])
    writer.writerow([])
    for response in responses:
        writer.writerow(['', '', '', '응답자', response.responser])
        response_date = response.created_at.strftime('%Y-%m-%d_%H:%M')
        writer.writerow(['', '', '', '응답날짜', response_date])

        for idx, answer in enumerate(response.answers.all()):
            writer.writerow(['Q{}.'.format(idx+1), answer.question.title])
            writer.writerow(['type', answer.question.question_type])
            writer.writerow(['limit', answer.question.limit])
            writer.writerow(['옵션'])

            if answer.question.question_type == 'checkbox':
                for option in answer.question.options.all():
                    if option.content in answer.content:
                        check = 'O'
                    else:
                        check = ''
                    writer.writerow(['', option.content, check])
                if answer.answer_count > 1:
                    writer.writerow(['체크순서', answer.content])
            else:
                for option in answer.question.options.all():
                    if answer.content == option.content:
                        check = 'O'
                    else:
                        check = ''
                    writer.writerow(['', option.content, check])

            writer.writerow([])
            writer.writerow([])

    return res


@csrf_exempt
def check_duplicate_responser(request):
    """
        설문 제출 시, 중복된 응답자인지 체크
    """
    req_json = json.load(request)
    responser = req_json.get('responser')
    response = Response.objects.filter(responser=responser)

    if response:
        return JsonResponse({
            'result': 'FAILED',
            'description': 'DUPLICATED RESPONSER'
        })
    else:
        return JsonResponse({
            'result': 'SUCCESS',
            'description': 'NOT DUPLICATED RESPONSER'
        })
