import React from 'react';
import { Target, Compass, Heart, Smile, Users, School } from 'lucide-react';

export default function About() {
  const staff = [
    { name: 'Mr. Umesh chandra', role: 'Director', qualifications: 'B.Tech in computer science', img: '/umesh.jpeg' },
    { name: 'Mr. Vishal', role: 'MERN Stack Instructor', qualifications: 'B.Tech in computer science', img: '/vishal.jpeg' },
    { name: 'Manish kumar', role: 'Java full stack developer', qualifications: 'B.Tech in computer science', img: 'Man.jpeg' },
    { name: 'Aslam saifi', role: 'Abap developer', qualifications: 'B.Tech in computer science', img: 'aslam.jpeg' }
  ];

  const coreValues = [
    { title: 'Industry-Focused Learning', text: 'Learn modern technologies including Java, Spring Boot, React, Node.js, MongoDB, and DevOps through real-world projects.', icon: Smile, color: 'bg-brandYellow/10 text-brandYellow-dark' },
    { title: 'Career Growth', text: 'Comprehensive placement assistance, mock interviews, resume building, and career guidance to help students achieve their goals.', icon: Heart, color: 'bg-brandCoral/10 text-brandCoral-dark' },
    { title: 'Hands-On Experience', text: 'Build live projects, work on industry case studies, and gain practical experience that employers value.', icon: Users, color: 'bg-brandSky/10 text-brandSky-dark' }
  ];

  return (
    <div className="px-4 py-12 mx-auto space-y-16 max-w-7xl md:px-8">

      {/* Introduction Hero */}
      <section className="grid items-center grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase border rounded-full text-brandCoral bg-brandCoral/10 border-brandCoral/20">WHO WE ARE</span>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl text-slate-800">
            Empowering Future Developers with Industry-Ready Skills
          </h1>
          <p className="text-sm font-medium leading-relaxed md:text-base text-slate-600">
      Appletree infotech is a leading software training institute specializing
      in Java Full Stack Development, MERN Stack Development, Spring Boot,
      Microservices, DevOps, Cloud Computing, and modern web technologies. Our
      mission is to bridge the gap between academic learning and real-world
      industry requirements.
          </p>
          <p className="text-sm leading-relaxed text-slate-500">
 Through hands-on projects, live coding sessions, mock interviews, and
      personalized mentorship, we help students build strong technical
      foundations and gain practical experience. Our expert trainers and
      industry-focused curriculum prepare aspiring developers to excel in
      software engineering careers and secure opportunities at top technology
      companies.
          </p>
        </div>

        <div className="relative lg:col-span-5">
          <div className="overflow-hidden rounded-3xl border-8 border-white shadow-xl bg-white rotate-[2deg] hover:rotate-0 transition-transform duration-300">
            <img
              src="/balo.jpg"
              alt="Toddler painting with teacher"
              className="w-full h-[320px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="relative grid grid-cols-1 gap-8 p-8 overflow-hidden bg-white border shadow-sm border-orange-50 md:p-12 rounded-3xl md:grid-cols-2 md:gap-12">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none bg-brandYellow/10" />

        <div className="space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brandCoral/10 text-brandCoral">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold font-quicksand text-slate-800">Our Vision</h3>
          <p className="text-sm leading-relaxed text-slate-600">
            To create a joyful, secure, and nurturing world where early learners can confidently explore their potentials, develop critical thinking, collaborate selflessly with their peers, and build a foundations to be global citizens.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brandSky/10 text-brandSky">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold font-quicksand text-slate-800">Our Mission</h3>
          <p className="text-sm leading-relaxed text-slate-600">
            To deliver top-tier holistic education using modern child-centric toolsets, maintaining standard hygiene practices, fostering creative experimentation, and keeping parents actively aligned with their children’s development logs.
          </p>
        </div>
      </section>

      {/* Principal Message */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#FAF8F5] border border-orange-50 rounded-3xl p-8 md:p-12">
        <div className="flex justify-center lg:col-span-4">
          <img
            src="/umesh.jpeg"
            alt="Dr. Shruti Sen Principal"
            className="object-cover w-48 h-48 border-4 border-white shadow-md md:w-56 md:h-56 rounded-2xl"
          />
        </div>

        <div className="space-y-4 text-left lg:col-span-8">
          <span className="text-xs font-bold tracking-widest uppercase text-brandSky">MESSAGE FROM THE DIRECTOR</span>
          <h3 className="text-2xl font-bold font-quicksand text-slate-800">Welcome to the Future of Software Development!</h3>
         <p className="text-sm italic leading-relaxed text-slate-600">
  "Every student has the potential to become an exceptional developer with the right guidance, dedication, and practical experience. At our institute, we focus on transforming aspiring learners into industry-ready professionals through hands-on projects, real-world applications, and expert mentorship. We don't just teach programming languages—we help students develop problem-solving skills, confidence, and the mindset needed to succeed in today's technology-driven world. Join us and take the first step toward building a successful career in software development."
</p>
          <div>
            <h4 className="text-sm font-bold font-quicksand text-slate-800">Mr. Umesh Chandra</h4>
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Director, Appletree infotech institute</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-4 text-center">
        <h2 className="text-3xl font-bold font-quicksand text-slate-800">Our Core Values</h2>
        <p className="max-w-lg mx-auto text-sm text-slate-500">
          These principles guide every class, play session, and curriculum planning at our coaching center.
        </p>

        <div className="grid grid-cols-1 gap-6 pt-8 text-left md:grid-cols-3">
          {coreValues.map((val, idx) => (
            <div key={idx} className="p-6 space-y-4 bg-white border shadow-sm border-orange-50 rounded-2xl">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${val.color}`}>
                <val.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-quicksand text-slate-800">{val.title}</h3>
              <p className="text-xs leading-relaxed text-slate-600">{val.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Faculty Information */}
      <section className="space-y-4 text-center">
        <h2 className="text-3xl font-bold font-quicksand text-slate-800">Meet Our Educators</h2>
        <p className="max-w-lg mx-auto text-sm text-slate-500">
          Our team comprises highly qualified, warm, and safety-trained teachers specializing in early years development.
        </p>

        <div className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {staff.map((member, idx) => (
            <div key={idx} className="overflow-hidden transition-shadow bg-white border shadow-sm border-orange-50 rounded-2xl hover:shadow-md">
              <img
                src={member.img}
                alt={member.name}
                className="object-cover w-full h-48"
              />
              <div className="p-4 space-y-1 text-center">
                <h4 className="text-sm font-bold font-quicksand text-slate-800">{member.name}</h4>
                <p className="text-[10px] text-brandCoral font-bold uppercase">{member.role}</p>
                <p className="text-xs text-slate-500">{member.qualifications}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
