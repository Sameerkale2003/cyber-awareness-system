from django.urls import path
from . import views

urlpatterns = [
    path('', views.QuizListView.as_view(), name='quiz-list'),
    path('<int:pk>/', views.QuizDetailView.as_view(), name='quiz-detail'),
    path('<int:pk>/submit/', views.SubmitQuizView.as_view(), name='quiz-submit'),
    path('attempts/<int:pk>/', views.QuizResultView.as_view(), name='quiz-result'),
    path('history/', views.QuizHistoryView.as_view(), name='quiz-history'),
    path('leaderboard/', views.QuizLeaderboardView.as_view(), name='quiz-leaderboard'),
]
