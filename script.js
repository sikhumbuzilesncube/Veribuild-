// ========================================
// VERIBUILD - MAIN JAVASCRIPT
// Bulawayo, Zimbabwe
// ========================================

console.log('🚀 VeriBuild platform loaded successfully!');

// --- Global Variables ---
let capturedPhotos = [];
let stream = null;
let photoCount = 0;

// --- Wait for the page to load ---
document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // 1. PDF UPLOAD BUTTON
    // ========================================
    const uploadPdfBtn = document.getElementById('uploadPdfBtn');
    const pdfFileInput = document.getElementById('pdfFileInput');
    const fileDisplay = document.getElementById('fileDisplay');
    const fileName = document.getElementById('fileName');

    if (uploadPdfBtn) {
        uploadPdfBtn.addEventListener('click', function(e) {
            e.preventDefault();
            pdfFileInput.click();
        });
    }

    if (pdfFileInput) {
        pdfFileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                fileName.textContent = file.name;
                fileDisplay.style.display = 'block';
                // Hide camera container if visible
                const cameraContainer = document.getElementById('cameraContainer');
                if (cameraContainer) {
                    cameraContainer.style.display = 'none';
                }
                alert('✅ PDF uploaded: ' + file.name + '\nClick "Generate BOQ from PDF" to proceed.');
            }
        });
    }

    // ========================================
    // 2. TAKE PHOTO BUTTON (Open Camera)
    // ========================================
    const takePhotoBtn = document.getElementById('takePhotoBtn');
    const cameraContainer = document.getElementById('cameraContainer');
    const video = document.getElementById('video');
    const capturePhotoBtn = document.getElementById('capturePhotoBtn');
    const cancelCameraBtn = document.getElementById('cancelCameraBtn');
    const photoPreview = document.getElementById('photoPreview');
    const photoCountSpan = document.getElementById('photoCount');

    if (takePhotoBtn) {
        takePhotoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Hide PDF display if visible
            fileDisplay.style.display = 'none';
            // Show camera container
            cameraContainer.style.display = 'block';
            // Start camera
            startCamera();
        });
    }

    // ========================================
    // 3. START CAMERA
    // ========================================
    async function startCamera() {
        try {
            // Request camera access (rear camera preferred for plans)
            stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                },
                audio: false
            });
            video.srcObject = stream;
            video.style.display = 'block';
            capturePhotoBtn.style.display = 'inline-block';
            cancelCameraBtn.style.display = 'inline-block';
            alert('📸 Camera is ready. Tap "Take Photo" to capture your plan.');
        } catch (err) {
            alert('❌ Camera access denied. Please allow camera permissions or use the PDF upload option.');
            console.error('Camera error:', err);
            cameraContainer.style.display = 'none';
        }
    }

    // ========================================
    // 4. CAPTURE PHOTO
    // ========================================
    if (capturePhotoBtn) {
        capturePhotoBtn.addEventListener('click', function() {
            // Capture the current frame from the video
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 1920;
            canvas.height = video.videoHeight || 1080;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert to JPEG (high quality)
            const imageData = canvas.toDataURL('image/jpeg', 0.9);
            
            // Store photo
            capturedPhotos.push(imageData);
            photoCount++;
            photoCountSpan.textContent = photoCount;
            
            // Show preview section
            photoPreview.style.display = 'block';
            
            // Show feedback
            alert('✅ Photo ' + photoCount + ' captured! Take more or click "Generate BOQ from Photos".');
            
            // Add thumbnail preview
            const img = new Image();
            img.src = imageData;
            img.style.width = '80px';
            img.style.height = '80px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            img.style.margin = '5px';
            img.style.border = '2px solid #28a745';
            document.getElementById('photoPreview').appendChild(img);
        });
    }

    // ========================================
    // 5. CANCEL CAMERA
    // ========================================
    if (cancelCameraBtn) {
        cancelCameraBtn.addEventListener('click', function() {
            stopCamera();
            cameraContainer.style.display = 'none';
            capturedPhotos = [];
            photoCount = 0;
            photoCountSpan.textContent = '0';
            photoPreview.style.display = 'none';
            // Remove thumbnail previews
            const previewImgs = photoPreview.querySelectorAll('img');
            previewImgs.forEach(img => img.remove());
            alert('❌ Camera closed. You can upload a PDF instead.');
        });
    }

    // ========================================
    // 6. STOP CAMERA (Helper function)
    // ========================================
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        video.srcObject = null;
        video.style.display = 'none';
        if (capturePhotoBtn) capturePhotoBtn.style.display = 'none';
        if (cancelCameraBtn) cancelCameraBtn.style.display = 'none';
    }

    // ========================================
    // 7. GENERATE FROM PHOTOS
    // ========================================
    const generateFromPhotosBtn = document.getElementById('generateFromPhotosBtn');
    if (generateFromPhotosBtn) {
        generateFromPhotosBtn.addEventListener('click', function() {
            if (capturedPhotos.length === 0) {
                alert('❌ Please take at least one photo first.');
                return;
            }
            
            alert('📄 Generating BOQ from ' + capturedPhotos.length + ' photos...\n\n' +
                  '✅ Your photos will be converted to a PDF and processed.\n' +
                  '🔜 This feature is coming soon! We will notify you once it\'s ready.');
            
            // Log captured photos count
            console.log('📸 Captured photos:', capturedPhotos.length);
            
            // TODO: In Phase 2, we will send photos to the backend
        });
    }

    // ========================================
    // 8. GENERATE FROM PDF
    // ========================================
    const generateFromPdfBtn = document.getElementById('generateFromPdfBtn');
    if (generateFromPdfBtn) {
        generateFromPdfBtn.addEventListener('click', function() {
            const fileInput = document.getElementById('pdfFileInput');
            if (!fileInput.files || fileInput.files.length === 0) {
                alert('❌ Please upload a PDF first.');
                return;
            }
            
            alert('📄 Processing PDF: ' + fileInput.files[0].name + '\n\n' +
                  '🔜 BOQ generation is coming soon! We will notify you once it\'s ready.');
        });
    }

    // ========================================
    // 9. CLEAR PHOTOS
    // ========================================
    const clearPhotosBtn = document.getElementById('clearPhotosBtn');
    if (clearPhotosBtn) {
        clearPhotosBtn.addEventListener('click', function() {
            capturedPhotos = [];
            photoCount = 0;
            photoCountSpan.textContent = '0';
            photoPreview.style.display = 'none';
            // Remove thumbnail previews
            const previewImgs = photoPreview.querySelectorAll('img');
            previewImgs.forEach(img => img.remove());
            alert('🗑️ All photos cleared.');
        });
    }

    // ========================================
    // 10. EXISTING BUTTON HANDLERS
    // ========================================
    // Sign Up button (navigation)
    const signupBtn = document.querySelector('nav .btn-primary');
    if (signupBtn) {
        signupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('🔐 Sign up coming soon! You will be able to register with your phone number.');
        });
    }

    // Generate My BOQ button (hero section) - smooth scroll to generate section
    const generateBtn = document.querySelector('.hero .btn-primary');
    if (generateBtn) {
        generateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const generateSection = document.getElementById('generate');
            if (generateSection) {
                generateSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // View Sample BOQ button (hero section)
    const sampleBtn = document.querySelector('.hero .btn-secondary');
    if (sampleBtn) {
        sampleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('📄 Sample BOQ coming soon! You will be able to download a sample PDF.');
        });
    }

    // View Sample BOQ button (sample section)
    const sampleDownloadBtn = document.querySelector('.sample-actions .btn-secondary');
    if (sampleDownloadBtn) {
        sampleDownloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('📄 Sample BOQ PDF will be available soon! Check back later.');
        });
    }

    console.log('✅ All event listeners are set up.');
    console.log('📱 Camera upload feature is ready!');
});
