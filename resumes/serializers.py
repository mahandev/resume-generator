from rest_framework import serializers
import json
from .models import Resume, WorkExperience, Responsibility, Education, Skill, Project

class ResponsibilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Responsibility
        fields = ['id', 'description', 'order']

class WorkExperienceSerializer(serializers.ModelSerializer):
    responsibilities = ResponsibilitySerializer(many=True)

    class Meta:
        model = WorkExperience
        fields = ['id', 'job_title', 'company_name', 'company_location', 
                 'start_date', 'end_date', 'is_current', 'order', 'responsibilities']

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'degree_name', 'institution_name', 'institution_location',
                 'graduation_date', 'relevant_coursework', 'honors', 'order']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'proficiency_level']

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'url', 'description', 'technologies_used', 'order']

class ResumeSerializer(serializers.ModelSerializer):
    work_experiences = WorkExperienceSerializer(many=True)
    education = EducationSerializer(many=True)
    skills = SkillSerializer(many=True)
    projects = ProjectSerializer(many=True)

    class Meta:
        model = Resume
        fields = ['id', 'full_name', 'email', 'phone', 'profile_image', 'github_url',
                 'website_url', 'professional_summary', 'template_choice', 'color_scheme',
                 'font_pair', 'work_experiences', 'education', 'skills', 'projects',
                 'created_at', 'updated_at']

    def to_internal_value(self, data):
        # Handle FormData with JSON strings for nested objects
        if hasattr(data, 'get'):
            # Create a new dict instead of copying to avoid file objects
            parsed_data = {}
            
            # Copy regular fields
            for key, value in data.items():
                if key in ['work_experiences', 'education', 'skills', 'projects']:
                    # Parse JSON strings for nested objects
                    if isinstance(value, str):
                        try:
                            parsed_data[key] = json.loads(value)
                        except json.JSONDecodeError:
                            parsed_data[key] = value
                    else:
                        parsed_data[key] = value
                else:
                    parsed_data[key] = value
            
            data = parsed_data
        
        return super().to_internal_value(data)

    def create(self, validated_data):
        work_experiences_data = validated_data.pop('work_experiences', [])
        education_data = validated_data.pop('education', [])
        skills_data = validated_data.pop('skills', [])
        projects_data = validated_data.pop('projects', [])

        resume = Resume.objects.create(**validated_data)

        for work_exp_data in work_experiences_data:
            responsibilities_data = work_exp_data.pop('responsibilities', [])
            work_exp = WorkExperience.objects.create(resume=resume, **work_exp_data)
            for resp_data in responsibilities_data:
                Responsibility.objects.create(work_experience=work_exp, **resp_data)

        for edu_data in education_data:
            Education.objects.create(resume=resume, **edu_data)

        for skill_data in skills_data:
            Skill.objects.create(resume=resume, **skill_data)

        for project_data in projects_data:
            Project.objects.create(resume=resume, **project_data)

        return resume

    def update(self, instance, validated_data):
        work_experiences_data = validated_data.pop('work_experiences', [])
        education_data = validated_data.pop('education', [])
        skills_data = validated_data.pop('skills', [])
        projects_data = validated_data.pop('projects', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.work_experiences.all().delete()
        for work_exp_data in work_experiences_data:
            responsibilities_data = work_exp_data.pop('responsibilities', [])
            work_exp = WorkExperience.objects.create(resume=instance, **work_exp_data)
            for resp_data in responsibilities_data:
                Responsibility.objects.create(work_experience=work_exp, **resp_data)

        instance.education.all().delete()
        for edu_data in education_data:
            Education.objects.create(resume=instance, **edu_data)

        instance.skills.all().delete()
        for skill_data in skills_data:
            Skill.objects.create(resume=instance, **skill_data)

        instance.projects.all().delete()
        for project_data in projects_data:
            Project.objects.create(resume=instance, **project_data)

        return instance
