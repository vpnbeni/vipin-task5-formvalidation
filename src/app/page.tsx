'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: 0 as number | null,
    username: '',
    password: '',
    confirmPassword: '',
    file: null,
    terms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('formData');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /\d/.test(password) &&
           /[!@#$%^&*]/.test(password);
  };
  const validatePhone = (phone: number | null) => {
    return phone !== null && /^\d{10}$/.test(phone.toString());
  };
  const validateStep = () => {
    const newErrors: any = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'Required';
      if (!formData.lastName) newErrors.lastName = 'Required';
      if (!formData.email) newErrors.email = 'Required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';
      if (formData.phone === null) newErrors.phone = 'Required';
      else if (!validatePhone(formData.phone)) newErrors.phone = 'Invalid phone number';
    }

    if (step === 2) {
      if (!formData.username) newErrors.username = 'Required';
      if (!formData.password) newErrors.password = 'Required';
      else if (!validatePassword(formData.password)) newErrors.password = 'Password must be 8+ chars with uppercase, lowercase, number, and special char';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (step === 3) {
      if (!formData.terms) newErrors.terms = 'You must accept terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('firstName', formData.firstName);
    submitData.append('lastName', formData.lastName);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone ? formData.phone.toString() : '');
    submitData.append('username', formData.username); 
    submitData.append('password', formData.password);
    submitData.append('terms', formData.terms.toString());
    if (formData.file) {
      submitData.append('file', formData.file);
    }

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        alert('Form submitted successfully!');
        localStorage.removeItem('formData');
        setStep(1);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: 0 as number | null,
          username: '',
          password: '',
          confirmPassword: '',
          file: null,
          terms: false
        });
      }
    } catch (error) {
      alert('Submission failed');
    }

    setIsSubmitting(false);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setErrors({...errors, file: 'File too large (max 5MB)'});
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setErrors({...errors, file: 'Only JPG, PNG, GIF allowed'});
        return;
      }
    }
    setFormData({...formData, file});
    setErrors({...errors, file: ''});
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Registration Form</h1>

        <div className="flex mb-6">
          {[1,2,3].map(i => (
            <div key={i} className={`flex-1 h-2 mx-1 rounded ${i <= step ? 'bg-blue-500' : 'bg-gray-300'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Personal Info</h2>
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full p-2 border rounded"
            />
            {(errors as any).firstName && <p className="text-red-500 text-sm">{(errors as any).firstName}</p>}

            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full p-2 border rounded"
            />
            {(errors as any).lastName && <p className="text-red-500 text-sm">{(errors as any).lastName}</p>}

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border rounded"
            />
            {(errors as any).email && <p className="text-red-500 text-sm">{(errors as any).email}</p>}

            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone !== null ? formData.phone.toString() : ''}
              onChange={(e) => setFormData({...formData, phone: e.target.value ? parseInt(e.target.value) : null})}
              className="w-full p-2 border rounded"
            />
            {(errors as any).phone && <p className="text-red-500 text-sm">{(errors as any).phone}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Account Details</h2>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full p-2 border rounded"
            />
            {(errors as any).username && <p className="text-red-500 text-sm">{(errors as any).username}</p>}

            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 border rounded"
            />
            {(errors as any).password && <p className="text-red-500 text-sm">{(errors as any).password}</p>}

            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full p-2 border rounded"
            />
            {(errors as any).confirmPassword && <p className="text-red-500 text-sm">{(errors as any).confirmPassword}</p>}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Upload & Terms</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
            {(errors as any).file && <p className="text-red-500 text-sm">{(errors as any).file}</p>}

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.terms}
                onChange={(e) => setFormData({...formData, terms: e.target.checked})}
                className="mr-2"
              />
              I accept the terms and conditions
            </label>
            {(errors as any).terms && <p className="text-red-500 text-sm">{(errors as any).terms}</p>}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {step === 3 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
