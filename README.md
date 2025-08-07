# IntelliResume - AI-Powered Resume Generator

IntelliResume is a comprehensive web application that helps job seekers create professional, effective resumes with minimal effort. The application guides users through a series of highly relevant questions to gather their professional information and generates three distinct, professionally designed resume templates.

## Features

### Core Functionality
- **Wizard-Style Form**: Multi-step form that prevents overwhelming users
- **Live Preview**: Real-time resume preview as users fill out the form
- **Three Professional Templates**:
  - **Modern**: Clean, single-column design with sans-serif fonts
  - **Professional**: Traditional two-column design for corporate/academic fields
  - **Creative**: Visual template with unique typography and color accents
- **Real-Time Editor**: WYSIWYG editing with inline text modification
- **PDF Export**: High-fidelity PDF generation with pixel-perfect conversion

### Data Collection
- Contact Information (Name, Phone, Email, LinkedIn, GitHub, Portfolio)
- Professional Summary with AI-powered suggestions
- Work Experience with detailed responsibilities and achievements
- Education with coursework and honors
- Skills categorized by type (Programming, Software, Soft Skills, Languages)
- Projects with technology details and descriptions

### Customization Options
- Color scheme selection
- Font pair choices (Roboto/Lora, Lato/Merriweather, Inter/Crimson Text)
- Section reordering
- Template switching

## Technical Stack

### Backend
- **Framework**: Django 4.2.7
- **API**: Django REST Framework
- **PDF Generation**: WeasyPrint for high-quality PDF conversion
- **Database**: SQLite (development) / PostgreSQL (production ready)

### Frontend
- **Technology**: HTML, CSS, JavaScript (Vanilla)
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **Fonts**: Google Fonts integration

### Deployment
- **Containerization**: Docker support
- **Static Files**: WhiteNoise for static file serving
- **WSGI Server**: Gunicorn for production

## Project Structure

```
resume-generator-app/
├── intelliresume/           # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── resumes/                 # Main Django app
│   ├── models.py           # Database models
│   ├── views.py            # API views and PDF generation
│   ├── serializers.py      # DRF serializers
│   ├── urls.py             # URL routing
│   └── admin.py            # Django admin interface
├── templates/               # HTML templates
│   ├── index.html          # Main application interface
│   └── resumes/            # Resume templates
│       ├── modern.html
│       ├── professional.html
│       └── creative.html
├── static/                  # Static assets
│   └── js/
│       └── app.js          # Frontend JavaScript
├── requirements.txt         # Python dependencies
├── manage.py               # Django management script
├── Dockerfile              # Container configuration
└── README.md               # This file
```

## Installation & Setup

### Prerequisites
- Python 3.11+
- pip
- Virtual environment (recommended)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-generator-app
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Collect static files**
   ```bash
   python manage.py collectstatic
   ```

8. **Run development server**
   ```bash
   python manage.py runserver
   ```

The application will be available at `http://localhost:8000`

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t intelliresume .
   ```

2. **Run container**
   ```bash
   docker run -p 8000:8000 intelliresume
   ```

## API Endpoints

- `GET/POST /api/resumes/` - List/Create resumes
- `GET/PUT/DELETE /api/resumes/{id}/` - Retrieve/Update/Delete specific resume
- `POST /api/generate-preview/` - Generate HTML preview
- `GET /api/download-pdf/{id}/` - Download PDF resume

## Database Models

### Resume
- Basic information (name, email, phone, etc.)
- Template and styling choices
- Timestamps

### WorkExperience
- Job details and date ranges
- Linked to Resume via foreign key

### Responsibility
- Individual responsibility items
- Linked to WorkExperience

### Education
- Degree and institution information
- Coursework and honors

### Skill
- Skill name, category, and proficiency level

### Project
- Project details and technologies used

## Features in Detail

### Form Validation
- Real-time validation with user-friendly error messages
- Required field indicators
- Email and URL format validation

### Resume Preview
- Live updates as users type
- Template-specific styling
- Responsive design for all screen sizes

### PDF Generation
- WeasyPrint integration for high-quality output
- Custom CSS styling preservation
- Optimized for printing and digital viewing

### User Experience
- Intuitive wizard-style interface
- Progress indicators
- Smooth transitions and animations
- Mobile-responsive design

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@intelliresume.com or create an issue in the repository.

## Roadmap

- [ ] AI-powered content suggestions
- [ ] Multiple resume versions management
- [ ] Social media integration
- [ ] Advanced analytics
- [ ] Team collaboration features
- [ ] API for third-party integrations
