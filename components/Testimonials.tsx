import Image from 'next/image';
import { Language, translations } from '../utils/translations';

interface TestimonialsProps {
  currentLanguage: Language;
}

export function Testimonials({ currentLanguage }: TestimonialsProps) {
  const t = translations[currentLanguage];
  const testimonials = t.testimonials.items;

  return (
    <section
      id='testimonials'
      aria-label='What our customers are saying'
      className='py-16 sm:py-20 px-4 sm:px-6'
    >
      <div className='mx-auto max-w-7xl'>
        <div className='mx-auto md:text-center mb-12 sm:mb-16'>
          <h1 className='mx-auto max-w-4xl font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-normal text-slate-900 leading-tight'>
            {t.testimonials.title}
          </h1>
          <p className='mx-auto mt-4 sm:mt-6 max-w-xl text-lg sm:text-xl text-slate-700 leading-7'>
            {t.testimonials.subtitle}
          </p>
        </div>
        <ul
          role='list'
          className='mx-auto mt-12 sm:mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-16 lg:max-w-none lg:grid-cols-3'
        >
          {testimonials.map((testimonial, testimonialIndex) => (
            <li
              key={testimonialIndex}
              className='hover:scale-105 transition duration-300 ease-in-out'
            >
              <figure className='relative rounded-2xl bg-white p-5 sm:p-6 shadow-xl shadow-slate-900/10 border border-gray-100'>
                <blockquote className='relative'>
                  <p className='text-base sm:text-lg tracking-tight text-slate-900 leading-relaxed'>
                    "{testimonial.content}"
                  </p>
                </blockquote>
                <figcaption className='relative mt-4 sm:mt-6 flex items-center justify-between border-t border-slate-100 pt-4 sm:pt-6'>
                  <div>
                    <div className='font-display text-sm sm:text-base text-slate-900 font-semibold'>
                      {testimonial.name}
                    </div>
                    <div className='mt-1 text-xs sm:text-sm text-slate-500'>
                      {testimonial.role}
                    </div>
                  </div>
                  <div className='flex items-center'>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg sm:text-xl">★</span>
                    ))}
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
