import { useState, useEffect, useMemo } from 'react';
import { ExternalLink, ZoomIn, X, ChevronUp, Search, Play, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { products, categories, usages, Category, Usage, Product } from './data';

function getYouTubeVideoInfo(url: string | undefined): { id: string; start?: string } | null {
  if (!url) return null;
  
  // Extract video ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  const id = (match && match[2].length === 11) ? match[2] : null;
  
  if (!id) return null;

  // Extract start time
  let start: string | undefined;
  try {
    const urlObj = new URL(url);
    const tParam = urlObj.searchParams.get('t') || urlObj.searchParams.get('start');
    if (tParam) {
      // Handle '578s' or '578'
      start = tParam.replace('s', '');
    }
  } catch (e) {
    // Invalid URL, ignore
  }

  return { id, start };
}

export default function App() {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<{ id: string; start?: string } | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'category' | 'usage'>('category');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter products based on search query and selected filter
  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.summary.toLowerCase().includes(query)
      );
    }

    if (selectedFilter !== 'All') {
      if (viewMode === 'category') {
        result = result.filter(p => p.category === selectedFilter);
      } else {
        result = result.filter(p => p.usage.includes(selectedFilter as Usage) || p.usage.includes('Tous'));
      }
    }

    return result;
  }, [searchQuery, selectedFilter, viewMode]);

  // Get active groups based on current view mode
  const activeGroups = useMemo(() => {
    if (viewMode === 'category') {
      return categories.filter((cat) =>
        filteredProducts.some((p) => p.category === cat)
      );
    } else {
      return usages.filter((usage) =>
        filteredProducts.some((p) => p.usage.includes(usage) || p.usage.includes('Tous'))
      );
    }
  }, [filteredProducts, viewMode]);

  useEffect(() => {
    // Reset filter when switching view mode
    setSelectedFilter('All');
  }, [viewMode]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200">
      {/* Header */}
      <header className="bg-stone-900 text-stone-50 pt-20 pb-24 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 uppercase leading-none" 
            style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
          >
            Zardoz
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-stone-400 max-w-2xl mx-auto leading-relaxed font-medium mb-0"
          >
            L’autonomie et la résilience face aux crises du quotidien. 
            <span className="block mt-2 text-emerald-500 font-semibold">100 % légal – civil – non militaire.</span>
          </motion.p>
        </div>
      </header>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row items-center gap-4">
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-stone-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-200 text-stone-900 rounded-xl py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 w-full md:w-auto">
            <button
              onClick={() => setViewMode('category')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                viewMode === 'category' 
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200' 
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Catégories
            </button>
            <button
              onClick={() => setViewMode('usage')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                viewMode === 'usage' 
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200' 
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Usages
            </button>
          </div>

          {/* Horizontal Scroll Filters (Desktop) / Filter Button (Mobile) */}
          <div className="hidden md:flex flex-1 overflow-x-auto no-scrollbar gap-2 py-1">
            <button
              onClick={() => setSelectedFilter('All')}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                selectedFilter === 'All'
                  ? 'bg-stone-900 border-stone-900 text-white'
                  : 'bg-white border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700'
              }`}
            >
              Tous
            </button>
            {(viewMode === 'category' ? categories : usages).map((item) => (
              <button
                key={item}
                onClick={() => setSelectedFilter(item)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                  selectedFilter === item
                    ? 'bg-stone-900 border-stone-900 text-white'
                    : 'bg-white border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile Filter Button */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className="flex-1 md:hidden py-2.5 bg-stone-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Filter size={16} />
              <span>Filtrer</span>
              <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {selectedFilter === 'All' ? 'Tous' : selectedFilter}
              </span>
            </button>
            <div className="hidden md:flex items-center px-3 py-1.5 bg-stone-100 rounded-full border border-stone-200 text-[10px] font-bold text-stone-500 uppercase tracking-wider whitespace-nowrap">
              {filteredProducts.length} Produits
            </div>
            {/* Mobile Count */}
            <div className="md:hidden flex items-center px-3 py-2.5 bg-stone-100 rounded-xl border border-stone-200 text-[10px] font-bold text-stone-500 uppercase tracking-wider whitespace-nowrap">
              {filteredProducts.length}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsFilterModalOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold uppercase tracking-tight">Filtres</h3>
                <button onClick={() => setIsFilterModalOpen(false)} className="p-2 bg-stone-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedFilter('All');
                    setIsFilterModalOpen(false);
                  }}
                  className={`py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wider border text-center transition-all ${
                    selectedFilter === 'All'
                      ? 'bg-stone-900 border-stone-900 text-white'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  Tous
                </button>
                {(viewMode === 'category' ? categories : usages).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSelectedFilter(item);
                      setIsFilterModalOpen(false);
                    }}
                    className={`py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wider border text-center transition-all ${
                      selectedFilter === item
                        ? 'bg-stone-900 border-stone-900 text-white'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {activeGroups.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-stone-500">Aucun équipement ne correspond à votre sélection.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('All');
              }}
              className="mt-4 text-emerald-600 font-semibold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          activeGroups.map((group) => {
            const groupProducts = filteredProducts.filter((p) => 
              viewMode === 'category' 
                ? p.category === group 
                : (p.usage.includes(group as Usage) || p.usage.includes('Tous'))
            );
            
            if (groupProducts.length === 0) return null;

            return (
              <section key={group} id={`group-${group.toLowerCase()}`} className="mb-20 scroll-mt-8">
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="text-3xl font-bold uppercase tracking-wide text-stone-800">{group}</h2>
                  <div className="h-px bg-stone-300 flex-1"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {groupProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onZoom={() => setZoomedImage(product.imageUrl)} 
                      onPlayVideo={(videoInfo) => setActiveVideo(videoInfo)}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-6 border-t border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8">
            {activeGroups.map((group) => (
              <a 
                key={group} 
                href={`#group-${group.toLowerCase()}`}
                className="hover:text-stone-50 transition-colors uppercase text-sm font-semibold tracking-wider"
              >
                {group}
              </a>
            ))}
          </div>

          {/* Amazon Partner Info */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-3">
            <p className="text-sm max-w-xs">
              Tous nos produits sont disponibles sur Amazon.fr avec livraison rapide et garantie.
            </p>
            <div className="flex items-center gap-2 bg-stone-800 px-4 py-2 rounded-full border border-stone-700">
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">Partenaire</span>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
                alt="Amazon.fr" 
                className="h-5 brightness-0 invert opacity-90"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-500 transition-colors z-40"
            aria-label="Retour en haut"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/90 backdrop-blur-sm p-4"
            onClick={() => setZoomedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-stone-400 hover:text-white transition-colors"
              onClick={() => setZoomedImage(null)}
              aria-label="Fermer"
            >
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={zoomedImage} 
              alt="Zoomed product" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/90 backdrop-blur-sm p-4"
            onClick={() => setActiveVideo(null)}
          >
            <button 
              className="absolute top-6 right-6 text-stone-400 hover:text-white transition-colors"
              onClick={() => setActiveVideo(null)}
              aria-label="Fermer la vidéo"
            >
              <X size={32} />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=0&modestbranding=1&rel=0${activeVideo.start ? `&start=${activeVideo.start}` : ''}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({ product, onZoom, onPlayVideo }: { key?: string, product: Product, onZoom: () => void, onPlayVideo: (videoInfo: { id: string; start?: string }) => void }) {
  const videoInfo = getYouTubeVideoInfo(product.videoUrl);

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 flex flex-col group hover:shadow-md transition-shadow"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 cursor-zoom-in" onClick={onZoom}>
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 bg-white/90 text-stone-900 p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
            <ZoomIn size={24} />
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-stone-900 mb-3 leading-tight">
          {product.title}
        </h3>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-[10px] font-bold uppercase tracking-wider rounded border border-stone-200">
            {product.category}
          </span>
          {product.usage.map((u) => (
            <span key={u} className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${
              u === 'Tous' 
                ? 'bg-stone-100 text-stone-500 border-stone-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
            }`}>
              {u}
            </span>
          ))}
        </div>

        <p className="text-stone-600 mb-6 flex-1 text-sm leading-relaxed">
          {product.summary}
        </p>
        
        <div className="flex flex-col gap-3 mt-auto">
          {/* Video Button */}
          {videoInfo && (
            <button
              onClick={() => onPlayVideo(videoInfo)}
              className="inline-flex items-center justify-center gap-2 w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-2.5 px-4 rounded-xl transition-colors border border-stone-200"
              aria-label="Voir la vidéo explicative"
            >
              <Play size={18} className="text-red-600" />
              <span>Voir la vidéo</span>
            </button>
          )}

          {/* Amazon Action Button */}
          <a 
            href={product.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold py-3 px-4 rounded-xl transition-colors shadow-sm"
          >
            <span>Voir sur Amazon</span>
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
