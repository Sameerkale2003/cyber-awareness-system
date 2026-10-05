from rest_framework import serializers
from .models import Quiz, Question, Answer, QuizAttempt, UserAnswer


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('id', 'answer_text')   # is_correct hidden during quiz


class AnswerResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('id', 'answer_text', 'is_correct', 'explanation')


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'question_text', 'question_type', 'order', 'points', 'answers')


class QuizListSerializer(serializers.ModelSerializer):
    questions_count = serializers.ReadOnlyField()
    module_title = serializers.CharField(source='module.title', read_only=True)

    class Meta:
        model = Quiz
        fields = ('id', 'title', 'description', 'module_title', 'passing_score',
                  'time_limit_minutes', 'questions_count', 'created_at')


class QuizDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    questions_count = serializers.ReadOnlyField()

    class Meta:
        model = Quiz
        fields = ('id', 'title', 'description', 'passing_score',
                  'time_limit_minutes', 'questions_count', 'questions')


class UserAnswerInputSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    answer_id = serializers.IntegerField()


class QuizSubmitSerializer(serializers.Serializer):
    answers = UserAnswerInputSerializer(many=True)
    time_taken_seconds = serializers.IntegerField(default=0)


class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    user_answers = serializers.SerializerMethodField()

    class Meta:
        model = QuizAttempt
        fields = ('id', 'quiz_title', 'score', 'passed', 'started_at',
                  'completed_at', 'time_taken_seconds', 'user_answers')

    def get_user_answers(self, obj):
        result = []
        for ua in obj.user_answers.select_related('question', 'selected_answer').all():
            correct_answer = ua.question.answers.filter(is_correct=True).first()
            result.append({
                'question': ua.question.question_text,
                'question_type': ua.question.question_type,
                'selected_answer': ua.selected_answer.answer_text if ua.selected_answer else None,
                'is_correct': ua.is_correct,
                'correct_answer': correct_answer.answer_text if correct_answer else None,
                'explanation': correct_answer.explanation if correct_answer else '',
                'all_answers': AnswerResultSerializer(ua.question.answers.all(), many=True).data,
            })
        return result
