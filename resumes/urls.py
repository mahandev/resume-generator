from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

urlpatterns = [
    path('', views.home_view, name='home'),
    path('api/resumes/', views.ResumeListCreateView.as_view(), name='resume-list-create'),
    path('api/resumes/<uuid:pk>/', views.ResumeDetailView.as_view(), name='resume-detail'),
    path('api/generate-preview/', views.generate_resume_preview, name='generate-preview'),
    path('api/download-pdf/<uuid:resume_id>/', views.download_resume_pdf, name='download-pdf'),
] + router.urls
