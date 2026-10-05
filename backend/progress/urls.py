from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('', views.UserProgressView.as_view(), name='user-progress'),
    path('update/', views.UpdateProgressView.as_view(), name='update-progress'),
    path('activity/', views.UserActivityView.as_view(), name='user-activity'),
    path('achievements/', views.AchievementListView.as_view(), name='achievements'),
    path('leaderboard/', views.GlobalLeaderboardView.as_view(), name='global-leaderboard'),
]
