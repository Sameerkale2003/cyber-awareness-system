from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('modules/', views.ModuleListView.as_view(), name='module-list'),
    path('modules/<int:pk>/', views.ModuleDetailView.as_view(), name='module-detail'),
    path('lessons/<int:pk>/', views.LessonDetailView.as_view(), name='lesson-detail'),
    path('tips/', views.CyberTipListView.as_view(), name='tip-list'),
    path('featured/', views.FeaturedContentView.as_view(), name='featured-content'),
    path('pledge/', views.SafetyPledgeView.as_view(), name='safety-pledge'),
]
