from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Avg, Count

from .models import UserProgress, UserActivity, Achievement, UserAchievement, DailyStreak
from .serializers import (
    UserProgressSerializer, UserActivitySerializer,
    AchievementSerializer, UserAchievementSerializer, DailyStreakSerializer
)


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from quizzes.models import QuizAttempt
        from learning.models import Module, CyberTip, SafetyPledge

        user = request.user
        total_modules = Module.objects.filter(is_published=True).count()
        completed_modules = UserProgress.objects.filter(user=user, status='completed').count()
        in_progress_modules = UserProgress.objects.filter(user=user, status='in_progress').count()

        attempts = QuizAttempt.objects.filter(user=user)
        avg_score = attempts.aggregate(avg=Avg('score'))['avg'] or 0
        passed_quizzes = attempts.filter(passed=True).count()

        streak_obj, _ = DailyStreak.objects.get_or_create(user=user)
        recent_activities = UserActivity.objects.filter(user=user)[:10]
        achievements = UserAchievement.objects.filter(user=user).select_related('achievement')
        has_pledged = SafetyPledge.objects.filter(user=user).exists()

        # Category progress
        from learning.models import Category
        categories = Category.objects.all()
        category_progress = []
        for cat in categories:
            cat_modules = Module.objects.filter(category=cat, is_published=True)
            cat_total = cat_modules.count()
            cat_done = UserProgress.objects.filter(
                user=user, module__in=cat_modules, status='completed'
            ).count()
            if cat_total > 0:
                category_progress.append({
                    'name': cat.name,
                    'icon': cat.icon,
                    'color': cat.color,
                    'total': cat_total,
                    'completed': cat_done,
                    'percentage': round((cat_done / cat_total) * 100),
                })

        # Leaderboard rank
        from django.contrib.auth import get_user_model
        User_model = get_user_model()
        rank = User_model.objects.filter(points__gt=user.points, is_active=True).count() + 1

        return Response({
            'user': {
                'username': user.username,
                'full_name': user.full_name,
                'points': user.points,
                'rank': rank,
            },
            'modules': {
                'total': total_modules,
                'completed': completed_modules,
                'in_progress': in_progress_modules,
                'completion_rate': round((completed_modules / total_modules * 100) if total_modules else 0),
            },
            'quizzes': {
                'total_attempts': attempts.count(),
                'passed': passed_quizzes,
                'average_score': round(avg_score, 1),
            },
            'streak': {
                'current': streak_obj.current_streak,
                'longest': streak_obj.longest_streak,
            },
            'achievements_count': achievements.count(),
            'has_pledged': has_pledged,
            'recent_activities': UserActivitySerializer(recent_activities, many=True).data,
            'category_progress': category_progress,
        })


class UserProgressView(generics.ListAPIView):
    serializer_class = UserProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user).select_related('module__category')


class UpdateProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        module_id = request.data.get('module_id')
        progress_pct = request.data.get('progress_percentage', 0)
        mark_complete = request.data.get('mark_complete', False)

        try:
            from learning.models import Module
            module = Module.objects.get(id=module_id, is_published=True)
        except Exception:
            return Response({'detail': 'Module not found.'}, status=404)

        progress, created = UserProgress.objects.get_or_create(
            user=request.user,
            module=module,
            defaults={'status': 'in_progress', 'started_at': timezone.now()}
        )

        if created:
            progress.started_at = timezone.now()
            progress.status = 'in_progress'

        progress.progress_percentage = max(progress.progress_percentage, int(progress_pct))

        if mark_complete and progress.status != 'completed':
            progress.status = 'completed'
            progress.progress_percentage = 100
            progress.completed_at = timezone.now()
            request.user.add_points(20, f'Completed: {module.title}')
            UserActivity.objects.create(
                user=request.user,
                activity_type='module_completed',
                description=f'Completed module: {module.title}',
                points_earned=20
            )
        elif progress.status == 'not_started':
            progress.status = 'in_progress'
            progress.started_at = timezone.now()

        progress.save()
        return Response(UserProgressSerializer(progress).data)


class UserActivityView(generics.ListAPIView):
    serializer_class = UserActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserActivity.objects.filter(user=self.request.user)[:30]


class AchievementListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        all_achievements = Achievement.objects.all()
        user_achievements = UserAchievement.objects.filter(user=request.user).values_list(
            'achievement_id', flat=True
        )
        data = []
        for ach in all_achievements:
            data.append({
                'id': ach.id,
                'name': ach.name,
                'description': ach.description,
                'icon': ach.icon,
                'points_required': ach.points_required,
                'badge_color': ach.badge_color,
                'earned': ach.id in user_achievements,
                'progress': min(100, round((request.user.points / ach.points_required) * 100))
            })
        return Response(data)


class GlobalLeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.contrib.auth import get_user_model
        from quizzes.models import QuizAttempt
        User_model = get_user_model()

        users = User_model.objects.filter(is_active=True).order_by('-points')[:20]
        data = []
        for i, u in enumerate(users, 1):
            completed = UserProgress.objects.filter(user=u, status='completed').count()
            attempts = QuizAttempt.objects.filter(user=u)
            avg_score = attempts.aggregate(avg=Avg('score'))['avg'] or 0
            data.append({
                'rank': i,
                'username': u.username,
                'full_name': u.full_name,
                'points': u.points,
                'modules_completed': completed,
                'quizzes_taken': attempts.count(),
                'average_score': round(avg_score, 1),
                'is_current_user': u.id == request.user.id,
            })
        return Response(data)
