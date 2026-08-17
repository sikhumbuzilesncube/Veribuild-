// ========================================
// VERIBUILD - BOQ RESULTS
// Bulawayo, Zimbabwe
// ========================================

console.log('📊 VeriBuild BOQ Results loaded!');

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
    // Hardware prices (from registered shops)
    hardwarePrices: {
        bricks: { price: 0.08, supplier: 'City Hardware', phone: '0772 123 456' },
        cementMortar: { price: 9.50, supplier: 'Ncube Hardware', phone: '0773 789 012' },
        pitSand: { price: 75, supplier: 'Build-it', phone: '0712 345 678' },
        riverSand: { price: 70, supplier: 'Build-it', phone: '0712 345 678' },
        plasterCement: { price: 9.50, supplier: 'Ncube Hardware', phone: '0773 789 012' },
        roofSheets: { price: 15, supplier: 'Delta Supplies', phone: '0789 012 345' },
        screedCement: { price: 9.50, supplier: 'Ncube Hardware', phone: '0773 789 012' },
        screedSand: { price: 70, supplier: 'Build-it', phone: '0712 345 678' },
        internalPaint: { price: 8, supplier: 'Paints & More', phone: '0774 567 890' },
        externalPaint: { price: 8, supplier: 'Paints & More', phone: '0774 567 890' },
        rebar: { price: 1.10, supplier: 'City Hardware', phone: '0772 123 456' },
        lintels: { price: 25, supplier: 'Ncube Hardware', phone: '0773 789 012' }
    },
    // Recommended workers
    workers: [
        { name: 'Ncube Mason', trade: 'Bricklayer', suburb: 'Kelvin North', phone: '0772 123 456', rating: 4.8 },
        { name: 'Dube Plumbing', trade: 'Plumber', suburb: 'Hillside', phone: '0773 789 012', rating: 4.6 },
        { name: 'Mpofu Electrical', trade: 'Electrician', suburb: 'Suburbs', phone: '0712 345 678', rating: 4.9 },
        { name: 'Ndlovu Painters', trade: 'Painter', suburb: 'Pumula', phone: '0789 012 345', rating: 4.5 },
        { name: 'Moyo Tiling', trade: 'Tiler', suburb: 'Nkulumane', phone: '0774 567 890', rating: 4.7 }
    ],
    // Total cost (calculated)
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
    
    const items = [
        { name: 'Bricks (Stock)', qty: q.bricks.qty, unit: q.bricks.unit, price: p.bricks.price, supplier: p.bricks.supplier },
        { name: 'Cement (Mortar)', qty: q.cementMortar.qty, unit: q.cementMortar.unit, price: p.cementMortar.price, supplier: p.cementMortar.supplier },
        { name: 'Pit Sand', qty: q.pitSand.qty, unit: q.pitSand.unit, price: p.pitSand.price, supplier: p.pitSand.supplier },
        { name: 'River Sand', qty: q.riverSand.qty, unit: q.riverSand.unit, price: p.riverSand.price, supplier: p.riverSand.supplier },
        { name: 'Cement (Plaster)', qty: q.plasterCement.qty, unit: q.plasterCement.unit, price: p.plasterCement.price, supplier: p.plasterCement.supplier },
        { name: 'Zinc Sheets', qty: q.roofSheets.qty, unit: q.roofSheets.unit, price: p.roofSheets.price, supplier: p.roofSheets.supplier },
        { name: 'Cement (Screed)', qty: q.screedCement.qty, unit: q.screedCement.unit, price: p.screedCement.price, supplier: p.screedCement.supplier },
        { name: 'Sand (Screed)', qty: q.screedSand.qty, unit: q.screedSand.unit, price: p.screedSand.price, supplier: p.screedSand.supplier },
        { name: 'Paint (Internal)', qty: q.internalPaint.qty, unit: q.internalPaint.unit, price: p.internalPaint.price, supplier: p.internalPaint.supplier },
        { name: 'Paint (External)', qty: q.externalPaint.qty, unit: q.externalPaint.unit, price: p.externalPaint.price, supplier: p.externalPaint.supplier },
        { name: 'Rebar (10mm)', qty: q.rebar.qty, unit: q.rebar.unit, price: p.rebar.price, supplier: p.rebar.supplier },
        { name: 'Steel Lintels', qty: q.lintels.qty, unit: q.lintels.unit, price: p.lintels.price, supplier: p.lintels.supplier }
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
// 3. POPULATE HARDWARE LIST
// ========================================
function populateHardwareList() {
    const container = document.getElementById('hardwareList');
    const p = boqData.hardwarePrices;
    
    // Get unique suppliers
    const suppliers = {};
    Object.values(p).forEach(item => {
        if (!suppliers[item.supplier]) {
            suppliers[item.supplier] = {
                name: item.supplier,
                phone: item.phone,
                products: []
            };
        }
        // We'll just show the supplier names for now
    });
    
    let html = '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px; margin-top:10px;">';
    Object.keys(suppliers).forEach(name => {
        html += `
            <div style="background:#f8f9fa; padding:15px; border-radius:8px; text-align:center;">
                <strong>${name}</strong>
                <p style="font-size:14px; color:#6c757d;">📞 ${suppliers[name].phone}</p>
                <a href="tel:${suppliers[name].phone}" class="btn-outline" style="font-size:12px; padding:4px 12px;">Call Shop</a>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
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
    
    // Clear container
    container.innerHTML = '';
    
    // Create QR code
    const qr = new QRCode(container, {
        text: url,
        width: 128,
        height: 128,
        colorDark: '#1a1a2e',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Add label
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
    doc.text(`Prepared for: User`, 20, y);
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
        ['Bricks', q.bricks.qty, p.bricks.price],
        ['Cement (Mortar)', q.cementMortar.qty, p.cementMortar.price],
        ['Pit Sand', q.pitSand.qty, p.pitSand.price],
        ['River Sand', q.riverSand.qty, p.riverSand.price],
        ['Cement (Plaster)', q.plasterCement.qty, p.plasterCement.price],
        ['Zinc Sheets', q.roofSheets.qty, p.roofSheets.price],
        ['Cement (Screed)', q.screedCement.qty, p.screedCement.price],
        ['Sand (Screed)', q.screedSand.qty, p.screedSand.price],
        ['Paint (Internal)', q.internalPaint.qty, p.internalPaint.price],
        ['Paint (External)', q.externalPaint.qty, p.externalPaint.price],
        ['Rebar', q.rebar.qty, p.rebar.price],
        ['Lintels', q.lintels.qty, p.lintels.price]
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
    
    // --- Save PDF ---
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
function init() {
    // Populate project summary
    document.getElementById('planType').textContent = boqData.planType;
    document.getElementById('floorArea').textContent = `${boqData.floorArea} m²`;
    document.getElementById('numRooms').textContent = boqData.numRooms;
    document.getElementById('brickType').textContent = boqData.brickType;
    document.getElementById('wallThickness').textContent = boqData.wallThickness;
    document.getElementById('roofType').textContent = boqData.roofType;
    
    populateQuantities();
    populateCostBreakdown();
    populateHardwareList();
    populateWorkerList();
    generateQRCode();
    
    // Event listeners
    document.getElementById('downloadPdfBtn').addEventListener('click', generatePDF);
    document.getElementById('shareBtn').addEventListener('click', shareViaWhatsApp);
    document.getElementById('newBoqBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    console.log('✅ BOQ Results page loaded successfully!');
}

// Run when page loads
document.addEventListener('DOMContentLoaded', init);
