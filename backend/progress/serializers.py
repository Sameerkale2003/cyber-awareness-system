from rest_framework import serializers
from .models import UserProgress, UserActivity, Achievement, UserAchievement, DailyStreak
from learning.serializers import ModuleListSerializer


class UserProgressSerializer(serializers.ModelSerializer):
    module = ModuleListSerializer(read_only=True)
    module_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = UserProgress
        fields = ('id', 'module', 'module_id', 'status', 'progress_percentage',
                  'started_at', 'completed_at')
        read_only_fields = ('id', 'started_at', 'completed_at')


class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = ('id', 'activity_type', 'description', 'points_earned', 'created_at')


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ('id', 'name', 'description', 'icon', 'points_required', 'badge_color')


class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)

    class Meta:
        model = UserAchievement
        fields = ('id', 'achievement', 'earned_at')


class DailyStreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyStreak
        fields = ('current_streak', 'longest_streak', 'last_activity_date')
