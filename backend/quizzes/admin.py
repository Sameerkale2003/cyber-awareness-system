from django.contrib import admin
from .models import Quiz, Question, Answer, QuizAttempt, UserAnswer


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 4
    fields = ('answer_text', 'is_correct', 'explanation')


class QuestionInline(admin.StackedInline):
    model = Question
    extra = 2
    show_change_link = True


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'passing_score', 'time_limit_minutes', 'questions_count', 'is_active')
    list_filter = ('is_active', 'module__category')
    search_fields = ('title', 'description')
    list_editable = ('is_active',)
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'quiz', 'question_type', 'points', 'order')
    list_filter = ('quiz', 'question_type')
    search_fields = ('question_text',)
    inlines = [AnswerInline]


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'quiz', 'score', 'passed', 'started_at', 'time_taken_seconds')
    list_filter = ('passed', 'quiz')
    search_fields = ('user__username', 'quiz__title')
    readonly_fields = ('started_at', 'completed_at')
