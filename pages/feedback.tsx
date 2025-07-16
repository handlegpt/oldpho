import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { translations } from '../utils/translations';
import { useLanguage } from '../contexts/LanguageContext';

const Feedback: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentLanguage } = useLanguage();
  const [form, setForm] = useState({
    type: 'feature',
    title: '',
    description: '',
    priority: 'medium',
    email: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t = translations[currentLanguage];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/restore');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulate feedback submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <Header photo={undefined} />
      <main className="container mx-auto px-4 py-8">
        {/* Feedback form content... */}
      </main>
      <Footer />
    </>
  );
};

export default Feedback; 