from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.db.models import Avg

from .models import Quiz, Question, Answer, QuizAttempt, UserAnswer
from .serializers import (
    QuizListSerializer, QuizDetailSerializer,
    QuizSubmitSerializer, QuizAttemptSerializer
)


class QuizListView(generics.ListAPIView):
    serializer_class = QuizListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Quiz.objects.filter(is_active=True)


class QuizDetailView(generics.RetrieveAPIView):
    serializer_class = QuizDetailSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Quiz.objects.filter(is_active=True).prefetch_related('questions__answers')


class SubmitQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            quiz = Quiz.objects.prefetch_related('questions__answers').get(pk=pk, is_active=True)
        except Quiz.DoesNotExist:
            return Response({'detail': 'Quiz not found.'}, status=404)

        serializer = QuizSubmitSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        answers_data = serializer.validated_data['answers']
        time_taken = serializer.validated_data.get('time_taken_seconds', 0)

        # Create attempt
        attempt = QuizAttempt.objects.create(
            user=request.user,
            quiz=quiz,
            time_taken_seconds=time_taken,
            completed_at=timezone.now()
        )

        # Grade answers
        total_points = 0
        earned_points = 0
        for item in answers_data:
            try:
                question = quiz.questions.get(id=item['question_id'])
                answer = question.answers.get(id=item['answer_id'])
                is_correct = answer.is_correct
                UserAnswer.objects.create(
                    attempt=attempt,
                    question=question,
                    selected_answer=answer,
                    is_correct=is_correct
                )
                total_points += question.points
                if is_correct:
                    earned_points += question.points
            except (Question.DoesNotExist, Answer.DoesNotExist):
                pass

        score = (earned_points / total_points * 100) if total_points > 0 else 0
        passed = score >= quiz.passing_score
        attempt.score = round(score, 1)
        attempt.passed = passed
        attempt.save()

        # Award points and record activity
        points_awarded = 0
        if passed:
            points_awarded = 50
            request.user.add_points(points_awarded)
        else:
            points_awarded = 10
            request.user.add_points(points_awarded)

        from progress.models import UserActivity
        UserActivity.objects.create(
            user=request.user,
            activity_type='quiz_taken',
            description=f'Completed quiz: {quiz.title} — Score: {score:.0f}%',
            points_earned=points_awarded
        )

        return Response({
            'attempt_id': attempt.id,
            'score': attempt.score,
            'passed': attempt.passed,
            'points_awarded': points_awarded,
            'message': 'Excellent! You passed! 🎉' if passed else 'Keep practicing! You can do better.',
        })


class QuizResultView(generics.RetrieveAPIView):
    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user)


class QuizHistoryView(generics.ListAPIView):
    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user).order_by('-started_at')


class QuizLeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.contrib.auth import get_user_model
        User = get_user_model()

        users = User.objects.filter(is_active=True).order_by('-points')[:20]
        data = []
        for i, u in enumerate(users, 1):
            attempts = QuizAttempt.objects.filter(user=u)
            avg_score = attempts.aggregate(avg=Avg('score'))['avg'] or 0
            data.append({
                'rank': i,
                'username': u.username,
                'full_name': u.full_name,
                'points': u.points,
                'quizzes_taken': attempts.count(),
                'average_score': round(avg_score, 1),
                'is_current_user': u.id == request.user.id,
            })
        return Response(data)
