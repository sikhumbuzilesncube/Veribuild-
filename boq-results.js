// ========================================
// VERIBUILD - BOQ RESULTS
// Bulawayo, Zimbabwe
// ========================================

console.log('📊 VeriBuild BOQ Results loaded!');

// ========================================
// SUPABASE CONFIGURATION
// ========================================
const SUPABASE_URL = 'https://gfggbagrkdacuepqnkdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZ2diYWdya2RhY3VlcHFua2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4ODY3NTYsImV4cCI6MjEwMjQ2Mjc1Nn0.2OHTD7-vCE2sZ-NwQWqUSNWmHcPt_KRkYfG12Uz1rxE';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Sample BOQ Data (will be replaced with real data from Supabase) ---
const boqData = {
    planType: 'Residential',
    floorArea: 120,
    numRooms: 4,
    brickType: 'Stock Brick',
    wallThickness: '230mm',
    roofType: 'Zinc',
    quantities: {
        bricks: { qty: 7800, unit: 'units' },
        cementMortar: { qty: 70, unit: 'bags' },
        pitSand: { qty: 12, unit: 'tonnes' },
        riverSand: { qty: 6, unit: 'tonnes' },
        plasterCement: { qty: 36, unit: 'bags' },
        roofSheets: { qty: 36, unit: 'sheets' },
        screedCement: { qty: 18, unit: 'bags' },
        screedSand: { qty: 2.4, unit: 'tonnes' },
        internalPaint: { qty: 48, unit: 'liters' },
        externalPaint: { qty: 36, unit: 'liters' },
        rebar: { qty: 144, unit: 'kg' },
        lintels: { qty: 18, unit: 'meters' }
    },
    // Hardware prices will be fetched from Supabase
    hardwarePrices: {},
    // Recommended workers
    workers: [
        { name: 'Ncube Mason', trade: 'Bricklayer', suburb: 'Kelvin North', phone: '0772 123 456', rating: 4.8 },
        { name: 'Dube Plumbing', trade: 'Plumber', suburb: 'Hillside', phone: '0773 789 012', rating: 4.6 },
        { name: 'Mpofu Electrical', trade: 'Electrician', suburb: 'Suburbs', phone: '0712 345 678', rating: 4.9 },
        { name: 'Ndlovu Painters', trade: 'Painter', suburb: 'Pumula', phone: '0789 012 345', rating: 4.5 },
        { name: 'Moyo Tiling', trade: 'Tiler', suburb: 'Nkulumane', phone: '0774 567 890', rating: 4.7 }
    ],
    totalCost: 0
};

// ========================================
// 1. POPULATE MATERIAL QUANTITIES TABLE
// ========================================
function populateQuantities() {
    const tbody = document.getElementById('materialQuantities');
    const q = boqData.quantities;
    
    const materials = [
        { name: 'Bricks (Stock)', qty: q.bricks.qty, unit: q.bricks.unit },
        { name: 'Cement (Mortar)', qty: q.cementMortar.qty, unit: q.cementMortar.unit },
        { name: 'Pit Sand', qty: q.pitSand.qty, unit: q.pitSand.unit },
        { name: 'River Sand (Plaster)', qty: q.riverSand.qty, unit: q.riverSand.unit },
        { name: 'Cement (Plaster)', qty: q.plasterCement.qty, unit: q.plasterCement.unit },
        { name: 'Zinc Sheets', qty: q.roofSheets.qty, unit: q.roofSheets.unit },
        { name: 'Cement (Screed)', qty: q.screedCement.qty, unit: q.screedCement.unit },
        { name: 'Sand (Screed)', qty: q.screedSand.qty, unit: q.screedSand.unit },
        { name: 'Paint (Internal)', qty: q.internalPaint.qty, unit: q.internalPaint.unit },
        { name: 'Paint (External)', qty: q.externalPaint.qty, unit: q.externalPaint.unit },
        { name: 'Rebar (10mm)', qty: q.rebar.qty, unit: q.rebar.unit },
        { name: 'Steel Lintels', qty: q.lintels.qty, unit: q.lintels.unit }
    ];
    
    materials.forEach(m => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${m.name}</strong></td>
            <td>${m.qty.toLocaleString()}</td>
            <td>${m.unit}</td>
        `;
        tbody.appendChild(row);
    });
}

// ========================================
// 2. POPULATE COST BREAKDOWN
// ========================================
function populateCostBreakdown() {
    const tbody = document.getElementById('costBreakdown');
    const q = boqData.quantities;
    const p = boqData.hardwarePrices;
    let total = 0;
    
    // If no hardware prices fetched, use default fallback
    const defaultPrices = {
        bricks: 0.08,
        cementMortar: 9.50,
        pitSand: 75,
        riverSand: 70,
        plasterCement: 9.50,
        roofSheets: 15,
        screedCement: 9.50,
        screedSand: 70,
        internalPaint: 8,
        externalPaint: 8,
        rebar: 1.10,
        lintels: 25
    };
    
    const items = [
        { name: 'Bricks (Stock)', qty: q.bricks.qty, unit: q.bricks.unit, price: p.bricks?.price || defaultPrices.bricks, supplier: p.bricks?.supplier || 'Unknown' },
        { name: 'Cement (Mortar)', qty: q.cementMortar.qty, unit: q.cementMortar.unit, price: p.cementMortar?.price || defaultPrices.cementMortar, supplier: p.cementMortar?.supplier || 'Unknown' },
        { name: 'Pit Sand', qty: q.pitSand.qty, unit: q.pitSand.unit, price: p.pitSand?.price || defaultPrices.pitSand, supplier: p.pitSand?.supplier || 'Unknown' },
        { name: 'River Sand', qty: q.riverSand.qty, unit: q.riverSand.unit, price: p.riverSand?.price || defaultPrices.riverSand, supplier: p.riverSand?.supplier || 'Unknown' },
        { name: 'Cement (Plaster)', qty: q.plasterCement.qty, unit: q.plasterCement.unit, price: p.plasterCement?.price || defaultPrices.plasterCement, supplier: p.plasterCement?.supplier || 'Unknown' },
        { name: 'Zinc Sheets', qty: q.roofSheets.qty, unit: q.roofSheets.unit, price: p.roofSheets?.price || defaultPrices.roofSheets, supplier: p.roofSheets?.supplier || 'Unknown' },
        { name: 'Cement (Screed)', qty: q.screedCement.qty, unit: q.screedCement.unit, price: p.screedCement?.price || defaultPrices.screedCement, supplier: p.screedCement?.supplier || 'Unknown' },
        { name: 'Sand (Screed)', qty: q.screedSand.qty, unit: q.screedSand.unit, price: p.screedSand?.price || defaultPrices.screedSand, supplier: p.screedSand?.supplier || 'Unknown' },
        { name: 'Paint (Internal)', qty: q.internalPaint.qty, unit: q.internalPaint.unit, price: p.internalPaint?.price || defaultPrices.internalPaint, supplier: p.internalPaint?.supplier || 'Unknown' },
        { name: 'Paint (External)', qty: q.externalPaint.qty, unit: q.externalPaint.unit, price: p.externalPaint?.price || defaultPrices.externalPaint, supplier: p.externalPaint?.supplier || 'Unknown' },
        { name: 'Rebar (10mm)', qty: q.rebar.qty, unit: q.rebar.unit, price: p.rebar?.price || defaultPrices.rebar, supplier: p.rebar?.supplier || 'Unknown' },
        { name: 'Steel Lintels', qty: q.lintels.qty, unit: q.lintels.unit, price: p.lintels?.price || defaultPrices.lintels, supplier: p.lintels?.supplier || 'Unknown' }
    ];
    
    items.forEach(item => {
        const lineTotal = item.qty * item.price;
        total += lineTotal;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.qty.toLocaleString()} ${item.unit}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><strong>$${lineTotal.toFixed(2)}</strong></td>
            <td>${item.supplier}</td>
        `;
        tbody.appendChild(row);
    });
    
    boqData.totalCost = total;
    document.getElementById('totalCost').textContent = `$${total.toFixed(2)}`;
}

// ========================================
// 3. POPULATE HARDWARE LIST (From Supabase)
// ========================================
async function populateHardwareList() {
    const container = document.getElementById('hardwareList');
    container.innerHTML = '<p>⏳ Loading hardware shops...</p>';
    
    try {
        const { data, error } = await supabase
            .from('hardware_products')
            .select('product_name, price_usd, hardware_id, users(phone, full_name)')
            .eq('stock_status', 'in_stock')
            .order('price_usd', { ascending: true });
        
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p>🛒 No hardware shops registered yet. Check back soon!</p>';
            return;
        }
        
        // Group by supplier and find cheapest per product
        const suppliers = {};
        data.forEach(item => {
            const supplierName = item.users?.full_name || 'Unknown';
            if (!suppliers[supplierName]) {
                suppliers[supplierName] = {
                    name: supplierName,
                    phone: item.users?.phone || 'N/A',
                    products: []
                };
            }
            suppliers[supplierName].products.push({
                name: item.product_name,
                price: item.price_usd
            });
        });
        
        // Also populate hardwarePrices for cost breakdown
        const prices = {};
        data.forEach(item => {
            const productKey = item.product_name.toLowerCase().replace(/\s/g, '');
            if (!prices[productKey] || item.price_usd < prices[productKey].price) {
                prices[productKey] = {
                    price: item.price_usd,
                    supplier: item.users?.full_name || 'Unknown'
                };
            }
        });
        boqData.hardwarePrices = prices;
        
        // Build HTML
        let html = '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px; margin-top:10px;">';
        Object.keys(suppliers).forEach(name => {
            const s = suppliers[name];
            const topProducts = s.products.slice(0, 3).map(p => `${p.name} ($${p.price.toFixed(2)})`).join(', ');
            html += `
                <div style="background:#f8f9fa; padding:15px; border-radius:8px; text-align:center; border:1px solid #e9ecef;">
                    <strong style="font-size:16px;">${name}</strong>
                    <p style="font-size:12px; color:#6c757d; margin:5px 0;">📞 ${s.phone}</p>
                    <p style="font-size:12px; color:#495057;">${s.products.length} products listed</p>
                    <p style="font-size:11px; color:#6c757d; margin-top:5px;">Top: ${topProducts}</p>
                    <a href="tel:${s.phone}" class="btn-outline" style="font-size:12px; padding:4px 12px; margin-top:5px; display:inline-block;">📞 Call Shop</a>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
        
        // Re-populate cost breakdown with fetched prices
        document.getElementById('costBreakdown').innerHTML = '';
        populateCostBreakdown();
        
    } catch (error) {
        console.error('Error fetching hardware:', error);
        container.innerHTML = '<p>⚠️ Error loading hardware shops. Please refresh.</p>';
    }
}

// ========================================
// 4. POPULATE WORKER LIST
// ========================================
function populateWorkerList() {
    const container = document.getElementById('workerList');
    const workers = boqData.workers;
    
    let html = '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px; margin-top:10px;">';
    workers.forEach(w => {
        const stars = '⭐'.repeat(Math.round(w.rating));
        html += `
            <div style="background:#f8f9fa; padding:15px; border-radius:8px; text-align:center;">
                <strong>${w.name}</strong>
                <p style="font-size:14px; color:#495057;">${w.trade}</p>
                <p style="font-size:12px; color:#6c757d;">📍 ${w.suburb}</p>
                <p style="font-size:14px; color:#f0c040;">${stars}</p>
                <a href="tel:${w.phone}" class="btn-outline" style="font-size:12px; padding:4px 12px;">📞 Call</a>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// ========================================
// 5. GENERATE QR CODE
// ========================================
function generateQRCode() {
    const container = document.getElementById('qrCodeContainer');
    const url = window.location.href;
    
    container.innerHTML = '';
    
    const qr = new QRCode(container, {
        text: url,
        width: 128,
        height: 128,
        colorDark: '#1a1a2e',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
    
    const label = document.createElement('p');
    label.textContent = 'Scan to view this BOQ online';
    label.style.fontSize = '12px';
    label.style.color = '#6c757d';
    label.style.marginTop = '8px';
    container.appendChild(label);
}

// ========================================
// 6. GENERATE PDF (jsPDF)
// ========================================
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const q = boqData.quantities;
    const p = boqData.hardwarePrices;
    let y = 20;
    
    // Default fallback prices
    const defaultPrices = {
        bricks: 0.08,
        cementMortar: 9.50,
        pitSand: 75,
        riverSand: 70,
        plasterCement: 9.50,
        roofSheets: 15,
        screedCement: 9.50,
        screedSand: 70,
        internalPaint: 8,
        externalPaint: 8,
        rebar: 1.10,
        lintels: 25
    };
    
    // --- Cover Page ---
    doc.setFontSize(24);
    doc.setTextColor('#1a1a2e');
    doc.text('VeriBuild', 105, y, { align: 'center' });
    y += 10;
    
    doc.setFontSize(14);
    doc.setTextColor('#6c757d');
    doc.text('Verified Building Solutions', 105, y, { align: 'center' });
    y += 20;
    
    doc.setFontSize(18);
    doc.setTextColor('#007bff');
    doc.text('BILL OF QUANTITIES', 105, y, { align: 'center' });
    y += 15;
    
    doc.setFontSize(12);
    doc.setTextColor('#333');
    doc.text(`Prepared for: VeriBuild User`, 20, y);
    y += 8;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, y);
    y += 8;
    doc.text(`Plan Type: ${boqData.planType}`, 20, y);
    y += 8;
    doc.text(`Floor Area: ${boqData.floorArea} m²`, 20, y);
    y += 8;
    doc.text(`Rooms: ${boqData.numRooms}`, 20, y);
    y += 20;
    
    // --- Material Quantities ---
    doc.setFontSize(16);
    doc.setTextColor('#1a1a2e');
    doc.text('1. MATERIAL QUANTITIES', 20, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.text('Material', 20, y);
    doc.text('Qty', 140, y);
    doc.text('Unit', 180, y);
    y += 6;
    doc.line(20, y, 190, y);
    y += 4;
    
    const materials = [
        ['Bricks (Stock)', q.bricks.qty, q.bricks.unit],
        ['Cement (Mortar)', q.cementMortar.qty, q.cementMortar.unit],
        ['Pit Sand', q.pitSand.qty, q.pitSand.unit],
        ['River Sand (Plaster)', q.riverSand.qty, q.riverSand.unit],
        ['Cement (Plaster)', q.plasterCement.qty, q.plasterCement.unit],
        ['Zinc Sheets', q.roofSheets.qty, q.roofSheets.unit],
        ['Cement (Screed)', q.screedCement.qty, q.screedCement.unit],
        ['Sand (Screed)', q.screedSand.qty, q.screedSand.unit],
        ['Paint (Internal)', q.internalPaint.qty, q.internalPaint.unit],
        ['Paint (External)', q.externalPaint.qty, q.externalPaint.unit],
        ['Rebar (10mm)', q.rebar.qty, q.rebar.unit],
        ['Steel Lintels', q.lintels.qty, q.lintels.unit]
    ];
    
    materials.forEach(m => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        doc.text(m[0], 20, y);
        doc.text(String(m[1]), 140, y);
        doc.text(m[2], 180, y);
        y += 6;
    });
    
    y += 10;
    
    // --- Cost Breakdown ---
    if (y > 270) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(16);
    doc.setTextColor('#1a1a2e');
    doc.text('2. COST BREAKDOWN', 20, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.text('Material', 20, y);
    doc.text('Qty', 80, y);
    doc.text('Unit Price', 120, y);
    doc.text('Total', 160, y);
    y += 6;
    doc.line(20, y, 190, y);
    y += 4;
    
    let total = 0;
    const costItems = [
        ['Bricks', q.bricks.qty, p.bricks?.price || defaultPrices.bricks],
        ['Cement (Mortar)', q.cementMortar.qty, p.cementMortar?.price || defaultPrices.cementMortar],
        ['Pit Sand', q.pitSand.qty, p.pitSand?.price || defaultPrices.pitSand],
        ['River Sand', q.riverSand.qty, p.riverSand?.price || defaultPrices.riverSand],
        ['Cement (Plaster)', q.plasterCement.qty, p.plasterCement?.price || defaultPrices.plasterCement],
        ['Zinc Sheets', q.roofSheets.qty, p.roofSheets?.price || defaultPrices.roofSheets],
        ['Cement (Screed)', q.screedCement.qty, p.screedCement?.price || defaultPrices.screedCement],
        ['Sand (Screed)', q.screedSand.qty, p.screedSand?.price || defaultPrices.screedSand],
        ['Paint (Internal)', q.internalPaint.qty, p.internalPaint?.price || defaultPrices.internalPaint],
        ['Paint (External)', q.externalPaint.qty, p.externalPaint?.price || defaultPrices.externalPaint],
        ['Rebar', q.rebar.qty, p.rebar?.price || defaultPrices.rebar],
        ['Lintels', q.lintels.qty, p.lintels?.price || defaultPrices.lintels]
    ];
    
    costItems.forEach(item => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        const lineTotal = item[1] * item[2];
        total += lineTotal;
        doc.text(item[0], 20, y);
        doc.text(String(item[1]), 80, y);
        doc.text(`$${item[2].toFixed(2)}`, 120, y);
        doc.text(`$${lineTotal.toFixed(2)}`, 160, y);
        y += 6;
    });
    
    y += 6;
    doc.line(20, y, 190, y);
    y += 4;
    doc.setFontSize(12);
    doc.text(`TOTAL MATERIAL COST: $${total.toFixed(2)}`, 20, y);
    y += 15;
    
    // --- Footer ---
    doc.setFontSize(10);
    doc.setTextColor('#6c757d');
    doc.text('Generated by VeriBuild - Verified Building Solutions', 105, 285, { align: 'center' });
    doc.text('Bulawayo, Zimbabwe | www.veribuild.co.zw', 105, 290, { align: 'center' });
    
    doc.save('veribuild-boq.pdf');
}

// ========================================
// 7. SHARE VIA WHATSAPP
// ========================================
function shareViaWhatsApp() {
    const url = window.location.href;
    const message = `📊 My VeriBuild BOQ\n\nTotal Material Cost: $${boqData.totalCost.toFixed(2)}\nFloor Area: ${boqData.floorArea} m²\nRooms: ${boqData.numRooms}\n\nView my full BOQ here: ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ========================================
// 8. INITIALIZE PAGE
// ========================================
async function init() {
    // Populate project summary
    document.getElementById('planType').textContent = boqData.planType;
    document.getElementById('floorArea').textContent = `${boqData.floorArea} m²`;
    document.getElementById('numRooms').textContent = boqData.numRooms;
    document.getElementById('brickType').textContent = boqData.brickType;
    document.getElementById('wallThickness').textContent = boqData.wallThickness;
    document.getElementById('roofType').textContent = boqData.roofType;
    
    populateQuantities();
    await populateHardwareList(); // Fetches from Supabase
    populateWorkerList();
    generateQRCode();
    
    // Event listeners
    document.getElementById('downloadPdfBtn').addEventListener('click', generatePDF);
    document.getElementById('shareBtn').addEventListener('click', shareViaWhatsApp);
    document.getElementById('newBoqBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    console.log('✅ BOQ Results page loaded successfully with Supabase!');
}

// Run when page loads
document.addEventListener('DOMContentLoaded', init);
