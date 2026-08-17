// ========================================
// VERIBUILD - MAIN JAVASCRIPT
// Bulawayo, Zimbabwe
// ========================================

console.log('🚀 VeriBuild platform loaded successfully!');

// --- Global Variables ---
let capturedPhotos = [];
let stream = null;
let photoCount = 0;
let generatedOTP = '';
let otpTimer = null;
let otpExpiryTime = 0;
let pendingBOQAction = null;

// --- Wait for the page to load ---
document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // 1. DOM REFERENCES
    // ========================================
    const uploadPdfBtn = document.getElementById('uploadPdfBtn');
    const pdfFileInput = document.getElementById('pdfFileInput');
    const fileDisplay = document.getElementById('fileDisplay');
    const fileName = document.getElementById('fileName');
    const takePhotoBtn = document.getElementById('takePhotoBtn');
    const cameraOverlay = document.getElementById('cameraOverlay');
    const video = document.getElementById('video');
    const capturePhotoBtn = document.getElementById('capturePhotoBtn');
    const cancelCameraBtn = document.getElementById('cancelCameraBtn');
    const photoPreview = document.getElementById('photoPreview');
    const photoCountSpan = document.getElementById('photoCount');
    const photoCountOverlay = document.getElementById('photoCountOverlay');
    const photoThumbnails = document.getElementById('photoThumbnails');
    const generateFromPhotosBtn = document.getElementById('generateFromPhotosBtn');
    const clearPhotosBtn = document.getElementById('clearPhotosBtn');
    const addMorePhotosBtn = document.getElementById('addMorePhotosBtn');
    const generateFromPdfBtn = document.getElementById('generateFromPdfBtn');

    // ========================================
    // 2. PDF UPLOAD
    // ========================================
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
                if (cameraOverlay) cameraOverlay.style.display = 'none';
                alert('✅ PDF uploaded: ' + file.name);
            }
        });
    }

    // ========================================
    // 3. TAKE PHOTO (Open Full-Screen Camera)
    // ========================================
    if (takePhotoBtn) {
        takePhotoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            fileDisplay.style.display = 'none';
            cameraOverlay.style.display = 'flex';
            startCamera();
        });
    }

    // ========================================
    // 4. START CAMERA (Full-Screen)
    // ========================================
    async function startCamera() {
        try {
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
        } catch (err) {
            alert('❌ Camera access denied. Please allow camera permissions or use the PDF upload option.');
            console.error('Camera error:', err);
            cameraOverlay.style.display = 'none';
        }
    }

    // ========================================
    // 5. CAPTURE PHOTO
    // ========================================
    if (capturePhotoBtn) {
        capturePhotoBtn.addEventListener('click', function() {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 1920;
            canvas.height = video.videoHeight || 1080;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = canvas.toDataURL('image/jpeg', 0.9);
            capturedPhotos.push(imageData);
            photoCount++;
            photoCountSpan.textContent = photoCount;
            if (photoCountOverlay) photoCountOverlay.textContent = photoCount;
            
            // Show preview
            photoPreview.style.display = 'block';
            
            // Add thumbnail
            const img = new Image();
            img.src = imageData;
            img.style.width = '80px';
            img.style.height = '80px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            img.style.border = '2px solid #28a745';
            img.style.margin = '5px';
            photoThumbnails.appendChild(img);
            
            // Keep camera open for more photos
            alert('✅ Photo ' + photoCount + ' captured! Tap "Take Photo" again for more, or "Generate BOQ from Photos" when done.');
        });
    }

    // ========================================
    // 6. CANCEL CAMERA
    // ========================================
    if (cancelCameraBtn) {
        cancelCameraBtn.addEventListener('click', function() {
            stopCamera();
            cameraOverlay.style.display = 'none';
        });
    }

    // ========================================
    // 7. STOP CAMERA
    // ========================================
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        video.srcObject = null;
        video.style.display = 'none';
    }

    // ========================================
    // 8. ADD MORE PHOTOS
    // ========================================
    if (addMorePhotosBtn) {
        addMorePhotosBtn.addEventListener('click', function() {
            cameraOverlay.style.display = 'flex';
            startCamera();
        });
    }

    // ========================================
    // 9. GENERATE FROM PHOTOS
    // ========================================
    if (generateFromPhotosBtn) {
        generateFromPhotosBtn.addEventListener('click', function() {
            if (capturedPhotos.length === 0) {
                alert('❌ Please take at least one photo first.');
                return;
            }
            checkLoginBeforeGeneration(function() {
                alert('📄 Generating BOQ from ' + capturedPhotos.length + ' photos...\n\n' +
                      '✅ Your photos will be converted to a PDF and processed.\n' +
                      '🔜 BOQ generation is coming soon!');
                console.log('📸 Captured photos:', capturedPhotos.length);
            });
        });
    }

    // ========================================
    // 10. GENERATE FROM PDF
    // ========================================
    if (generateFromPdfBtn) {
        generateFromPdfBtn.addEventListener('click', function() {
            const fileInput = document.getElementById('pdfFileInput');
            if (!fileInput.files || fileInput.files.length === 0) {
                alert('❌ Please upload a PDF first.');
                return;
            }
            checkLoginBeforeGeneration(function() {
                alert('📄 Processing PDF: ' + fileInput.files[0].name + '\n\n' +
                      '🔜 BOQ generation is coming soon!');
            });
        });
    }

    // ========================================
    // 11. CLEAR PHOTOS
    // ========================================
    if (clearPhotosBtn) {
        clearPhotosBtn.addEventListener('click', function() {
            capturedPhotos = [];
            photoCount = 0;
            photoCountSpan.textContent = '0';
            if (photoCountOverlay) photoCountOverlay.textContent = '0';
            photoPreview.style.display = 'none';
            photoThumbnails.innerHTML = '';
            alert('🗑️ All photos cleared.');
        });
    }

    // ========================================
    // 12. SIGN-UP POPUP CONTROLS
    // ========================================
    const signupPopup = document.getElementById('signupPopup');
    const signupPhone = document.getElementById('signupPhone');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const otpSection = document.getElementById('otpSection');
    const otpInput = document.getElementById('otpInput');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const closeSignupBtn = document.getElementById('closeSignupBtn');

    function openSignupPopup() {
        signupPopup.style.display = 'flex';
        signupPhone.focus();
    }

    function closeSignupPopup() {
        signupPopup.style.display = 'none';
        otpSection.style.display = 'none';
        signupPhone.value = '';
        otpInput.value = '';
        if (otpTimer) clearInterval(otpTimer);
    }

    function generateOTP() {
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    function sendOTPviaWhatsApp(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        const internationalPhone = `263${cleanPhone.slice(-9)}`;
        generatedOTP = generateOTP();
        otpExpiryTime = Date.now() + 300000;
        
        console.log(`📱 WhatsApp OTP for ${internationalPhone}: ${generatedOTP}`);
        alert(`📱 WhatsApp message sent to ${internationalPhone}\n\nYour verification code is: ${generatedOTP}\n\n(We'll replace this with real WhatsApp API in the next step)`);
        
        if (otpTimer) clearInterval(otpTimer);
        otpTimer = setInterval(() => {
            const remaining = Math.floor((otpExpiryTime - Date.now()) / 1000);
            const otpStatus = document.getElementById('otpStatus');
            if (otpStatus) {
                if (remaining > 0) {
                    otpStatus.textContent = `⏳ Code expires in ${remaining} seconds`;
                } else {
                    otpStatus.textContent = '❌ Code expired. Request a new one.';
                    clearInterval(otpTimer);
                }
            }
        }, 1000);
        
        return true;
    }

    function verifyOTP(userInput) {
        if (Date.now() > otpExpiryTime) {
            alert('❌ Verification code has expired. Please request a new one.');
            return false;
        }
        if (userInput === generatedOTP) {
            alert('✅ Verification successful! Welcome to VeriBuild.');
            return true;
        } else {
            alert('❌ Invalid verification code. Please try again.');
            return false;
        }
    }

    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', function() {
            const phone = signupPhone.value.trim();
            if (!phone || phone.length < 10) {
                alert('❌ Please enter a valid phone number (e.g., 0772 123 456)');
                return;
            }
            sendOTPviaWhatsApp(phone);
            otpSection.style.display = 'block';
            sendOtpBtn.textContent = '📲 Resend Code';
        });
    }

    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener('click', function() {
            const userOTP = otpInput.value.trim();
            if (!userOTP || userOTP.length !== 6) {
                alert('❌ Please enter the 6-digit verification code.');
                return;
            }
            if (verifyOTP(userOTP)) {
                closeSignupPopup();
                if (pendingBOQAction) {
                    pendingBOQAction();
                    pendingBOQAction = null;
                }
            }
        });
    }

    if (closeSignupBtn) {
        closeSignupBtn.addEventListener('click', closeSignupPopup);
    }

    if (signupPopup) {
        signupPopup.addEventListener('click', function(e) {
            if (e.target === signupPopup) {
                closeSignupPopup();
            }
        });
    }

    // ========================================
    // 13. CHECK LOGIN BEFORE GENERATION
    // ========================================
    function checkLoginBeforeGeneration(action) {
        const isLoggedIn = false; // Phase 2: check Supabase auth
        if (isLoggedIn) {
            action();
        } else {
            pendingBOQAction = action;
            openSignupPopup();
        }
    }

    // ========================================
    // 14. EXISTING BUTTON HANDLERS
    // ========================================
    const signInBtn = document.getElementById('signInBtn');
    if (signInBtn) {
        signInBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openSignupPopup();
        });
    }

    const signupNavBtn = document.querySelector('nav .btn-primary');
    if (signupNavBtn) {
        signupNavBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('generate').scrollIntoView({ behavior: 'smooth' });
        });
    }

    const generateHeroBtn = document.querySelector('.hero .btn-primary');
    if (generateHeroBtn) {
        generateHeroBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('generate').scrollIntoView({ behavior: 'smooth' });
        });
    }

    const sampleBtn = document.querySelector('.hero .btn-secondary');
    if (sampleBtn) {
        sampleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('sample').scrollIntoView({ behavior: 'smooth' });
        });
    }

    const downloadSampleBtn = document.getElementById('downloadSampleBtn');
    if (downloadSampleBtn) {
        downloadSampleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('📄 Sample BOQ PDF will be available soon! Check back later.');
        });
    }

    console.log('✅ All event listeners are set up.');
    console.log('📱 Full-screen camera feature is ready!');
});
