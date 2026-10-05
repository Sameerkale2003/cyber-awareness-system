from django.contrib import admin
from .models import Category, Module, Lesson, CyberTip, SafetyPledge


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon', 'color', 'order')
    list_editable = ('order',)
    search_fields = ('name',)


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'difficulty', 'duration_minutes', 'is_published', 'created_at')
    list_filter = ('category', 'difficulty', 'is_published')
    search_fields = ('title', 'description')
    list_editable = ('is_published',)
    ordering = ('order',)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'lesson_type', 'order', 'is_published')
    list_filter = ('lesson_type', 'is_published', 'module__category')
    search_fields = ('title', 'content')
    ordering = ('module', 'order')


@admin.register(CyberTip)
class CyberTipAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'icon', 'is_featured', 'created_at')
    list_filter = ('category', 'is_featured')
    search_fields = ('title', 'content')
    list_editable = ('is_featured',)


@admin.register(SafetyPledge)
class SafetyPledgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'pledged_at')
    search_fields = ('user__username',)
    readonly_fields = ('pledged_at',)
