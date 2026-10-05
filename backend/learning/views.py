from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Category, Module, Lesson, CyberTip, SafetyPledge
from .serializers import (
    CategorySerializer, ModuleListSerializer, ModuleDetailSerializer,
    LessonSerializer, CyberTipSerializer, SafetyPledgeSerializer
)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ModuleListView(generics.ListAPIView):
    serializer_class = ModuleListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'difficulty']
    search_fields = ['title', 'description']
    ordering_fields = ['order', 'created_at', 'duration_minutes']

    def get_queryset(self):
        return Module.objects.filter(is_published=True).select_related('category')


class ModuleDetailView(generics.RetrieveAPIView):
    serializer_class = ModuleDetailSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Module.objects.filter(is_published=True).prefetch_related('lessons')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Award points for viewing a module if user is logged in
        if request.user and request.user.is_authenticated:
            from progress.models import UserActivity
            activity, created = UserActivity.objects.get_or_create(
                user=request.user,
                activity_type='module_viewed',
                description=f'Viewed: {instance.title}',
                defaults={'points_earned': 5}
            )
            if created:
                request.user.add_points(5, f'Viewed module: {instance.title}')
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class LessonDetailView(generics.RetrieveAPIView):
    serializer_class = LessonSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Lesson.objects.filter(is_published=True)


class CyberTipListView(generics.ListAPIView):
    serializer_class = CyberTipSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['title', 'content']

    def get_queryset(self):
        return CyberTip.objects.select_related('category')


class FeaturedContentView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        featured_modules = Module.objects.filter(is_published=True).order_by('order')[:4]
        featured_tips = CyberTip.objects.filter(is_featured=True)[:5]
        categories = Category.objects.all()
        tip_of_day = CyberTip.objects.filter(is_featured=True).first()

        return Response({
            'featured_modules': ModuleListSerializer(featured_modules, many=True).data,
            'featured_tips': CyberTipSerializer(featured_tips, many=True).data,
            'categories': CategorySerializer(categories, many=True).data,
            'tip_of_day': CyberTipSerializer(tip_of_day).data if tip_of_day else None,
            'total_pledges': SafetyPledge.objects.count(),
        })


class SafetyPledgeView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        has_pledged = False
        pledge_data = None
        if request.user and request.user.is_authenticated:
            try:
                pledge = SafetyPledge.objects.get(user=request.user)
                has_pledged = True
                pledge_data = SafetyPledgeSerializer(pledge).data
            except SafetyPledge.DoesNotExist:
                pass

        return Response({
            'has_pledged': has_pledged,
            'pledge': pledge_data,
            'total_pledges': SafetyPledge.objects.count(),
        })

    def post(self, request):
        if SafetyPledge.objects.filter(user=request.user).exists():
            return Response({'detail': 'You have already taken the pledge!'}, status=400)

        pledge = SafetyPledge.objects.create(user=request.user)
        request.user.add_points(10, 'Took the Safety Pledge')

        from progress.models import UserActivity
        UserActivity.objects.create(
            user=request.user,
            activity_type='pledge_taken',
            description='Took the Cyber Safety Pledge',
            points_earned=10
        )

        return Response({
            'message': 'Congratulations! You have taken the Cyber Safety Pledge! +10 points',
            'pledge': SafetyPledgeSerializer(pledge).data,
            'total_pledges': SafetyPledge.objects.count(),
        }, status=status.HTTP_201_CREATED)
