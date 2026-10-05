from django.contrib import admin
from .models import UserProgress, UserActivity, Achievement, UserAchievement, DailyStreak


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'module', 'status', 'progress_percentage', 'started_at', 'completed_at')
    list_filter = ('status', 'module__category')
    search_fields = ('user__username', 'module__title')
    readonly_fields = ('started_at', 'completed_at')


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'description', 'points_earned', 'created_at')
    list_filter = ('activity_type',)
    search_fields = ('user__username', 'description')
    readonly_fields = ('created_at',)


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon', 'points_required', 'badge_color')
    search_fields = ('name',)


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ('user', 'achievement', 'earned_at')
    list_filter = ('achievement',)
    search_fields = ('user__username',)
    readonly_fields = ('earned_at',)


@admin.register(DailyStreak)
class DailyStreakAdmin(admin.ModelAdmin):
    list_display = ('user', 'current_streak', 'longest_streak', 'last_activity_date')
    search_fields = ('user__username',)
