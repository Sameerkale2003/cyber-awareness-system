from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=10, default='🔒')
    color = models.CharField(max_length=20, default='#3498db')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Module(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='modules')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')
    duration_minutes = models.IntegerField(default=15)
    thumbnail = models.ImageField(upload_to='modules/', blank=True, null=True)
    order = models.IntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.title

    @property
    def lessons_count(self):
        return self.lessons.filter(is_published=True).count()


class Lesson(models.Model):
    LESSON_TYPE_CHOICES = [
        ('text', 'Text'),
        ('video', 'Video'),
        ('infographic', 'Infographic'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    lesson_type = models.CharField(max_length=20, choices=LESSON_TYPE_CHOICES, default='text')
    order = models.IntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.module.title} — {self.title}"


class CyberTip(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='tips')
    icon = models.CharField(max_length=10, default='💡')
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_featured', '-created_at']

    def __str__(self):
        return self.title


class SafetyPledge(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='safety_pledge'
    )
    pledged_at = models.DateTimeField(auto_now_add=True)
    pledge_text = models.TextField(default=(
        "I pledge to use strong passwords, protect my personal data, "
        "enable two-factor authentication, and practice safe online habits "
        "to keep myself and others secure in the digital world."
    ))

    class Meta:
        ordering = ['-pledged_at']

    def __str__(self):
        return f"{self.user.username}'s Safety Pledge"
