        document.addEventListener('DOMContentLoaded', () => {
            // ... existing drag and drop code ...
            const navList = document.getElementById('draggable-nav');
            let navItems = navList.querySelectorAll('.nav-item');
            let dragSrcEl = null;

            // Helper to check if we are in mobile view
            const isMobile = () => window.innerWidth < 992;

            // 1. Setup Drag Attributes based on screen size
            function updateDragState() {
                navItems = navList.querySelectorAll('.nav-item'); // Refresh list
                if (isMobile()) {
                    navItems.forEach(item => {
                        item.setAttribute('draggable', 'true');
                        item.style.cursor = 'move';
                    });
                } else {
                    navItems.forEach(item => {
                        item.setAttribute('draggable', 'false');
                        item.style.cursor = 'default';
                    });
                }
            }

            // Run on load and resize
            updateDragState();
            window.addEventListener('resize', updateDragState);

            // 2. Active Link Logic
            const links = document.querySelectorAll('.nav-link');
            links.forEach(link => {
                link.addEventListener('click', function() {
                    links.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Close mobile menu on click
                    if(isMobile()) {
                        const bsCollapse = new bootstrap.Collapse(document.getElementById('navbarContent'), {
                            toggle: false
                        });
                        bsCollapse.hide();
                    }
                });
            });

            // 3. Drag and Drop Event Handlers
            function handleDragStart(e) {
                if (!isMobile()) {
                    e.preventDefault();
                    return;
                }
                this.classList.add('dragging');
                dragSrcEl = this;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', this.innerHTML);
            }

            function handleDragOver(e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary for drop to work
                }
                e.dataTransfer.dropEffect = 'move';
                
                // Add visual cue
                if (this !== dragSrcEl) {
                    this.classList.add('drag-over');
                }
                return false;
            }

            function handleDragLeave(e) {
                this.classList.remove('drag-over');
            }

            function handleDrop(e) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }

                if (dragSrcEl !== this) {
                    // Simple Swap Logic
                    const srcIndex = [...navList.children].indexOf(dragSrcEl);
                    const targetIndex = [...navList.children].indexOf(this);
                    
                    if(srcIndex < targetIndex) {
                        this.after(dragSrcEl);
                    } else {
                        this.before(dragSrcEl);
                    }
                }
                return false;
            }

            function handleDragEnd() {
                this.classList.remove('dragging');
                navItems.forEach(item => {
                    item.classList.remove('drag-over');
                });
            }

            // Attach events
            navItems.forEach(item => {
                item.addEventListener('dragstart', handleDragStart, false);
                item.addEventListener('dragenter', (e) => e.preventDefault(), false); 
                item.addEventListener('dragover', handleDragOver, false);
                item.addEventListener('dragleave', handleDragLeave, false);
                item.addEventListener('drop', handleDrop, false);
                item.addEventListener('dragend', handleDragEnd, false);
            });

            // --- Back To Top Logic ---
            const backToTopBtn = document.getElementById('backToTop');

            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
