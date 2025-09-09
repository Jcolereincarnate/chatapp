from . import views
from django.urls import path

urlpatterns = [
    path('', views.createroom, name='index'),
    path('<str:room_name>/<str:username>/', views.messageview, name='room'),]