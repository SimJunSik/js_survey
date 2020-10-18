from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.responser),
    path('result/', views.responser_result),
    path('edit/', views.edit),
    path('question/', views.create_question),
    path('question/all/', views.update_all_question),
    path('question/<int:question_id>/', views.delete_update_question),
    path('question/<int:question_id>/option/', views.create_option),
    path('question/<int:question_id>/option/<int:option_id>/', views.delete_option),
    path('responses/', views.responses),
    path('statistics/', views.statistics),
    path('download-result/', views.download_result),
    path('check-duplicate-responser/', views.check_duplicate_responser),
]
