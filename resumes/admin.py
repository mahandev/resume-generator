from django.contrib import admin
from .models import Resume, WorkExperience, Responsibility, Education, Skill, Project

class ResponsibilityInline(admin.TabularInline):
    model = Responsibility
    extra = 1

class WorkExperienceInline(admin.StackedInline):
    model = WorkExperience
    inlines = [ResponsibilityInline]
    extra = 1

class EducationInline(admin.TabularInline):
    model = Education
    extra = 1

class SkillInline(admin.TabularInline):
    model = Skill
    extra = 3

class ProjectInline(admin.TabularInline):
    model = Project
    extra = 1

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'template_choice', 'created_at']
    list_filter = ['template_choice', 'created_at']
    search_fields = ['full_name', 'email']
    inlines = [WorkExperienceInline, EducationInline, SkillInline, ProjectInline]

@admin.register(WorkExperience)
class WorkExperienceAdmin(admin.ModelAdmin):
    list_display = ['job_title', 'company_name', 'resume', 'start_date', 'end_date']
    list_filter = ['company_name', 'start_date']
    inlines = [ResponsibilityInline]
