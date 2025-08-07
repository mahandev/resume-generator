from django.db import models
import uuid

class Resume(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    linkedin_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    website_url = models.URLField(blank=True, null=True)
    professional_summary = models.TextField()
    template_choice = models.CharField(max_length=20, choices=[
        ('modern', 'Modern'),
        ('professional', 'Professional'),
        ('creative', 'Creative'),
    ], default='modern')
    color_scheme = models.CharField(max_length=7, default='#3B82F6')
    font_pair = models.CharField(max_length=50, default='Roboto/Lora')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} - {self.template_choice}"

class WorkExperience(models.Model):
    resume = models.ForeignKey(Resume, related_name='work_experiences', on_delete=models.CASCADE)
    job_title = models.CharField(max_length=100)
    company_name = models.CharField(max_length=100)
    company_location = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.job_title} at {self.company_name}"

class Responsibility(models.Model):
    work_experience = models.ForeignKey(WorkExperience, related_name='responsibilities', on_delete=models.CASCADE)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

class Education(models.Model):
    resume = models.ForeignKey(Resume, related_name='education', on_delete=models.CASCADE)
    degree_name = models.CharField(max_length=100)
    institution_name = models.CharField(max_length=100)
    institution_location = models.CharField(max_length=100)
    graduation_date = models.DateField()
    relevant_coursework = models.TextField(blank=True, null=True)
    honors = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.degree_name} from {self.institution_name}"

class Skill(models.Model):
    resume = models.ForeignKey(Resume, related_name='skills', on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    category = models.CharField(max_length=50, choices=[
        ('programming', 'Programming Languages'),
        ('software', 'Software'),
        ('soft_skills', 'Soft Skills'),
        ('languages', 'Languages'),
        ('other', 'Other'),
    ])
    proficiency_level = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ], default='intermediate')

    def __str__(self):
        return f"{self.name} ({self.category})"

class Project(models.Model):
    resume = models.ForeignKey(Resume, related_name='projects', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    url = models.URLField(blank=True, null=True)
    description = models.TextField()
    technologies_used = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title
