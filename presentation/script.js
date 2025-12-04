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
        
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
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
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                this.nextSlide();
            }
            if (touchEndX > touchStartX + 50) {
                this.prevSlide();
            }
        };
        
        this.handleSwipe = handleSwipe;
        
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