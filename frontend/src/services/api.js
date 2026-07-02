import axios from 'axios';

// Create an axios instance (can point to any backend later)
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Since we don't have a real backend database, we will intercept requests
// and simulate an API database using localStorage.
export async function submitJobApplication(applicationData) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  console.log('Sending job application to mock API:', applicationData);

  try {
    // Save application to localStorage for display/verification
    const existing = JSON.parse(localStorage.getItem('submitted_applications') || '[]');
    
    // We can't store real File objects in localStorage easily.
    // We'll store a representation of files.
    const sanitizedData = {
      ...applicationData,
      id: 'app-' + Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString(),
      // Replace files with metadata
      profilePhoto: applicationData.profilePhoto ? {
        name: applicationData.profilePhoto.name,
        size: applicationData.profilePhoto.size,
        type: applicationData.profilePhoto.type
      } : null,
      resume: applicationData.resume ? {
        name: applicationData.resume.name,
        size: applicationData.resume.size,
        type: applicationData.resume.type
      } : null,
      certificates: applicationData.certificates && applicationData.certificates.length 
        ? Array.from(applicationData.certificates).map(f => ({ name: f.name, size: f.size, type: f.type }))
        : []
    };

    existing.push(sanitizedData);
    localStorage.setItem('submitted_applications', JSON.stringify(existing));

    return {
      status: 200,
      data: {
        success: true,
        message: 'Application submitted successfully!',
        applicationId: sanitizedData.id
      }
    };
  } catch (error) {
    console.error('Mock API submission error:', error);
    throw new Error('Failed to submit application. Please try again.');
  }
}

export async function submitContactForm(contactData) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('Submitting contact form:', contactData);
  
  const existing = JSON.parse(localStorage.getItem('submitted_contact_queries') || '[]');
  const query = {
    ...contactData,
    id: 'query-' + Math.random().toString(36).substr(2, 9),
    submittedAt: new Date().toISOString()
  };
  existing.push(query);
  localStorage.setItem('submitted_contact_queries', JSON.stringify(existing));

  return {
    status: 200,
    data: {
      success: true,
      message: 'Your inquiry has been submitted successfully!'
    }
  };
}

export async function submitSupportTicket(supportData) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('Submitting support ticket:', supportData);

  const existing = JSON.parse(localStorage.getItem('submitted_support_tickets') || '[]');
  const ticket = {
    ...supportData,
    id: 'ticket-' + Math.random().toString(36).substr(2, 9),
    submittedAt: new Date().toISOString()
  };
  existing.push(ticket);
  localStorage.setItem('submitted_support_tickets', JSON.stringify(existing));

  return {
    status: 200,
    data: {
      success: true,
      message: 'Support ticket created successfully!'
    }
  };
}

export default api;
