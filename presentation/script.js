// Argus Law Presentation Script
class Presentation {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideEl = document.getElementById('currentSlide');
        this.totalSlidesEl = document.getElementById('totalSlides');
        this.progressFill = document.getElementById('progressFill');
        
        this.init();
    }
    
    init() {
        this.totalSlidesEl.textContent = this.totalSlides;
        
        // Button navigation
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
                e.preventDefault();
                this.nextSlide();
            } else if (e.key === 'Home') {
                this.goToSlide(0);
            } else if (e.key === 'End') {
                this.goToSlide(this.totalSlides - 1);
            } else if (e.key === 'f' || e.key === 'F') {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            }
        });
        
        // Mouse wheel navigation with throttle
        let wheelTimeout;
        let isWheeling = false;
        
        document.addEventListener('wheel', (e) => {
            if (isWheeling) return;
            
            const delta = e.deltaY;
            
            if (Math.abs(delta) > 30) {
                isWheeling = true;
                
                if (delta > 0) {
                    // Scroll down - next slide
                    this.nextSlide();
                } else {
                    // Scroll up - previous slide
                    this.prevSlide();
                }
                
                // Throttle to prevent too fast scrolling
                setTimeout(() => {
                    isWheeling = false;
                }, 800);
            }
        }, { passive: true });
        
        // Touch/swipe navigation
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            this.handleSwipe();
        }, { passive: true });
        
        this.handleSwipe = () => {
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // Only trigger if horizontal swipe is bigger than vertical (not scrolling content)
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        // Swipe left - next slide
                        this.nextSlide();
                    } else {
                        // Swipe right - previous slide
                        this.prevSlide();
                    }
                }
            }
        };
        
        this.updateSlide();
        
        document.body.style.overflow = 'hidden';
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlide = index;
            this.updateSlide();
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateSlide();
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlide();
        }
    }
    
    updateSlide() {
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        this.slides[this.currentSlide].classList.add('active');
        
        this.currentSlideEl.textContent = this.currentSlide + 1;
        
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        this.progressFill.style.width = progress + '%';
        
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        
        window.location.hash = this.currentSlide + 1;
    }
    
    loadFromHash() {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const slideNum = parseInt(hash) - 1;
            if (!isNaN(slideNum) && slideNum >= 0 && slideNum < this.totalSlides) {
                this.currentSlide = slideNum;
                this.updateSlide();
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const presentation = new Presentation();
    
    presentation.loadFromHash();
    
    window.addEventListener('hashchange', () => {
        presentation.loadFromHash();
    });
});

window.addEventListener('beforeprint', () => {
    document.querySelectorAll('.slide').forEach(slide => {
        slide.style.display = 'flex';
        slide.style.pageBreakAfter = 'always';
    });
});