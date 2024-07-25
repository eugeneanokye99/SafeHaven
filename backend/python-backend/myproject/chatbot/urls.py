from django.urls import path
from .views import chatbot

urlpatterns = [
    path('predict/', chatbot, name='chatbot_predict'),
]
