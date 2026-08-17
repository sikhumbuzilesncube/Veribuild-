// ========================================
// VERIBUILD - MAIN JAVASCRIPT
// Bulawayo, Zimbabwe
// ========================================

console.log('🚀 VeriBuild platform loaded successfully!');

// ========================================
// SUPABASE CONFIGURATION
// ========================================
const SUPABASE_URL = 'https://gfggbagrkdacuepqnkdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZ2diYWdya2RhY3VlcHFua2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4ODY3NTYsImV4cCI6MjEwMjQ2Mjc1Nn0.2OHTD7-vCE2sZ-NwQWqUSNWmHcPt_KRkYfG12Uz1rxE';

// Initialize Supabase client (will be available globally)
let supabaseClient;

// Wait for Supabase to load
function initSupabase() {
    if (typeof window.supabase !== 'undefined') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase client initialized!');
        return true;
    } else {
        console.log('⏳ Waiting for Supabase to load...');
        return false;
    }
}

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

    // Initialize Supabase
    const maxAttempts = 10;
    let attempts = 0;
    const interval = setInterval(() => {
        attempts++;
        if (initSupabase()) {
            clearInterval(interval);
        } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            console.warn('⚠️ Supabase could not be loaded. Please refresh.');
        }
    }, 500);

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
            
            photoPreview.style.display = 'block';
            
            const img = new Image();
            img.src = imageData;
            img.style.width = '80px';
            img.style.height = '80px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            img.style.border = '2px solid #28a745';
            img.style.margin = '5px';
            photoThumbnails.appendChild(img);
            
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
                alert('📄 Generating BOQ from ' + capturedPhotos.length + ' photos...');
                window.location.href = 'boq-results.html';
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
                alert('📄 Processing PDF: ' + fileInput.files[0].name);
                window.location.href = 'boq-results.html';
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

    // ========================================
    // 13. VERIFY OTP (WITH SUPABASE)
    // ========================================
    function verifyOTP(userInput) {
        if (Date.now() > otpExpiryTime) {
            alert('❌ Verification code has expired. Please request a new one.');
            return false;
        }
        
        if (userInput === generatedOTP) {
            const phone = document.getElementById('signupPhone').value.trim();
            const cleanPhone = phone.replace(/\D/g, '');
            const internationalPhone = `+263${cleanPhone.slice(-9)}`;
            
            // Show loading
            verifyOtpBtn.textContent = '⏳ Saving...';
            verifyOtpBtn.disabled = true;
            
            // Check if Supabase is ready
            if (!supabaseClient) {
                alert('⚠️ System is initializing. Please try again in a moment.');
                verifyOtpBtn.textContent = '✅ Verify Code';
                verifyOtpBtn.disabled = false;
                return false;
            }
            
            // Check if user already exists
            supabaseClient
                .from('users')
                .select('phone')
                .eq('phone', internationalPhone)
                .then(({ data, error }) => {
                    if (error) {
                        console.error('Error checking user:', error);
                        alert('⚠️ There was an issue. Please try again.');
                        verifyOtpBtn.textContent = '✅ Verify Code';
                        verifyOtpBtn.disabled = false;
                        return;
                    }
                    
                    if (data && data.length > 0) {
                        // User exists - log them in
                        alert('✅ Welcome back! You are now signed in.');
                        closeSignupPopup();
                        if (pendingBOQAction) {
                            pendingBOQAction();
                            pendingBOQAction = null;
                        }
                        verifyOtpBtn.textContent = '✅ Verify Code';
                        verifyOtpBtn.disabled = false;
                    } else {
                        // New user - create account
                        const userData = {
                            phone: internationalPhone,
                            full_name: 'VeriBuild User',
                            suburb: 'Bulawayo',
                            role: 'client',
                            is_verified: true
                        };
                        
                        supabaseClient
                            .from('users')
                            .insert([userData])
                            .then(({ data, error }) => {
                                verifyOtpBtn.textContent = '✅ Verify Code';
                                verifyOtpBtn.disabled = false;
                                
                                if (error) {
                                    console.error('Error saving user:', error);
                                    alert('⚠️ There was an issue creating your account. Please try again.');
                                } else {
                                    alert('✅ Verification successful! Welcome to VeriBuild.');
                                    closeSignupPopup();
                                    if (pendingBOQAction) {
                                        pendingBOQAction();
                                        pendingBOQAction = null;
                                    }
                                }
                            });
                    }
                });
            
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
            verifyOTP(userOTP);
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
    // 14. CHECK LOGIN BEFORE GENERATION
    // ========================================
    function checkLoginBeforeGeneration(action) {
        // For now, always show sign-up popup (Phase 3: check Supabase session)
        const isLoggedIn = false;
        if (isLoggedIn) {
            action();
        } else {
            pendingBOQAction = action;
            openSignupPopup();
        }
    }

    // ========================================
    // 15. EXISTING BUTTON HANDLERS
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
