import React from 'react';
import { CarFront, MapPin, BarChart3 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/components/LoginForm';
import { VIDEO_SRC, POSTER_SRC } from '@/constants';

export const LoginPage: React.FC = () => {
  const cardH =
    'min-h-[calc(100vh-24px)] sm:min-h-[calc(100vh-32px)] md:min-h-[calc(100vh-48px)]';

  const features = [
    { icon: CarFront, label: 'Vehicle Management' },
    { icon: MapPin, label: 'Real-Time Tracking' },
    { icon: BarChart3, label: 'Smart Fleet Insights' },
  ];

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6">
      <div className={`relative bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden ${cardH} lg:h-[calc(100vh-48px)]`}>
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />

        <div className={`relative z-10 flex flex-col ${cardH} lg:h-full p-4 sm:p-6 md:p-8 gap-6`}>
          {/* Navigation Bar */}
          <Navbar />

          <div className="flex-1" />

          {/* Hero text & Login Form */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="text-white shrink-0 lg:max-w-lg xl:max-w-2xl">
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-medium leading-tight drop-shadow-lg">
                Manage your fleet.
                <br />
                Drive your business <span className="font-serif-accent italic">forward</span>.
              </h1>
              <p className="mt-4 text-sm sm:text-base text-gray-200 max-w-md drop-shadow">
                Streamline vehicle tracking, optimize maintenance schedules, and monitor route efficiency in real-time.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {features.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Login Card */}
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};
