// Switch between tabs
function switchTab(event, tabId) {
    const tabs = document.querySelectorAll('.tabs .tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tabContent => tabContent.classList.remove('active'));
    document.getElementById(tabId + '-tab').classList.add('active');
}

// Handle file input change
function handleFileChange(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('filePreview');
    const resultElement = document.getElementById('file-result');

    if (file) {
        preview.innerHTML = '';
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            preview.appendChild(img);
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.controls = true;
            preview.appendChild(video);
        }
        scanQRCode(file, resultElement);
    }
}

// Scan QR code from file or live stream
async function scanQRCode(source, resultElement) {
    if ('BarcodeDetector' in window) {
        const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (source instanceof File) {
            const img = new Image();
            img.src = URL.createObjectURL(source);
            img.onload = async () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const barcodes = await barcodeDetector.detect(canvas);
                console.log(barcodes, resultElement)
                displayOutput(barcodes, resultElement);
            };
        } else {
            const video = document.getElementById('video');
            const scan = async () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const barcodes = await barcodeDetector.detect(canvas);
                displayOutput(barcodes, resultElement);
                requestAnimationFrame(scan);  // Continue scanning
            };
            scan();
        }
    } else {
        console.error('Barcode Detector is not supported by this browser.');
        resultElement.textContent = 'Barcode Detector is not supported by this browser.';
    }
}

// Display the output
function displayOutput(barcodes, resultElement) {
    let output = resultElement.cloneNode(true);

    output.textContent = '';
    
    if (barcodes.length === 0) {
        output.textContent = 'No QR code detected';
    }

    barcodes.forEach((barcode, index) => {
        let rem = document.createElement('div');
        
        rem.textContent = `QR Code ${index + 1}: ${barcode.rawValue}`
        output.append(rem);
        output.append(document.createElement('br'));
    });

    if (resultElement.innerHTML != output.innerHTML) resultElement.innerHTML = output.innerHTML;
}

// Start camera and initiate scanning
async function startCamera() {
    const video = document.getElementById('video');
    const resultElement = document.getElementById('live-result');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
            scanQRCode(video, resultElement);
        });
    } catch (err) {
        console.error('Error accessing the camera:', err);
        resultElement.textContent = 'Error accessing the camera.';
    }
}

const overlay = document.querySelector('.overlay');
console.log(overlay)
overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
    startCamera()
});