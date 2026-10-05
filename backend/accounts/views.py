from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError
from django.db.models import Avg

from .models import User
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer,
    UserProfileSerializer, ChangePasswordSerializer
)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            profile = UserProfileSerializer(user, context={'request': request})
            return Response({
                'message': 'Registration successful! Welcome to Cyber Awareness.',
                'user': profile.data,
                'tokens': tokens,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)
            profile = UserProfileSerializer(user, context={'request': request})
            return Response({
                'message': f'Welcome back, {user.username}!',
                'user': profile.data,
                'tokens': tokens,
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(
            request.user, data=request.data,
            partial=True, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated.', 'user': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        return self.put(request)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({'message': 'Password changed successfully.'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from quizzes.models import QuizAttempt
        from progress.models import UserProgress, DailyStreak

        user = request.user
        completed_modules = UserProgress.objects.filter(
            user=user, status='completed'
        ).count()
        attempts = QuizAttempt.objects.filter(user=user)
        avg_score = attempts.aggregate(avg=Avg('score'))['avg'] or 0
        streak_obj = DailyStreak.objects.filter(user=user).first()
        current_streak = streak_obj.current_streak if streak_obj else 0

        # Calculate rank by points
        rank = User.objects.filter(points__gt=user.points).count() + 1

        return Response({
            'points': user.points,
            'badges_count': len(user.badges),
            'modules_completed': completed_modules,
            'quizzes_taken': attempts.count(),
            'average_score': round(avg_score, 1),
            'current_streak': current_streak,
            'rank': rank,
        })


class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.filter(is_active=True).order_by('-points')[:20]
        data = []
        for i, u in enumerate(users, 1):
            data.append({
                'rank': i,
                'username': u.username,
                'full_name': u.full_name,
                'points': u.points,
                'badges_count': len(u.badges),
            })
        return Response(data)
