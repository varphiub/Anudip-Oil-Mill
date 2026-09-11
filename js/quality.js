/**
 * Anudip Oil Mill - Quality Page Interactivity (quality.js)
 * Interactive Certificate of Analysis (COA) batch viewer and FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
    initCoaViewer();
    initFaqAccordion();
});

/**
 * Interactive Certificate of Analysis (COA) Data & Controller
 */
function initCoaViewer() {
    const tabs = document.querySelectorAll('.coa-tab');
    const titleEl = document.getElementById('coa-product-title');
    const metaEl = document.getElementById('coa-batch-meta');
    const tableBody = document.getElementById('coa-table-body');

    if (!tabs.length || !tableBody) return;

    const coaData = {
        groundnut: {
            title: 'Cold-Pressed Groundnut Oil (Mara Chekku)',
            meta: 'Batch Ref: ANU-GN-2026-04 | Press Date: 08-Sep-2026 | Testing Cell: Anudip Purity Lab',
            tests: [
                { param: 'Free Fatty Acids (as Oleic Acid / Acid Value)', standard: 'Max 1.50 mg KOH/g', result: '0.68 mg KOH/g', status: 'PASS' },
                { param: 'Peroxide Value (PV)', standard: 'Max 5.0 meq O₂/kg', result: '1.12 meq O₂/kg', status: 'PASS' },
                { param: 'Moisture & Insoluble Impurities', standard: 'Max 0.10 % by wt', result: '0.04 % by wt', status: 'PASS' },
                { param: 'Test for Argemone Oil', standard: 'Must be Negative', result: 'Negative (100% Absent)', status: 'PASS' },
                { param: 'Test for Mineral Oil / Hydrocarbons', standard: 'Must be Absent', result: 'Absent', status: 'PASS' },
                { param: 'Synthetic Antioxidants (TBHQ / BHA)', standard: 'Must be Absent', result: 'Absent (Zero Additives)', status: 'PASS' },
                { param: 'Extraction Temperature Log', standard: '< 45.0 °C', result: '38.6 °C (Peak)', status: 'PASS' },
                { param: 'Natural Vitamin E (Tocopherols)', standard: 'Min 180 mg/kg', result: '242 mg/kg', status: 'PASS' }
            ]
        },
        coconut: {
            title: 'Virgin Cold-Pressed Coconut Oil',
            meta: 'Batch Ref: ANU-CN-2026-08 | Press Date: 09-Sep-2026 | Testing Cell: Anudip Purity Lab',
            tests: [
                { param: 'Free Fatty Acids (as Lauric Acid)', standard: 'Max 0.50 % by wt', result: '0.18 % by wt', status: 'PASS' },
                { param: 'Peroxide Value (PV)', standard: 'Max 3.0 meq O₂/kg', result: '0.45 meq O₂/kg', status: 'PASS' },
                { param: 'Moisture & Volatile Matter', standard: 'Max 0.10 % by wt', result: '0.03 % by wt', status: 'PASS' },
                { param: 'Test for Sulfur / Bleaching Agents', standard: 'Must be Negative', result: 'Negative (Unbleached)', status: 'PASS' },
                { param: 'Test for Mineral Oil / Paraffins', standard: 'Must be Absent', result: 'Absent', status: 'PASS' },
                { param: 'Lauric Acid (C12:0) Concentration', standard: '45.0 – 53.0 %', result: '49.8 % (High Vitality)', status: 'PASS' },
                { param: 'Extraction Temperature Log', standard: '< 45.0 °C', result: '36.2 °C (Peak)', status: 'PASS' },
                { param: 'Solidification Point', standard: '23.0 – 25.0 °C', result: '24.1 °C (Crystalline Butter)', status: 'PASS' }
            ]
        },
        sesame: {
            title: 'Gingelly Black Sesame Oil (Palm Jaggery Blended)',
            meta: 'Batch Ref: ANU-SM-2026-12 | Press Date: 07-Sep-2026 | Testing Cell: Anudip Purity Lab',
            tests: [
                { param: 'Free Fatty Acids (as Oleic Acid)', standard: 'Max 1.50 mg KOH/g', result: '0.74 mg KOH/g', status: 'PASS' },
                { param: 'Peroxide Value (PV)', standard: 'Max 5.0 meq O₂/kg', result: '0.95 meq O₂/kg', status: 'PASS' },
                { param: 'Baudouin Test (Sesame Purity Marker)', standard: 'Positive (Crimson Red)', result: 'Positive (100% Authentic)', status: 'PASS' },
                { param: 'Test for Argemone / Castor Oil', standard: 'Must be Negative', result: 'Negative (100% Absent)', status: 'PASS' },
                { param: 'Mineral Oil / Synthetic Dyes', standard: 'Must be Absent', result: 'Absent', status: 'PASS' },
                { param: 'Sesamol & Sesamin Antioxidant Assay', standard: 'Min 0.50 %', result: '0.86 % (High Purity)', status: 'PASS' },
                { param: 'Extraction Temperature Log', standard: '< 45.0 °C', result: '39.1 °C (Peak)', status: 'PASS' },
                { param: 'Organic Palm Jaggery Purity Test', standard: 'Zero Chemicals / Dyes', result: '100% Natural Organic', status: 'PASS' }
            ]
        },
        sunflower: {
            title: 'Single-Origin Cold-Pressed Sunflower Oil',
            meta: 'Batch Ref: ANU-SF-2026-02 | Press Date: 06-Sep-2026 | Testing Cell: Anudip Purity Lab',
            tests: [
                { param: 'Free Fatty Acids (as Oleic Acid)', standard: 'Max 1.00 mg KOH/g', result: '0.52 mg KOH/g', status: 'PASS' },
                { param: 'Peroxide Value (PV)', standard: 'Max 4.0 meq O₂/kg', result: '1.05 meq O₂/kg', status: 'PASS' },
                { param: 'Non-GMO DNA Screening', standard: '100% Non-GMO', result: 'Certified Non-GMO Harvest', status: 'PASS' },
                { param: 'Hexane / Solvent Residue', standard: 'Zero / Nil', result: 'Nil (0.00 ppm)', status: 'PASS' },
                { param: 'Synthetic Preservatives (TBHQ / BHT)', standard: 'Must be Absent', result: 'Absent', status: 'PASS' },
                { param: 'Natural Alpha-Tocopherol (Vitamin E)', standard: 'Min 400 mg/kg', result: '485 mg/kg', status: 'PASS' },
                { param: 'Extraction Temperature Log', standard: '< 45.0 °C', result: '37.8 °C (Peak)', status: 'PASS' },
                { param: 'Clarity & Sedimentation Test', standard: 'Clear Golden Liquid', result: 'Natural Cotton Filtered', status: 'PASS' }
            ]
        }
    };

    function renderCoa(oilKey) {
        const data = coaData[oilKey] || coaData.groundnut;

        if (titleEl) titleEl.textContent = data.title;
        if (metaEl) metaEl.textContent = data.meta;

        let rowsHtml = '';
        data.tests.forEach((t) => {
            rowsHtml += `
                <tr>
                    <td><strong>${t.param}</strong></td>
                    <td class="cell-std">${t.standard}</td>
                    <td class="cell-res">${t.result}</td>
                    <td>
                        <span class="coa-pass-tag">
                            <span class="material-symbols-outlined" style="font-size: 14px;">check_circle</span>
                            <span>${t.status}</span>
                        </span>
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = rowsHtml;
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
            const oilKey = tab.getAttribute('data-oil');
            renderCoa(oilKey);
        });
    });

    // Initial render
    renderCoa('groundnut');
}

/**
 * FAQ Accordion Controller
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach((f) => f.classList.remove('active'));

            // If not active, open clicked
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}
