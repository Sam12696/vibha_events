import React, { useState, useEffect } from 'react';
import { PortfolioProject, Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const CATEGORIES: Category[] = [
  "Decoration & Styling", 
  "Photography", 
  "Videography", 
  "Catering", 
  "Wedding Planning", 
  "Corporate Events", 
  "Entertainment", 
  "Lighting & Sound",
  "VIP Transportation",
  "Venue Selection",
  "Invitations & Stationery",
  "Gifting & Favors",
  "Make-up"
];

export const PortfolioGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES[0]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch');
        const allProjects: PortfolioProject[] = await response.json();
        // Filter by category on client side for now, or update API to accept category
        const filtered = allProjects.filter(p => p.category === activeCategory);
        setProjects(filtered);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [activeCategory]);

  const handleNext = () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % projects.length;
    setSelectedProject(projects[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    setSelectedProject(projects[prevIndex]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-display font-bold mb-4">Our Real Work</h2>
        <p className="text-stone-600 max-w-2xl mx-auto italic">
          Explore our immersive galleries featuring actual event setups managed by Vibha Events.
        </p>
      </div>

      {/* Interactive Service Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300",
              activeCategory === cat
                ? "bg-stone-900 text-white shadow-lg scale-105"
                : "bg-white text-stone-500 hover:bg-stone-100 border border-stone-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="col-span-full text-center py-20 text-stone-400">Loading gallery...</div>
          ) : projects.length === 0 ? (
            <div className="col-span-full text-center py-20 text-stone-400">No projects found in this category.</div>
          ) : (
            projects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-200 cursor-pointer shadow-md"
                onClick={() => setSelectedProject(project)}
              >
                {project.mediaType === 'image' ? (
                  <img
                    src={project.mediaUrl}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <video
                    src={project.mediaUrl}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    muted
                    loop
                    onMouseOver={(e) => e.currentTarget.play()}
                    onMouseOut={(e) => e.currentTarget.pause()}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-xl">{project.title}</h3>
                  <p className="text-white/80 text-sm line-clamp-2">{project.description}</p>
                </div>
                <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-5 h-5 text-white" />
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-12"
          >
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white z-50"
            >
              <X className="w-8 h-8" />
            </button>

            <button 
              onClick={handlePrev}
              className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            <button 
              onClick={handleNext}
              className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors"
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
            >
              {selectedProject.mediaType === 'image' ? (
                <img
                  src={selectedProject.mediaUrl}
                  alt={selectedProject.title}
                  className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <video
                  src={selectedProject.mediaUrl}
                  className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl"
                  controls
                  autoPlay
                />
              )}
              <div className="mt-6 text-center max-w-2xl">
                <span className="text-stone-400 text-xs uppercase tracking-widest mb-2 block">{selectedProject.category}</span>
                <h3 className="text-white text-3xl font-display font-bold mb-2">{selectedProject.title}</h3>
                <p className="text-stone-300 text-lg leading-relaxed">{selectedProject.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
