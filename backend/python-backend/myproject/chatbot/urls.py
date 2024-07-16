from django.urls import path
from .views import ChatbotView

urlpatterns = [
    path('predict/', ChatbotView.as_view(), name='chatbot_predict'),
]
