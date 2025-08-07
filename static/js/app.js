let currentStep = 1;
let resumeData = {};
let generatedResumeId = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    addWorkExperience();
    addEducation();
    addSkill();
    addProject();
});

function initializeForm() {
    document.querySelectorAll('input, textarea, select').forEach(element => {
        element.addEventListener('input', updateLivePreview);
        element.addEventListener('change', updateLivePreview);
    });

    document.querySelectorAll('.template-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.template-option').forEach(opt => {
                opt.classList.remove('border-blue-500');
                opt.classList.add('border-gray-300');
            });
            this.classList.remove('border-gray-300');
            this.classList.add('border-blue-500');
            
            const template = this.getAttribute('data-template');
            resumeData.template_choice = template;
            updateLivePreview();
        });
    });

    document.querySelector('.template-option[data-template="modern"]').click();
}

function nextStep() {
    if (validateCurrentStep()) {
        currentStep++;
        updateStepIndicator();
        showStep(currentStep);
        collectFormData();
        updateLivePreview();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepIndicator();
        showStep(currentStep);
    }
}

function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.focus();
            showNotification('Please fill in all required fields', 'error');
            return false;
        }
    }
    return true;
}

function updateStepIndicator() {
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        const stepNumber = index + 1;
        indicator.classList.remove('active', 'completed');
        
        if (stepNumber < currentStep) {
            indicator.classList.add('completed');
        } else if (stepNumber === currentStep) {
            indicator.classList.add('active');
        }
    });
}

function showStep(step) {
    document.querySelectorAll('.step-content').forEach(content => {
        content.style.display = 'none';
    });
    
    const targetStep = document.getElementById(`step-${step}`);
    if (targetStep) {
        targetStep.style.display = 'block';
        targetStep.classList.add('fade-in');
    }
}

function addWorkExperience() {
    const container = document.getElementById('work-experiences-container');
    const index = container.children.length;
    
    const workExpHTML = `
        <div class="work-experience-item bg-gray-50 p-4 rounded-lg mb-4" data-index="${index}">
            <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold text-gray-700">Work Experience ${index + 1}</h4>
                <button type="button" onclick="removeWorkExperience(${index})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                    <input type="text" name="work_job_title_${index}" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Software Engineer">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                    <input type="text" name="work_company_${index}" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Tech Corp">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input type="text" name="work_location_${index}" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="San Francisco, CA">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input type="month" name="work_start_date_${index}" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input type="month" name="work_end_date_${index}" id="work_end_date_${index}"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="flex items-center">
                    <input type="checkbox" name="work_is_current_${index}" id="work_is_current_${index}" 
                           class="mr-2" onchange="toggleEndDate(${index})">
                    <label for="work_is_current_${index}" class="text-sm text-gray-700">Currently working here</label>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Key Responsibilities & Achievements</label>
                <div id="responsibilities-${index}" class="space-y-2"></div>
                <button type="button" onclick="addResponsibility(${index})" 
                        class="mt-2 bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 text-sm">
                    Add Responsibility
                </button>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', workExpHTML);
    addResponsibility(index);
    
    const inputs = container.querySelectorAll(`[data-index="${index}"] input, [data-index="${index}"] textarea`);
    inputs.forEach(input => {
        input.addEventListener('input', updateLivePreview);
        input.addEventListener('change', updateLivePreview);
    });
}

function removeWorkExperience(index) {
    const element = document.querySelector(`[data-index="${index}"]`);
    if (element) {
        element.remove();
        updateLivePreview();
    }
}

function toggleEndDate(index) {
    const endDateInput = document.getElementById(`work_end_date_${index}`);
    const isCurrentCheckbox = document.getElementById(`work_is_current_${index}`);
    
    if (isCurrentCheckbox.checked) {
        endDateInput.disabled = true;
        endDateInput.value = '';
    } else {
        endDateInput.disabled = false;
    }
    updateLivePreview();
}

function addResponsibility(workIndex) {
    const container = document.getElementById(`responsibilities-${workIndex}`);
    const respIndex = container.children.length;
    
    const respHTML = `
        <div class="flex gap-2 items-start">
            <textarea name="responsibility_${workIndex}_${respIndex}" rows="2"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Developed and maintained web applications using React and Node.js, improving user engagement by 25%"></textarea>
            <button type="button" onclick="this.parentElement.remove(); updateLivePreview();" 
                    class="text-red-600 hover:text-red-800 mt-2">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', respHTML);
    
    const textarea = container.lastElementChild.querySelector('textarea');
    textarea.addEventListener('input', updateLivePreview);
}

function addEducation() {
    const container = document.getElementById('education-container');
    const index = container.children.length;
    
    const eduHTML = `
        <div class="education-item bg-gray-50 p-4 rounded-lg mb-4" data-edu-index="${index}">
            <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold text-gray-700">Education ${index + 1}</h4>
                <button type="button" onclick="removeEducation(${index})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Degree/Certification *</label>
                    <input type="text" name="edu_degree_${index}" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Bachelor of Science in Computer Science">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
                    <input type="text" name="edu_institution_${index}" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="University of California">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input type="text" name="edu_location_${index}" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Berkeley, CA">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Graduation Date *</label>
                    <input type="month" name="edu_graduation_${index}" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Relevant Coursework</label>
                    <input type="text" name="edu_coursework_${index}"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Data Structures, Algorithms, Database Systems">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Honors & Awards</label>
                    <input type="text" name="edu_honors_${index}"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Magna Cum Laude, Dean's List">
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', eduHTML);
    
    const inputs = container.querySelectorAll(`[data-edu-index="${index}"] input`);
    inputs.forEach(input => {
        input.addEventListener('input', updateLivePreview);
        input.addEventListener('change', updateLivePreview);
    });
}

function removeEducation(index) {
    const element = document.querySelector(`[data-edu-index="${index}"]`);
    if (element) {
        element.remove();
        updateLivePreview();
    }
}

function addSkill() {
    const container = document.getElementById('skills-container');
    const index = container.children.length;
    
    const skillHTML = `
        <div class="skill-item bg-gray-50 p-4 rounded-lg mb-4" data-skill-index="${index}">
            <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold text-gray-700">Skill ${index + 1}</h4>
                <button type="button" onclick="removeSkill(${index})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Skill Name *</label>
                    <input type="text" name="skill_name_${index}" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="JavaScript">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select name="skill_category_${index}" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Category</option>
                        <option value="programming">Programming Languages</option>
                        <option value="software">Software</option>
                        <option value="soft_skills">Soft Skills</option>
                        <option value="languages">Languages</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Proficiency Level</label>
                    <select name="skill_level_${index}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate" selected>Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', skillHTML);
    
    const inputs = container.querySelectorAll(`[data-skill-index="${index}"] input, [data-skill-index="${index}"] select`);
    inputs.forEach(input => {
        input.addEventListener('input', updateLivePreview);
        input.addEventListener('change', updateLivePreview);
    });
}

function removeSkill(index) {
    const element = document.querySelector(`[data-skill-index="${index}"]`);
    if (element) {
        element.remove();
        updateLivePreview();
    }
}

function addProject() {
    const container = document.getElementById('projects-container');
    const index = container.children.length;
    
    const projectHTML = `
        <div class="project-item bg-gray-50 p-4 rounded-lg mb-4" data-project-index="${index}">
            <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold text-gray-700">Project ${index + 1}</h4>
                <button type="button" onclick="removeProject(${index})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
                    <input type="text" name="project_title_${index}" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="E-commerce Website">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
                    <input type="url" name="project_url_${index}"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="https://github.com/username/project">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea name="project_description_${index}" rows="3" required
                              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Developed a full-stack e-commerce platform with user authentication, payment processing, and inventory management"></textarea>
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Technologies Used *</label>
                    <input type="text" name="project_tech_${index}" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="React, Node.js, MongoDB, Stripe API">
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', projectHTML);
    
    const inputs = container.querySelectorAll(`[data-project-index="${index}"] input, [data-project-index="${index}"] textarea`);
    inputs.forEach(input => {
        input.addEventListener('input', updateLivePreview);
        input.addEventListener('change', updateLivePreview);
    });
}

function removeProject(index) {
    const element = document.querySelector(`[data-project-index="${index}"]`);
    if (element) {
        element.remove();
        updateLivePreview();
    }
}

function collectFormData() {
    resumeData = {
        full_name: document.getElementById('full_name')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        linkedin_url: document.getElementById('linkedin_url')?.value || '',
        github_url: document.getElementById('github_url')?.value || '',
        website_url: document.getElementById('website_url')?.value || '',
        professional_summary: document.getElementById('professional_summary')?.value || '',
        template_choice: resumeData.template_choice || 'modern',
        color_scheme: document.getElementById('color_scheme')?.value || '#3B82F6',
        font_pair: document.getElementById('font_pair')?.value || 'Roboto/Lora',
        work_experiences: [],
        education: [],
        skills: [],
        projects: []
    };

    document.querySelectorAll('.work-experience-item').forEach((item, index) => {
        const jobTitle = item.querySelector(`[name="work_job_title_${index}"]`)?.value;
        const companyName = item.querySelector(`[name="work_company_${index}"]`)?.value;
        const location = item.querySelector(`[name="work_location_${index}"]`)?.value;
        const startDate = item.querySelector(`[name="work_start_date_${index}"]`)?.value;
        const endDate = item.querySelector(`[name="work_end_date_${index}"]`)?.value;
        const isCurrent = item.querySelector(`[name="work_is_current_${index}"]`)?.checked;

        if (jobTitle && companyName && location && startDate) {
            const responsibilities = [];
            item.querySelectorAll(`[name^="responsibility_${index}_"]`).forEach(resp => {
                if (resp.value.trim()) {
                    responsibilities.push({
                        description: resp.value.trim(),
                        order: responsibilities.length
                    });
                }
            });

            resumeData.work_experiences.push({
                job_title: jobTitle,
                company_name: companyName,
                company_location: location,
                start_date: startDate + '-01',
                end_date: isCurrent ? null : (endDate ? endDate + '-01' : null),
                is_current: isCurrent || false,
                order: index,
                responsibilities: responsibilities
            });
        }
    });

    document.querySelectorAll('.education-item').forEach((item, index) => {
        const degree = item.querySelector(`[name="edu_degree_${index}"]`)?.value;
        const institution = item.querySelector(`[name="edu_institution_${index}"]`)?.value;
        const location = item.querySelector(`[name="edu_location_${index}"]`)?.value;
        const graduation = item.querySelector(`[name="edu_graduation_${index}"]`)?.value;
        const coursework = item.querySelector(`[name="edu_coursework_${index}"]`)?.value;
        const honors = item.querySelector(`[name="edu_honors_${index}"]`)?.value;

        if (degree && institution && location && graduation) {
            resumeData.education.push({
                degree_name: degree,
                institution_name: institution,
                institution_location: location,
                graduation_date: graduation + '-01',
                relevant_coursework: coursework || '',
                honors: honors || '',
                order: index
            });
        }
    });

    document.querySelectorAll('.skill-item').forEach((item, index) => {
        const name = item.querySelector(`[name="skill_name_${index}"]`)?.value;
        const category = item.querySelector(`[name="skill_category_${index}"]`)?.value;
        const level = item.querySelector(`[name="skill_level_${index}"]`)?.value;

        if (name && category) {
            resumeData.skills.push({
                name: name,
                category: category,
                proficiency_level: level || 'intermediate'
            });
        }
    });

    document.querySelectorAll('.project-item').forEach((item, index) => {
        const title = item.querySelector(`[name="project_title_${index}"]`)?.value;
        const url = item.querySelector(`[name="project_url_${index}"]`)?.value;
        const description = item.querySelector(`[name="project_description_${index}"]`)?.value;
        const tech = item.querySelector(`[name="project_tech_${index}"]`)?.value;

        if (title && description && tech) {
            resumeData.projects.push({
                title: title,
                url: url || '',
                description: description,
                technologies_used: tech,
                order: index
            });
        }
    });
}

function updateLivePreview() {
    collectFormData();
    
    if (!resumeData.full_name) {
        return;
    }

    const previewContent = generatePreviewHTML();
    document.getElementById('resume-preview').innerHTML = previewContent;
}

function generatePreviewHTML() {
    const colorScheme = resumeData.color_scheme || '#3B82F6';
    const template = resumeData.template_choice || 'modern';
    
    return `
        <div class="resume-preview-container" style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 100%; margin: 0 auto; padding: 1rem; background: white;">
            <div style="text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid ${colorScheme};">
                <h1 style="font-size: 1.8rem; font-weight: bold; color: ${colorScheme}; margin-bottom: 0.5rem;">${resumeData.full_name}</h1>
                <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; font-size: 0.9rem;">
                    <span>${resumeData.email}</span>
                    <span>${resumeData.phone}</span>
                    ${resumeData.linkedin_url ? `<span><a href="${resumeData.linkedin_url}" style="color: ${colorScheme};">LinkedIn</a></span>` : ''}
                    ${resumeData.github_url ? `<span><a href="${resumeData.github_url}" style="color: ${colorScheme};">GitHub</a></span>` : ''}
                    ${resumeData.website_url ? `<span><a href="${resumeData.website_url}" style="color: ${colorScheme};">Portfolio</a></span>` : ''}
                </div>
            </div>
            
            ${resumeData.professional_summary ? `
                <div style="margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.2rem; font-weight: 600; color: ${colorScheme}; margin-bottom: 0.5rem; border-bottom: 1px solid ${colorScheme}; padding-bottom: 0.2rem;">Professional Summary</h2>
                    <p style="text-align: justify;">${resumeData.professional_summary}</p>
                </div>
            ` : ''}
            
            ${resumeData.work_experiences.length > 0 ? `
                <div style="margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.2rem; font-weight: 600; color: ${colorScheme}; margin-bottom: 0.5rem; border-bottom: 1px solid ${colorScheme}; padding-bottom: 0.2rem;">Professional Experience</h2>
                    ${resumeData.work_experiences.map(work => `
                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                                <div>
                                    <div style="font-weight: 600; font-size: 1rem;">${work.job_title}</div>
                                    <div style="color: ${colorScheme}; font-weight: 500;">${work.company_name}</div>
                                </div>
                                <div style="text-align: right; font-size: 0.8rem; color: #666;">
                                    ${formatDate(work.start_date)} - ${work.is_current ? 'Present' : formatDate(work.end_date)}<br>
                                    ${work.company_location}
                                </div>
                            </div>
                            ${work.responsibilities.length > 0 ? `
                                <ul style="margin-left: 1rem; margin-top: 0.5rem;">
                                    ${work.responsibilities.map(resp => `<li style="margin-bottom: 0.2rem;">${resp.description}</li>`).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${resumeData.education.length > 0 ? `
                <div style="margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.2rem; font-weight: 600; color: ${colorScheme}; margin-bottom: 0.5rem; border-bottom: 1px solid ${colorScheme}; padding-bottom: 0.2rem;">Education</h2>
                    ${resumeData.education.map(edu => `
                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <div style="font-weight: 600;">${edu.degree_name}</div>
                                    <div style="color: ${colorScheme};">${edu.institution_name}</div>
                                </div>
                                <div style="text-align: right; font-size: 0.8rem; color: #666;">
                                    ${formatDate(edu.graduation_date)}<br>
                                    ${edu.institution_location}
                                </div>
                            </div>
                            ${edu.honors ? `<p style="margin-top: 0.3rem; font-size: 0.9rem;"><strong>Honors:</strong> ${edu.honors}</p>` : ''}
                            ${edu.relevant_coursework ? `<p style="margin-top: 0.3rem; font-size: 0.9rem;"><strong>Relevant Coursework:</strong> ${edu.relevant_coursework}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${resumeData.skills.length > 0 ? `
                <div style="margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.2rem; font-weight: 600; color: ${colorScheme}; margin-bottom: 0.5rem; border-bottom: 1px solid ${colorScheme}; padding-bottom: 0.2rem;">Skills</h2>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${resumeData.skills.map(skill => `
                            <span style="background: ${colorScheme}; color: white; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: 500;">${skill.name}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${resumeData.projects.length > 0 ? `
                <div style="margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.2rem; font-weight: 600; color: ${colorScheme}; margin-bottom: 0.5rem; border-bottom: 1px solid ${colorScheme}; padding-bottom: 0.2rem;">Projects</h2>
                    ${resumeData.projects.map(project => `
                        <div style="margin-bottom: 1rem;">
                            <div style="font-weight: 600; color: ${colorScheme};">
                                ${project.url ? `<a href="${project.url}" style="color: ${colorScheme};">${project.title}</a>` : project.title}
                            </div>
                            <p style="margin: 0.3rem 0;">${project.description}</p>
                            <div style="font-size: 0.9rem; color: #666; font-style: italic;"><strong>Technologies:</strong> ${project.technologies_used}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

async function generateResume() {
    collectFormData();
    
    if (!validateFormData()) {
        return;
    }

    showLoading('Generating your resume...');

    try {
        const response = await fetch('/api/resumes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify(resumeData)
        });

        if (response.ok) {
            const result = await response.json();
            generatedResumeId = result.id;
            showNotification('Resume generated successfully!', 'success');
            document.getElementById('preview-actions').style.display = 'block';
            updateLivePreview();
        } else {
            const error = await response.json();
            console.error('Error generating resume:', error);
            showNotification('Error generating resume. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Network error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
        hideLoading();
    }
}

function validateFormData() {
    if (!resumeData.full_name || !resumeData.email || !resumeData.phone || !resumeData.professional_summary) {
        showNotification('Please fill in all required personal information', 'error');
        return false;
    }
    
    if (resumeData.work_experiences.length === 0 && resumeData.education.length === 0) {
        showNotification('Please add at least one work experience or education entry', 'error');
        return false;
    }
    
    return true;
}

async function downloadPDF() {
    if (!generatedResumeId) {
        showNotification('Please generate your resume first', 'error');
        return;
    }

    showLoading('Preparing PDF download...');

    try {
        const response = await fetch(`/api/download-pdf/${generatedResumeId}/`);
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${resumeData.full_name.replace(/\s+/g, '_')}_resume.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showNotification('PDF downloaded successfully!', 'success');
        } else {
            showNotification('Error downloading PDF. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Network error during download. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

function editResume() {
    currentStep = 1;
    updateStepIndicator();
    showStep(currentStep);
    document.getElementById('preview-actions').style.display = 'none';
    showNotification('You can now edit your resume', 'info');
}

function showLoading(message) {
    const loadingHtml = `
        <div class="loading-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 2rem; border-radius: 10px; text-align: center;">
                <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #3B82F6; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p style="color: #333; font-weight: 500;">${message}</p>
            </div>
        </div>
        <style>
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        </style>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHtml);
}

function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

function showNotification(message, type = 'info') {
    const colors = {
        success: { bg: '#10B981', border: '#059669' },
        error: { bg: '#EF4444', border: '#DC2626' },
        info: { bg: '#3B82F6', border: '#2563EB' }
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type].bg};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border-left: 4px solid ${colors[type].border};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: 1rem;">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getCsrfToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') {
            return value;
        }
    }
    return '';
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
