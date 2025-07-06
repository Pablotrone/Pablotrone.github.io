/**
 * Enhanced Preloader for Argus Law Firm
 * PROFESSIONAL VERSION WITH PERFECT POSITIONING AND RELIABILITY
 */

class EnhancedPreloader {
    constructor() {
        this.duration = 2500; // 2.5 seconds
        this.progressInterval = null;
        this.isComplete = false;
        this.statusMessages = [
            'Подготавливаем ресурсы...',
            'Загружаем интерфейс...',
            'Инициализируем систему...',
            'Проверяем соединение...',
            'Почти готово...',
            'Добро пожаловать в Argus Law!'
        ];
        
        this.init();
    }

    init() {
        // Enhanced check for when to show preloader
        if (!this.shouldShow()) {
            this.completeImmediately();
            return;
        }

        console.log('🎬 Starting Enhanced Preloader...');
        this.showPreloader();
        this.startProgress();
        this.hideAfterDelay();
    }

    shouldShow() {
        // Check for force parameter
        const urlParams = new URLSearchParams(window.location.search);
        const forceShow = urlParams.get('preloader') === 'true';
        
        if (forceShow) {
            console.log('🔧 Preloader forced via URL parameter');
            return true;
        }

        // Skip preloader if navigating directly to a section via hash
        if (window.location.hash && window.location.hash !== '#home') {
            console.log('🔗 Direct section navigation detected, skipping preloader');
            return false;
        }

        // Check for development mode
        const devMode = urlParams.get('dev') === 'true' || 
                       localStorage.getItem('argus_dev_mode') === 'true';

        if (devMode) {
            console.log('🛠️ Development mode detected, showing preloader');
            return true;
        }

        // Show only on first visit per session
        const visited = sessionStorage.getItem('argus_visited');
        if (!visited) {
            sessionStorage.setItem('argus_visited', 'true');
            console.log('👋 First visit detected, showing preloader');
            return true;
        }

        // Check if page was refreshed
        if (performance.navigation && performance.navigation.type === performance.navigation.TYPE_RELOAD) {
            console.log('🔄 Page refresh detected, showing preloader');
            return true;
        }

        return false;
    }

    showPreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) {
            console.error('❌ Preloader element not found');
            this.completeImmediately();
            return;
        }

        // Ensure preloader is properly positioned
        preloader.style.display = 'flex';
        preloader.style.opacity = '1';
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        // Add loading class to body for styling hooks
        document.body.classList.add('preloader-active');
        
        console.log('✅ Preloader displayed and positioned');
    }

    startProgress() {
        const progressBar = document.querySelector('.preloader-progress');
        const percentage = document.querySelector('.preloader-percentage');
        const status = document.querySelector('.preloader-status');
        
        if (!progressBar) {
            console.warn('⚠️ Progress bar not found, continuing without progress');
            return;
        }

        let progress = 0;
        const interval = 50; // Update every 50ms for smooth animation
        const totalSteps = this.duration / interval;
        const step = 100 / totalSteps;

        // Enhanced status message timing
        const statusUpdateIntervals = [
            { progress: 0, messageIndex: 0 },
            { progress: 20, messageIndex: 1 },
            { progress: 40, messageIndex: 2 },
            { progress: 60, messageIndex: 3 },
            { progress: 85, messageIndex: 4 },
            { progress: 95, messageIndex: 5 }
        ];

        this.progressInterval = setInterval(() => {
            progress += step;
            
            // Ensure we don't exceed 100%
            if (progress >= 100) {
                progress = 100;
                clearInterval(this.progressInterval);
                this.progressInterval = null;
            }

            // Update progress bar with smooth easing
            const easedProgress = this.easeOutCubic(progress / 100) * 100;
            progressBar.style.width = easedProgress + '%';
            
            // Add animation class for shimmer effect
            if (!progressBar.classList.contains('animating')) {
                progressBar.classList.add('animating');
            }

            // Update percentage display
            if (percentage) {
                percentage.textContent = Math.round(progress) + '%';
            }

            // Update status message based on progress
            if (status) {
                for (let i = statusUpdateIntervals.length - 1; i >= 0; i--) {
                    const statusUpdate = statusUpdateIntervals[i];
                    if (progress >= statusUpdate.progress) {
                        const newMessage = this.statusMessages[statusUpdate.messageIndex];
                        if (status.textContent !== newMessage) {
                            this.updateStatusWithAnimation(status, newMessage);
                        }
                        break;
                    }
                }
            }

            // Trigger completion at 100%
            if (progress >= 100) {
                this.markAsComplete();
            }
        }, interval);
    }

    updateStatusWithAnimation(statusElement, newMessage) {
        // Fade out current message
        statusElement.style.transition = 'opacity 0.2s ease';
        statusElement.style.opacity = '0';
        
        setTimeout(() => {
            statusElement.textContent = newMessage;
            statusElement.style.opacity = '0.6';
        }, 200);
    }

    markAsComplete() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        const preloader = document.querySelector('.preloader');
        
        if (preloader) {
            preloader.classList.add('complete');
            console.log('✨ Preloader completed successfully');
        }

        // Clean up progress animation
        const progressBar = document.querySelector('.preloader-progress');
        if (progressBar) {
            progressBar.classList.remove('animating');
        }
    }

    hideAfterDelay() {
        setTimeout(() => {
            this.hidePreloader();
        }, this.duration);
    }

    hidePreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) {
            this.completeImmediately();
            return;
        }

        console.log('🎭 Hiding preloader...');

        // Clean up any running intervals
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }

        // Ensure completion state
        this.markAsComplete();

        // Enhanced fade out with staging
        preloader.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        preloader.style.opacity = '0';
        
        setTimeout(() => {
            preloader.style.display = 'none';
            
            // Restore body scroll
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.classList.remove('preloader-active');
            
            // Dispatch completion event
            this.dispatchCompletionEvent();
            
            console.log('🎉 Preloader hidden successfully');
        }, 500);
    }

    completeImmediately() {
        console.log('⚡ Completing preloader immediately');
        
        // Clean up any running processes
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        
        // Hide preloader element if it exists
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.display = 'none';
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.classList.remove('preloader-active');
        
        // Dispatch completion event
        this.dispatchCompletionEvent();
    }

    dispatchCompletionEvent() {
        // Store instance globally for debugging
        window.preloaderInstance = this;
        
        // Dispatch custom event
        const completionEvent = new CustomEvent('preloaderComplete', {
            detail: {
                duration: this.duration,
                timestamp: Date.now(),
                userAgent: navigator.userAgent
            }
        });
        
        document.dispatchEvent(completionEvent);
        console.log('📡 Preloader completion event dispatched');
    }

    // Easing function for smooth progress animation
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Method to force hide (useful for debugging)
    forceHide() {
        console.log('🔧 Force hiding preloader');
        this.hidePreloader();
    }

    // Method to get current status
    getStatus() {
        return {
            isComplete: this.isComplete,
            duration: this.duration,
            element: document.querySelector('.preloader'),
            intervalRunning: !!this.progressInterval
        };
    }
}

// === INITIALIZATION ===
let preloaderInstance = null;

// Initialize when DOM is ready
function initializePreloader() {
    if (preloaderInstance) {
        console.log('⚠️ Preloader already initialized');
        return preloaderInstance;
    }
    
    preloaderInstance = new EnhancedPreloader();
    return preloaderInstance;
}

// Auto-initialize based on document ready state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePreloader);
} else {
    // DOM is already loaded
    initializePreloader();
}

// === GLOBAL UTILITIES FOR DEVELOPMENT ===

// Function to force hide preloader (for development)
window.hidePreloader = function() {
    console.log('🛠️ Manually hiding preloader...');
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.display = 'none';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.classList.remove('preloader-active');
    }
    
    if (preloaderInstance) {
        preloaderInstance.forceHide();
    } else {
        // Dispatch event anyway
        document.dispatchEvent(new CustomEvent('preloaderComplete'));
    }
};

// Function to reset preloader for testing
window.resetPreloader = function() {
    console.log('🔄 Resetting preloader for testing...');
    sessionStorage.removeItem('argus_visited');
    location.reload();
};

// Function to show preloader (for development)
window.showPreloader = function() {
    console.log('🎬 Manually showing preloader...');
    sessionStorage.removeItem('argus_visited');
    preloaderInstance = null;
    initializePreloader();
};

// Function to get preloader status
window.getPreloaderStatus = function() {
    if (preloaderInstance) {
        return preloaderInstance.getStatus();
    }
    return {
        message: 'Preloader not initialized',
        element: document.querySelector('.preloader'),
        sessionVisited: sessionStorage.getItem('argus_visited')
    };
};

// Enable development mode
window.enablePreloaderDev = function() {
    localStorage.setItem('argus_dev_mode', 'true');
    console.log('🛠️ Preloader development mode enabled');
};

// Disable development mode
window.disablePreloaderDev = function() {
    localStorage.removeItem('argus_dev_mode');
    console.log('🛠️ Preloader development mode disabled');
};

// === ENHANCED ERROR HANDLING ===
window.addEventListener('error', function(e) {
    if (e.filename && e.filename.includes('preloader')) {
        console.error('❌ Preloader error:', e.error);
        // Attempt to complete preloader on error
        if (preloaderInstance) {
            preloaderInstance.completeImmediately();
        } else {
            window.hidePreloader();
        }
    }
});

// === PERFORMANCE MONITORING ===
if (window.performance && window.performance.mark) {
    window.performance.mark('preloader-script-loaded');
}

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedPreloader;
}