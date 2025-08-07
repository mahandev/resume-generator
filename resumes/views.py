from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import HttpResponse, Http404
from django.template.loader import get_template
from django.shortcuts import render, get_object_or_404
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration
import io

from .models import Resume
from .serializers import ResumeSerializer

class ResumeListCreateView(generics.ListCreateAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

class ResumeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

@api_view(['POST'])
def generate_resume_preview(request):
    serializer = ResumeSerializer(data=request.data)
    if serializer.is_valid():
        template_choice = request.data.get('template_choice', 'modern')
        color_scheme = request.data.get('color_scheme', '#3B82F6')
        font_pair = request.data.get('font_pair', 'Roboto/Lora')
        
        # Generate simple HTML preview
        data = serializer.validated_data
        html_content = f'''
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 100%; margin: 0 auto; padding: 1rem; background: white;">
            <div style="text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid {color_scheme};">
                <h1 style="font-size: 1.8rem; font-weight: bold; color: {color_scheme}; margin-bottom: 0.5rem;">{data.get('full_name', '')}</h1>
                <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; font-size: 0.9rem;">
                    <span>{data.get('email', '')}</span>
                    <span>{data.get('phone', '')}</span>
                </div>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <h2 style="font-size: 1.2rem; font-weight: 600; color: {color_scheme}; margin-bottom: 0.5rem;">Professional Summary</h2>
                <p>{data.get('professional_summary', '')}</p>
            </div>
        </div>
        '''
        
        return Response({
            'html_content': html_content,
            'success': True
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def download_resume_pdf(request, resume_id):
    try:
        resume = get_object_or_404(Resume, id=resume_id)
        
        # Create a simple HTML template for PDF generation
        html_content = f'''
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Lora:wght@400;500;600&display=swap');
                * {{ margin: 0; padding: 0; box-sizing: border-box; }}
                body {{
                    font-family: '{resume.font_pair.split('/')[0]}', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background: white;
                    max-width: 8.5in;
                    margin: 0 auto;
                    padding: 0.5in;
                }}
                .header {{
                    text-align: center;
                    margin-bottom: 2rem;
                    border-bottom: 2px solid {resume.color_scheme};
                    padding-bottom: 1rem;
                }}
                .profile-image {{
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid {resume.color_scheme};
                    margin-bottom: 1rem;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                }}
                .name {{
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: {resume.color_scheme};
                    margin-bottom: 0.5rem;
                }}
                .contact-info {{
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                    font-size: 0.9rem;
                }}
                .section {{
                    margin-bottom: 2rem;
                }}
                .section-title {{
                    font-size: 1.4rem;
                    font-weight: 600;
                    color: {resume.color_scheme};
                    border-bottom: 2px solid {resume.color_scheme};
                    padding-bottom: 0.3rem;
                    margin-bottom: 1rem;
                }}
                .work-item, .education-item, .project-item {{
                    margin-bottom: 1.5rem;
                }}
                .work-header {{
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                }}
                .job-title, .degree-title, .project-title {{
                    font-weight: 600;
                    font-size: 1.1rem;
                }}
                .company, .institution {{
                    color: {resume.color_scheme};
                    font-weight: 500;
                }}
                .date-location {{
                    text-align: right;
                    font-size: 0.9rem;
                    color: #666;
                }}
                .responsibilities {{
                    list-style: none;
                    padding-left: 0;
                }}
                .responsibilities li {{
                    position: relative;
                    padding-left: 1.2rem;
                    margin-bottom: 0.3rem;
                }}
                .responsibilities li:before {{
                    content: '•';
                    color: {resume.color_scheme};
                    position: absolute;
                    left: 0;
                    font-weight: bold;
                }}
                .skill-tags {{
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }}
                .skill-tag {{
                    background: {resume.color_scheme};
                    color: white;
                    padding: 0.2rem 0.6rem;
                    border-radius: 15px;
                    font-size: 0.8rem;
                }}
                a {{ color: {resume.color_scheme}; text-decoration: none; }}
            </style>
        </head>
        <body>
            <header class="header">'''
        
        # Add profile image if it exists
        if resume.profile_image:
            html_content += f'<img src="{request.build_absolute_uri(resume.profile_image.url)}" alt="Profile Picture" class="profile-image">'
            
        html_content += f'''
                <h1 class="name">{resume.full_name}</h1>
                <div class="contact-info">
                    <span>{resume.email}</span>
                    <span>{resume.phone}</span>'''
        
        if resume.github_url:
            html_content += f'<span><a href="{resume.github_url}">GitHub</a></span>'
        if resume.website_url:
            html_content += f'<span><a href="{resume.website_url}">Portfolio</a></span>'
            
        html_content += '''
                </div>
            </header>

            <section class="section">
                <h2 class="section-title">Professional Summary</h2>
                <p>''' + resume.professional_summary + '''</p>
            </section>'''

        # Add work experience
        if resume.work_experiences.exists():
            html_content += '''
            <section class="section">
                <h2 class="section-title">Professional Experience</h2>'''
            
            for work in resume.work_experiences.all():
                end_date = 'Present' if work.is_current else (work.end_date.strftime('%b %Y') if work.end_date else '')
                html_content += f'''
                <div class="work-item">
                    <div class="work-header">
                        <div>
                            <div class="job-title">{work.job_title}</div>
                            <div class="company">{work.company_name}</div>
                        </div>
                        <div class="date-location">
                            {work.start_date.strftime('%b %Y')} - {end_date}<br>
                            {work.company_location}
                        </div>
                    </div>
                    <ul class="responsibilities">'''
                
                for resp in work.responsibilities.all():
                    html_content += f'<li>{resp.description}</li>'
                
                html_content += '</ul></div>'
            
            html_content += '</section>'

        # Add education
        if resume.education.exists():
            html_content += '''
            <section class="section">
                <h2 class="section-title">Education</h2>'''
            
            for edu in resume.education.all():
                html_content += f'''
                <div class="education-item">
                    <div class="work-header">
                        <div>
                            <div class="degree-title">{edu.degree_name}</div>
                            <div class="institution">{edu.institution_name}</div>
                        </div>
                        <div class="date-location">
                            {edu.graduation_date.strftime('%b %Y')}<br>
                            {edu.institution_location}
                        </div>
                    </div>'''
                
                if edu.relevant_coursework:
                    html_content += f'<p><strong>Relevant Coursework:</strong> {edu.relevant_coursework}</p>'
                if edu.honors:
                    html_content += f'<p><strong>Honors:</strong> {edu.honors}</p>'
                    
                html_content += '</div>'
            
            html_content += '</section>'

        # Add skills
        if resume.skills.exists():
            html_content += '''
            <section class="section">
                <h2 class="section-title">Skills</h2>
                <div class="skill-tags">'''
            
            for skill in resume.skills.all():
                html_content += f'<span class="skill-tag">{skill.name}</span>'
            
            html_content += '</div></section>'

        # Add projects
        if resume.projects.exists():
            html_content += '''
            <section class="section">
                <h2 class="section-title">Projects</h2>'''
            
            for project in resume.projects.all():
                project_title = f'<a href="{project.url}">{project.title}</a>' if project.url else project.title
                html_content += f'''
                <div class="project-item">
                    <div class="project-title">{project_title}</div>
                    <p>{project.description}</p>
                    <p style="font-size: 0.9rem; color: #666; font-style: italic;"><strong>Technologies:</strong> {project.technologies_used}</p>
                </div>'''
            
            html_content += '</section>'

        html_content += '''
        </body>
        </html>'''
        
        font_config = FontConfiguration()
        pdf_buffer = io.BytesIO()
        
        HTML(string=html_content).write_pdf(
            pdf_buffer,
            font_config=font_config
        )
        
        response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{resume.full_name.replace(" ", "_")}_resume.pdf"'
        
        return response
        
    except Resume.DoesNotExist:
        raise Http404("Resume not found")
    except Exception as e:
        return HttpResponse(f'Error generating PDF: {str(e)}', status=500)

def home_view(request):
    return render(request, 'index.html')
