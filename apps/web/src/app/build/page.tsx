"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@siksatech/ui";
import { Footer } from "@siksatech/ui";
import { db, Project } from "@siksatech/database";
import {
  ArrowLeft, ChevronRight, Code2, Cpu, Wrench, GraduationCap,
  BarChart3, Target, Lightbulb, User, School, BookOpen
} from "lucide-react";

export default function BuildPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    db.getProjects().then(setProjects);
  }, []);

  const difficultyColors: Record<string, string> = {
    Easy: "bg-emerald-100 text-emerald-700",
    Medium: "bg-amber-100 text-amber-700",
    Hard: "bg-red-100 text-red-700",
  };

  if (selectedProject) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-slate-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Back */}
            <button
              onClick={() => setSelectedProject(null)}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all projects
            </button>

            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                    {selectedProject.title}
                  </h1>
                  <p className="text-base text-slate-600">{selectedProject.description}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${difficultyColors[selectedProject.difficulty]}`}>
                  {selectedProject.difficulty}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 mt-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{selectedProject.creatorName}</p>
                  {selectedProject.creatorSchool && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <School className="w-3 h-3" /> {selectedProject.creatorSchool}
                    </p>
                  )}
                  {selectedProject.creatorGrade && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <GraduationCap className="w-3 h-3" /> {selectedProject.creatorGrade}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Problem Statement */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-red-500" />
                <h2 className="text-base font-bold text-slate-900">Problem Statement</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{selectedProject.problemStatement}</p>
            </div>

            {/* Components & Technologies */}
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900">Components Used</h2>
                </div>
                <ul className="space-y-2">
                  {selectedProject.components.map((comp, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      {comp}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="w-5 h-5 text-purple-600" />
                  <h2 className="text-base font-bold text-slate-900">Technologies</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech, i) => (
                    <span key={i} className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Learning Objectives</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {selectedProject.learningObjectives.map((obj, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Step-by-Step Guide */}
            {selectedProject.steps && selectedProject.steps.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6">
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-slate-900">Step-by-Step Build Guide</h2>
                </div>
                <div className="space-y-4">
                  {selectedProject.steps.map((step) => (
                    <div key={step.stepNumber} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                        <p className="text-sm text-slate-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Code Snippet */}
            {selectedProject.codeSnippet && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900">Source Code</h2>
                </div>
                <div className="bg-slate-900 rounded-xl p-5 overflow-x-auto">
                  <pre className="text-sm text-slate-300 leading-relaxed font-mono">
                    <code>{selectedProject.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 min-h-screen">
        {/* Header */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-2xl">
              <span className="inline-block text-xs font-bold tracking-widest text-blue-600 uppercase mb-3">
                Student Showcase
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                Built by Students, Powered by Curiosity
              </h1>
              <p className="text-base text-slate-600 leading-relaxed">
                Real projects built by real students using real hardware. Each project includes
                the full build guide, component list, source code, and author profile.
              </p>
            </div>
          </div>
        </section>

        {/* Project Grid */}
        <section className="py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="bg-white rounded-xl border border-slate-200 p-6 text-left hover:shadow-lg hover:border-blue-200 transition-all group"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500">{project.studentLevel}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${difficultyColors[project.difficulty]}`}>
                      {project.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{project.creatorName}</p>
                      {project.creatorSchool && (
                        <p className="text-[10px] text-slate-500">{project.creatorSchool}</p>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Read more */}
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:gap-2 transition-all">
                    View Full Build Guide <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
