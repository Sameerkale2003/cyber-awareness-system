from rest_framework import serializers
from .models import Category, Module, Lesson, CyberTip, SafetyPledge


class CategorySerializer(serializers.ModelSerializer):
    modules_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'description', 'icon', 'color', 'order', 'modules_count')

    def get_modules_count(self, obj):
        return obj.modules.filter(is_published=True).count()


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('id', 'title', 'content', 'lesson_type', 'order')


class ModuleListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    lessons_count = serializers.ReadOnlyField()

    class Meta:
        model = Module
        fields = (
            'id', 'title', 'description', 'category', 'difficulty',
            'duration_minutes', 'thumbnail', 'order', 'lessons_count', 'created_at'
        )


class ModuleDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    lessons_count = serializers.ReadOnlyField()

    class Meta:
        model = Module
        fields = (
            'id', 'title', 'description', 'category', 'difficulty',
            'duration_minutes', 'thumbnail', 'order', 'lessons_count',
            'lessons', 'created_at', 'updated_at'
        )


class CyberTipSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = CyberTip
        fields = ('id', 'title', 'content', 'category', 'icon', 'is_featured', 'created_at')


class SafetyPledgeSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = SafetyPledge
        fields = ('id', 'user_name', 'pledge_text', 'pledged_at')
        read_only_fields = ('id', 'user_name', 'pledged_at')
