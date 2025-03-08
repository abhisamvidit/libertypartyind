document.addEventListener('DOMContentLoaded', () => {
    // First, load necessary libraries
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
        .then(() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'))
        .then(() => {
            console.log('PDF libraries loaded successfully');
            initializeCardGenerator();
        })
        .catch(error => {
            console.error('Error loading libraries:', error);
            alert('Error loading necessary components. Please refresh the page and try again.');
        });

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }

    function initializeCardGenerator() {
        const form = document.getElementById('idCardForm');
        const modal = document.getElementById('cardModal');
        const closeModal = document.querySelector('.close-modal');
        const avatarUpload = document.getElementById('avatarUpload');
        const cardAvatar = document.getElementById('cardAvatar');
        const genderSelect = document.getElementById('userGender');
        const fileNameDisplay = document.getElementById('file-name');
        const downloadBtn = document.getElementById('modalDownload');
        
        // Store avatar data for PDF export
        let currentAvatarData = null;
        
        // Default avatar images
        const avatarImages = {
            male: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?t=st=1741409067~exp=1741412667~hmac=68d597d1da2c98516262bfe35f62df7760ab592fb3a4ac7119f1c73fd6b09908&w=740",
            female: "https://img.freepik.com/free-vector/traditional-indian-woman-illustration_1308-174432.jpg?t=st=1741409162~exp=1741412762~hmac=0061e03dfafb14a141304d6fccc563bf7d4efa806bb3c3f8857748b82eb8d918&w=740",
            other: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4em0tMS00aDJ2MmgtMnptMS42MS05Ljk2Yy0yLjA2LS4zLTMuNjEuODUtMy42MSAyLjk2aDJjMC0uODMuNi0xLjUzIDEuMzktMS43MS41My0uMTIgMS4wNy4wNyAxLjQ0LjQ0LjM3LjM3LjU2LjkxLjQ0IDEuNDQtLjE4Ljc5LS44OCAxLjM5LTEuNzEgMS4zOUgxMmMtMS4xIDAtMiAuOS0yIDJ2MWgydi0uNWMwLS4yOC4yMi0uNS41LS41cy41LjIyLjUuNS4yMi41LjUuNS41LS4yMi41LS41VjE0YzAtMS4xLS45LTItMi0yaC0uNWMtMS42NiAwLTMtMS4zNC0zLTMgMC0yLjQ0IDEuODYtMy43OCAzLjYxLTMuOTYgMS4zLS4xOCAyLjUzLjMyIDMuMzQgMS4xOC44MS44NSAxLjE1IDIuMDIuOTMgMy4xNC0uMi45OS0uOTEgMS4yLTEuODkgMS4yLTEuODktMS41MS0uODktMi40My0xLjUxLTIuODctMS43My0uNS0uMjUtLjg5LS42Ni0xLjEtMS4xOC0uMi0uNTItLjIzLTEuMDktLjA2LTEuNjJ6IiBmaWxsPSIjMGEyNDYzIi8+PC9zdmc+" 
        };

        // Preload avatar images
        preloadImages(Object.values(avatarImages));

        // Initialize default avatar
        updateAvatar(genderSelect.value);

        // Handle gender change
        genderSelect.addEventListener('change', (e) => {
            if(!avatarUpload.files.length) {
                updateAvatar(e.target.value);
            }
        });

        // Handle avatar upload
        avatarUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(file) {
                fileNameDisplay.textContent = file.name;
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target.result;
                    cardAvatar.innerHTML = `<img src="${result}" alt="User Avatar">`;
                    currentAvatarData = result; // Store for PDF export
                };
                reader.readAsDataURL(file);
            } else {
                fileNameDisplay.textContent = "No file chosen";
                updateAvatar(genderSelect.value);
            }
        });

        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            updateCardPreview();
            showModal();
        });

        // Handle modal close
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Handle download
        downloadBtn.addEventListener('click', handleDownload);

        // Handle edit button
        document.getElementById('modalEdit').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        function updateAvatar(gender) {
            // Set avatar image
            cardAvatar.innerHTML = `<img src="${avatarImages[gender]}" alt="${gender} avatar">`;
            currentAvatarData = avatarImages[gender]; // Store for PDF export
        }

        function updateCardPreview() {
            // Generate random ID with prefix LP and current year
            const currentYear = new Date().getFullYear();
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const cardId = `${currentYear}-${randomNum}`;
            
            // Get current month and year for membership date
            const currentDate = new Date();
            const month = currentDate.toLocaleString('default', { month: 'long' });
            const year = currentDate.getFullYear();
            
            // Update card preview with form values
            document.getElementById('previewName').textContent = document.getElementById('userName').value;
            document.getElementById('previewAge').textContent = document.getElementById('userAge').value;
            
            // Combine city and state
            const city = document.getElementById('userCity').value;
            const state = document.getElementById('userState').value;
            document.getElementById('previewCity').textContent = city + (state ? `, ${state}` : '');
            
            document.getElementById('previewId').textContent = cardId;
            document.getElementById('previewDate').textContent = `${month} ${year}`;
            
            // Clone the card for modal preview
            const previewCard = document.getElementById('idCardPreview');
            const modalPreview = document.getElementById('modalCardPreview');
            const clone = previewCard.cloneNode(true);
            clone.id = 'modalCardClone';
            modalPreview.innerHTML = '';
            modalPreview.appendChild(clone);

            // Update barcode
            const barcodeContainer = clone.querySelector('.barcode');
            barcodeContainer.innerHTML = '';
            barcodeContainer.appendChild(generateBarcode());
        }

        function showModal() {
            const modal = document.getElementById('cardModal');
            modal.style.display = 'flex';
        }

        function preloadImages(urls) {
            urls.forEach(url => {
                const img = new Image();
                img.src = url;
            });
        }

        // Modified handleDownload function for perfect HD PNG
        function handleDownload() {
            const button = this;
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="loading-spinner"></span> Generating HD Image...';
            button.disabled = true;

            // Create a clone with preserved styles
            const originalCard = document.querySelector('#modalCardPreview .libertarian-card');
            const cardElement = originalCard.cloneNode(true);

            // Force show all elements
            cardElement.querySelectorAll('*').forEach(el => {
                el.style.display = 'block';
                el.style.visibility = 'visible';
                el.style.opacity = '1';
                el.style.boxShadow = 'none'; // Remove shadows for better capture
            });

            // Create temporary container
            const tempContainer = document.createElement('div');
            Object.assign(tempContainer.style, {
                position: 'fixed',
                left: '-9999px',
                transform: 'scale(1)', // Double size for HD
                transformOrigin: 'top left'
            });
            tempContainer.appendChild(cardElement);
            document.body.appendChild(tempContainer);

            // Wait for all images to load
            const imageLoadPromises = Array.from(cardElement.querySelectorAll('img')).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => img.onload = resolve);
            });

            Promise.all(imageLoadPromises).then(() => {
                html2canvas(cardElement, {
                    scale: 2, // Base scale
                    windowWidth: cardElement.offsetWidth * 2,
                    windowHeight: cardElement.offsetHeight * 2,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: null,
                    logging: false,
                    letterRendering: true,
                    onclone: (clonedDoc) => {
                        clonedDoc.querySelectorAll('*').forEach(el => {
                            el.style.display = 'block';
                            el.style.visibility = 'visible';
                        });
                    }
                }).then(canvas => {
                    // Create download link
                    // const link = document.createElement('a');
                    // link.download = `libertarian-id-${document.getElementById('userName').value.trim().toLowerCase()}-hd.png`;
                    // link.href = canvas.toDataURL('image/png', 1.0);
                    // link.click();

                    // Cleanup
                    tempContainer.remove();
                    button.innerHTML = originalText;
                    button.disabled = false;
                }).catch(err => {
                    console.error('Image capture error:', err);
                    alert('Error generating image. Please try again.');
                    tempContainer.remove();
                    button.innerHTML = originalText;
                    button.disabled = false;
                });
            });
        }

        // Enhanced barcode generator
        function generateBarcode() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const dpi = 2; // Retina resolution
            canvas.width = 120 * dpi;
            canvas.height = 40 * dpi;
            ctx.scale(dpi, dpi);
            
            // Complex barcode pattern
            for(let i = 0; i < 120; i++) {
                const barHeight = Math.random() > 0.7 ? 40 : (30 + Math.random() * 10);
                ctx.fillStyle = Math.random() > 0.35 ? '#000' : '#fff';
                ctx.fillRect(i, 0, 1, barHeight);
            }
            
            return canvas;
        }
    }
});