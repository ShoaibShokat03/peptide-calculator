class PeptideCalculator {
    constructor(target = "#peptide-calculator") {
        const root = document.querySelector(target);
        if (!root) {
            console.error(`Target element "${target}" not found.`);
            return;
        }
        root.innerHTML = ''; // Clear the target element
        const targetElement = this._elem("div", "peptide-calculator");
        root.appendChild(targetElement);
        this.target = targetElement;

        // Inject Styles
        this.injectStyle();

        // Initial Form Data
        this.formData = {
            scaleUnits: 30,
            waterUnit: "ml",
            waterValue: 5,
            peptides: [
                {
                    id: 1,
                    peptideQuantityUnit: "mg",
                    peptideQuantity: 5,
                    peptideDosageUnit: "mcg",
                    peptideDosageValue: 250,
                }
            ],
        };

        this.peptideIdCounter = 1;
        this._mainForm();
        this._render();
    }

    // --- SVG Methods ---
    _volumeSvg() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 22 23"><path fill="#FBFBFB" fill-rule="evenodd" d="M17.38.37l4.28 4.279A1.21 1.21 0 0119.95 6.36l-1.713 1.711 2.139 2.14a1.21 1.21 0 11-1.711 1.711l-.855-.855-6.846 6.846a3.631 3.631 0 01-5.134 0L2.051 21.69A1.21 1.21 0 01.34 19.979l3.777-3.777a3.63 3.63 0 010-5.135l6.846-6.847-.855-.855a1.21 1.21 0 111.71-1.711l2.14 2.138 1.712-1.711A1.211 1.211 0 1117.38.369zm-4.706 5.562l-1.71 1.712.855.855a1.21 1.21 0 11-1.712 1.712l-.855-.856-.856.856.856.856a1.21 1.21 0 11-1.711 1.71l-.856-.855-.856.856a1.21 1.21 0 000 1.712l1.712 1.712a1.21 1.21 0 001.71 0l6.847-6.847-3.424-3.423zm4.708-2.14L15.67 5.504l.855.856 1.713-1.711-.856-.857z" clip-rule="evenodd"></path></svg>`;
    }
    _peptideSvg() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="url(#pattern0_83_74)" d="M0 0H24V24H0z"></path><defs><pattern id="pattern0_83_74" width="1" height="1" patternContentUnits="objectBoundingBox"><use transform="matrix(.0098 0 0 .0098 -.132 0)" xlink:href="#image0_83_74"></use></pattern><image id="image0_83_74" width="126" height="102" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAABmCAYAAAANpiV+AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQcSURBVHgB7Z1BbhMxFIbfFPZwA0Yq+96AILGHBfuWE3TRA3SRAyDRPRLlBj0AQjkAEj1ApXAD2APhPeKRqjSZmSaN/fz+/5OsiWYmSjz/2H62n59FCCGEEBKRRpyzWCwmejjS9FTq4appmmtxjGvhVfT3ejiVOrlQ8c/EKQfiFBXdBK9VdOM05cElbku8PrQbPTyTuplrqX8uDvEs/G8JgAr/WBzitqon+4XCg0LhQXHZ/oxkKj44lwqp1rjzYjTV8j9XYVUPCoUHhcKD4qWdtIkYSzZS16bTBwPf+So+GPqfX9LHn5ps4mam7f5MClPUuEuCm1U8WXP5kcTgz5pzc01TfQE+SyGKCT9i5i2y8B3FZvCKtPGVT7c+JKfpWWQne4nXjJ7o4eOIWxFKfMdbLflXkpESwo+dbrXayL2H0AALTX9H3Jd9+jZrVZ+MubFz7Aupn7F5aNOzyUbuNv7oHvd2paXGF2Cb/36fZ7MzufvxQw6T1r+9kGWfNxqbuq0dWZ1JvU0gzHIbObnQqtxe6qzVeR8lh2wbqd9425bieS9R4hu5m/Gx1m/tuMl7iRK/7m1vBGPCyE3ec/9gXxUXvep3lXdOy4JC4UGh8KB468cfa3/3hcSkFUd4E76V+tfLbcKV4cqqHhQKDwqFB4XCg0LhQaHwoHjrzpmf+SeJybuUXOBN+LmHVSb7QAemXoojWNWDQuFByS38YuBaBJfqTbjKe4kSv87NKLroHW7yXsK4s0zasqLO6wRFdMNN3kta9UiCr1I87zTuQKHwoFB4UGoOcLg1aWXqsaZfmr6XDElSCjjhUzCiyco5C9ZgwQkiLtZcC1RVrwJvWrFq56BCs6C18Sc91yh8YPo8eGva7GhnaNWDQuFBofCghOrOqdVu7fQT2RL9/kYbQLt6PyQQIYRPgnf71O1ipN30/IYdLDDTNEJ/P0qJt7Cgx7J/7MWysGSvpHKqb+NvDb/mYpI7GOE+iGDclRCBwjugRHtbfRsfQfgSfvjVB2GsXvi0T/tU8jGN0LULYdWrEFM1uEwMM/LanluHom30CTqX5Y4SIUKuhhnAUUEu9XDZd8+IzQEPBQQO2YJC4UGh8KBQeFDQhL/e8lo40ITvs/o/CBBQwmt37f+06ppLZ2i+9XB+9Wmwx0S26VWbu79C8qfvgFxJo0LPZTkSBwutelAoPCgUHhQKDwqFB4XCg0LhQaHwoFB4UDxuPyYBsaHhN+KI3MIPeae2ms4Fk7lkJHdVHzIW/QOR9dlkFT5NjlD8u8xy++pn3/1Q23CbDv0m5DaHuYXPbtWnlS9nQjqKrMwptt9pCipohlzUvWSHMOePYp4/RTe6VfFbWYr/WnDCjZng5gJ2UdLzx80OxynYQOcOFRET2Zq5a0RXL0IIIYTk4R+Kygim5/y5lwAAAABJRU5ErkJggg=="></image></defs></svg>`;
    }
    _waterSvg() {
        return `<div class="d-flex mt-3 align-items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="26" height="26" fill="none" viewBox="0 0 26 26"><path fill="url(#pattern0_237_7571)" d="M0 0H26V26H0z"></path><defs><pattern id="pattern0_237_7571" width="1" height="1" patternContentUnits="objectBoundingBox"><use transform="scale(.02)" xlink:href="#image0_237_7571"></use></pattern><image id="image0_237_7571" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACzElEQVR4nO2ayWsUQRSHKyCaSK5JLipGRTwJCh5cIqIHowieNHgx4E1FxQUEE4O4Iep/4EEFD3oJZhRPIoIQ0XgQF9yDhyjCgGAkmoyaTyrzgs04k17mdVUP+kFg6K5+9fvSqeqqnhjzn3CARuA+0G8/m1oFuMYfeoE6U2sAB/mb/aaWANYAP4DxEhF7bLWpBYAm4KMEP1vmrnwCWkyWAeqAnAQeAKZTnluZHi/AAQn6FVgoxyqx12QRYAkwJiE7AscrMQosNlmC4p/QEwl4oeTcVDy215qsAJySYK+AmSXnwjhusgCwFCgAv4C2MufDsFPyMj/pBWAG8FwCnTdlIBpPbS3jC6BHgrwA6iu0iUq3e4NiwDnAiDy9107RLirfgFa3FsWAkw++yyHt4tDrzqAYrl06/gw0h7SNy0ZXEvXAO+l0V4T2cXnjZODbpYV0+BKYloKIZaeLuzE00RVsjnhNEj4ADWmK7JOO+qOuXknO7rQkGgL7jMiboypEhio9m7TuxoOY11XDnjQ2TK+l+BaHIm9VN2DAeik8GGWmUhSxrNMUuTpREroSXFstVzRXuMNSdJEHkWGVQW+XDFLwWcLrNWjXEDktxU54FDmpIXJHim3wKHJbQ+S9FJvtUWRQQ8Runkg64JRERjREJt9VNXoUGdUQyUuxBR5F8hoij6RYm0eRAQ2RS1LskEeRixoiO6TYXY8inRoiLfI20P40eRAphL3gSPLq55wHkT4VCQmzXIp+B2Y5FlmlJiKBbkrh63E2O1VK5FQlJFBrYDl/xIHIF2CuuoiE2iad/AS2pygyHvzWKy2Zo4HOjqUk0pWqRCBcd+A79BvAfCWRcWcSgYAdgTFjZ7Mz5YRijomtTiVKJoBcyW/0HnAY2ATMiyjRl9rAjgOwUsLYp3BUCjKVrzBZA2i26yK7yJP/fMjLfmZMPj+Uc51JljvmX+A3WIZSFjgLOY8AAAAASUVORK5CYII="></image></defs></svg><p class="Calc-text-1 m-0 text-break">Enter the Quantity of Bacteriostatic Water</p></div>`;
    }
    _plusSvg() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>`;
    }
    _minusSvg() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" /></svg>`;
    }

    // --- Style Injection ---
    injectStyle() {
        const css = `
      #peptide-calculator {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .peptide-calculator {
        max-width: 420px;
        width: auto;
        padding: 20px;
        background: linear-gradient(145deg, #2b3a90 0%, #0d1e70 100%);
        border: 1px solid #071149;
        border-radius: 12px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #fbfbfb;
      }
      .main-form { display: flex; flex-direction: column; gap: 20px; }
      .text-line { display: flex; gap: 8px; align-items: center; font-size: 0.9rem; }
      .text-line svg { width: 18px; height: 18px; }
      .input-box { width: 100%; display: flex; flex-direction: column; gap: 10px; }
      .input-group { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
      .input-group label { font-size: 1.2rem; font-weight: 600; }
      .input-group small { font-weight: 400; font-size: 0.8rem; opacity: 0.8; }
      .input-group select, .input-group input {
        padding: 10px;
        background: #071149;
        border: 1px solid #3a4a9a;
        color: white;
        font-size: 1.1rem;
        border-radius: 8px;
        text-align: center;
      }
      .input-group select { width: 100px; }
      .input-group input { width: 120px; }
      .input-with-unit { display: flex; align-items: center; gap: 0; }
      .input-with-unit input { border-top-right-radius: 0; border-bottom-right-radius: 0; }
      .input-with-unit select { border-top-left-radius: 0; border-bottom-left-radius: 0; border-left: none; width: 80px; }
      .peptides-container { display: flex; flex-direction: column; gap: 15px; }
      .peptide-item { background-color: rgba(7, 17, 73, 0.3); padding: 15px; border-radius: 8px; border: 1px solid #3a4a9a; }
      .peptide-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
      .peptide-header h3 { margin: 0; font-size: 1.1rem; color: #7186f0; }
      .peptide-controls { display: flex; gap: 10px; }
      .btn-icon { background: #071149; border: 1px solid #3a4a9a; border-radius: 6px; padding: 8px; cursor: pointer; color: white; transition: all 0.2s; }
      .btn-icon:hover { background: #3a4a9a; }
      .btn-add { background: #7186f0; }
      .btn-add:hover { background: #5a6ec7; }
      .btn-remove { background: #e74c3c; border-color: #c0392b; }
      .btn-remove:hover { background: #c0392b; }
      .peptide-inputs { display: flex; flex-direction: column; gap: 15px; }
      .results-container { margin-top: 25px; border-top: 1px solid #3a4a9a; padding-top: 20px; }
      .main-scale { width: 100%; max-width: 400px; font-family: inherit; }
      .formulate-header { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
      .formulate-header h4 { font-size: 1.5rem; margin: 0; }
      .formulate-header p { font-weight: bold; font-size: 1.5rem; margin: 0; }
      .formulate-scale { border: 1px solid #3a4a9a; width: 100%; max-width: 400px; height: 60px; background-color: #071149; position: relative; border-radius: 5px; }
      .formulate-value-bar-box { width: 100%; height: 100%; position: absolute; z-index: 1; overflow: hidden; border-radius: 5px; }
      .formulate-value-bar { height: 100%; background-color: #7186f0; transition: width 0.3s ease-in-out; }
      .formulate-bars { margin-left: -5px; width: 100%; height: 100%; display: flex; position: absolute; z-index: 2; padding: 0 1px; box-sizing: border-box; }
      .unit-box { height: 100%; display: flex; }
      .formulate-bar { width: calc(100% / 5); height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between; text-align: center; position: relative; }
      .bar-line-full { width: 2px; height: 45%; background-color: white; border-radius: 1px; }
      .bar-line-small { width: 1px; height: 20%; background-color: rgba(255,255,255,0.7); }
      .line-value { font-size: 0.8rem; font-weight: 500; color: white; margin-bottom: 4px; }
      .output-box { margin-top: 20px; }
      .output-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
      .output-list li { font-size: 1rem; color: white; background-color: rgba(7, 17, 73, 0.8); padding: 10px; border-radius: 6px; }
      .output-list li::before { content: '•'; color: #7186f0; font-weight: bold; display: inline-block; width: 1em; margin-left: -1em; }
    `;
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    }

    // --- Main Render Function ---
    _render() {
        this._formulate(this.formData);
    }

    // --- Add/Remove Peptides ---
    _addPeptide() {
        this.peptideIdCounter++;
        const newPeptide = {
            id: this.peptideIdCounter,
            peptideQuantityUnit: "mg",
            peptideQuantity: 0,
            peptideDosageUnit: "mcg",
            peptideDosageValue: 0,
        };
        this.formData.peptides.push(newPeptide);
        this._renderPeptides();
        this._render();
    }

    _removePeptide(peptideId) {
        if (this.formData.peptides.length > 1) {
            this.formData.peptides = this.formData.peptides.filter(p => p.id !== peptideId);
            this._renderPeptides();
            this._render();
        }
    }

    _updatePeptide(peptideId, field, value) {
        const peptide = this.formData.peptides.find(p => p.id === peptideId);
        if (peptide) {
            peptide[field] = value;
            this._render();
        }
    }

    // --- UI Building ---
    _mainForm() {
        const mainForm = this._elem("div", "main-form");
        this.target.appendChild(mainForm);

        // --- Volume Input ---
        const volumeBox = this._elem("div", "input-box");
        mainForm.appendChild(volumeBox);
        volumeBox.innerHTML = `
      <div class="text-line">${this._volumeSvg()}Select the Total Volume of your Syringe</div>
      <div class="input-group">
        <label>Volume</label>
      </div>
    `;
        const volumeSelect = this._elem("select");
        [30, 50, 100].forEach(val => {
            const opt = this._elem("option", null, `${val} units`);
            opt.value = val;
            if (val === this.formData.scaleUnits) opt.selected = true;
            volumeSelect.appendChild(opt);
        });
        volumeSelect.onchange = () => {
            this.formData.scaleUnits = parseFloat(volumeSelect.value);
            this._render();
        };
        volumeBox.querySelector('.input-group').appendChild(volumeSelect);

        // --- Peptides Container ---
        const peptidesContainer = this._elem("div", "peptides-container");
        mainForm.appendChild(peptidesContainer);
        this.peptidesContainer = peptidesContainer;

        this._renderPeptides();

        // --- Water Input ---
        const waterBox = this._elem("div", "input-box");
        mainForm.appendChild(waterBox);
        waterBox.innerHTML = `
      <div class="text-line">${this._waterSvg()}Enter the Quantity of Bacteriostatic Water</div>
      <div class="input-group">
        <label>Water</label>
      </div>
    `;
        const waterInputWithUnit = this._elem("div", "input-with-unit");
        const waterInput = this._elem("input");
        waterInput.type = "number";
        waterInput.min = "0";
        waterInput.step = "0.1";
        waterInput.value = this.formData.waterValue;
        waterInput.oninput = () => {
            const value = parseFloat(waterInput.value);
            if (!isNaN(value) && value >= 0) {
                this.formData.waterValue = value;
                this._render();
            }
        };
        const waterUnitSelect = this._elem("select");
        ["ml", "iu"].forEach(val => {
            const opt = this._elem("option", null, val);
            opt.value = val;
            if (val === this.formData.waterUnit) opt.selected = true;
            waterUnitSelect.appendChild(opt);
        });
        waterUnitSelect.onchange = () => {
            const previousUnit = this.formData.waterUnit;
            const newUnit = waterUnitSelect.value;
            let newValue = parseFloat(waterInput.value) || 0;

            if (previousUnit === 'ml' && newUnit === 'iu') {
                newValue = newValue * 100;
            } else if (previousUnit === 'iu' && newUnit === 'ml') {
                newValue = newValue / 100;
            }

            this.formData.waterUnit = newUnit;
            this.formData.waterValue = newValue;
            waterInput.value = newValue.toFixed(2);
            this._render();
        };
        waterInputWithUnit.append(waterInput, waterUnitSelect);
        waterBox.querySelector('.input-group').appendChild(waterInputWithUnit);
    }

    _renderPeptides() {
        this.peptidesContainer.innerHTML = '';

        this.formData.peptides.forEach((peptide, index) => {
            const peptideItem = this._elem("div", "peptide-item");

            // Header with title and controls
            const peptideHeader = this._elem("div", "peptide-header");
            const title = this._elem("h3", null, `Peptide ${index + 1}`);
            const controls = this._elem("div", "peptide-controls");

            // Add button (only show on last peptide)
            if (index === this.formData.peptides.length - 1) {
                const addBtn = this._elem("button", "btn-icon btn-add");
                addBtn.innerHTML = this._plusSvg();
                addBtn.onclick = (e) => {
                    e.preventDefault();
                    this._addPeptide();
                };
                controls.appendChild(addBtn);
            }

            // Remove button (only show if more than 1 peptide)
            if (this.formData.peptides.length > 1) {
                const removeBtn = this._elem("button", "btn-icon btn-remove");
                removeBtn.innerHTML = this._minusSvg();
                removeBtn.onclick = (e) => {
                    e.preventDefault();
                    this._removePeptide(peptide.id);
                };
                controls.appendChild(removeBtn);
            }

            peptideHeader.append(title, controls);
            peptideItem.appendChild(peptideHeader);

            // Peptide inputs container
            const peptideInputs = this._elem("div", "peptide-inputs");

            // Peptide Quantity Input
            const peptideQuantityBox = this._elem("div", "input-box");
            peptideQuantityBox.innerHTML = `
        <div class="text-line">${this._peptideSvg()}Enter the Quantity of Peptide</div>
        <div class="input-group">
          <label>In Vial</label>
        </div>
      `;
            const peptideInputWithUnit = this._elem("div", "input-with-unit");
            const peptideInput = this._elem("input");
            peptideInput.type = "number";
            peptideInput.min = "0";
            peptideInput.step = "0.1";
            peptideInput.value = peptide.peptideQuantity;
            peptideInput.oninput = () => {
                const value = parseFloat(peptideInput.value);
                if (!isNaN(value) && value >= 0) {
                    this._updatePeptide(peptide.id, 'peptideQuantity', value);
                }
            };
            const peptideUnit = this._elem("select");
            ["mg"].forEach(val => {
                const opt = this._elem("option", null, val);
                opt.value = val;
                if (val === peptide.peptideQuantityUnit) opt.selected = true;
                peptideUnit.appendChild(opt);
            });
            peptideUnit.onchange = () => {
                this._updatePeptide(peptide.id, 'peptideQuantityUnit', peptideUnit.value);
            };
            peptideInputWithUnit.append(peptideInput, peptideUnit);
            peptideQuantityBox.querySelector('.input-group').appendChild(peptideInputWithUnit);
            peptideInputs.appendChild(peptideQuantityBox);

            // Dose Input
            const doseBox = this._elem("div", "input-box");
            doseBox.innerHTML = `
        <div class="text-line">${this._volumeSvg()}Enter the Quantity of Peptide in each dose</div>
        <div class="input-group">
          <label>Per Dose</label>
        </div>
      `;
            const doseInputWithUnit = this._elem("div", "input-with-unit");
            const doseInput = this._elem("input");
            doseInput.type = "number";
            doseInput.min = "0";
            doseInput.step = peptide.peptideDosageUnit === "mcg" ? "1" : "0.001";
            doseInput.value = peptide.peptideDosageValue;
            doseInput.oninput = () => {
                const value = parseFloat(doseInput.value);
                if (!isNaN(value) && value >= 0) {
                    this._updatePeptide(peptide.id, 'peptideDosageValue', value);
                }
            };
            const doseUnitSelect = this._elem("select");
            ["mcg", "mg"].forEach(val => {
                const opt = this._elem("option", null, val);
                opt.value = val;
                if (val === peptide.peptideDosageUnit) opt.selected = true;
                doseUnitSelect.appendChild(opt);
            });

            doseUnitSelect.onchange = () => {
                const previousUnit = peptide.peptideDosageUnit;
                const newUnit = doseUnitSelect.value;
                let newValue = parseFloat(doseInput.value) || 0;

                if (previousUnit === 'mcg' && newUnit === 'mg') {
                    newValue = newValue / 1000;
                } else if (previousUnit === 'mg' && newUnit === 'mcg') {
                    newValue = newValue * 1000;
                }

                this._updatePeptide(peptide.id, 'peptideDosageUnit', newUnit);
                this._updatePeptide(peptide.id, 'peptideDosageValue', newValue);
                doseInput.value = newValue.toFixed(newUnit === 'mcg' ? 0 : 3);
                doseInput.step = newUnit === 'mcg' ? '1' : '0.001';
            };

            doseInputWithUnit.append(doseInput, doseUnitSelect);
            doseBox.querySelector('.input-group').appendChild(doseInputWithUnit);
            peptideInputs.appendChild(doseBox);

            peptideItem.appendChild(peptideInputs);
            this.peptidesContainer.appendChild(peptideItem);
        });
    }

    // --- CALCULATION & RESULTS ---
    _formulate(formData) {
        // --- 1. Convert water volume to milliliters (mL) ---
        let waterVolumeInML = parseFloat(formData.waterValue) || 0;
        if (formData.waterUnit === "iu") {
            waterVolumeInML = waterVolumeInML / 100;
        }

        // --- 2. Calculate total peptide and total desired dose ---
        let totalPeptideInMg = 0;
        let totalDesiredDoseInMg = 0;

        formData.peptides.forEach(peptide => {
            let peptideQuantity = parseFloat(peptide.peptideQuantity) || 0;
            let peptideDosageValue = parseFloat(peptide.peptideDosageValue) || 0;

            // Convert peptide quantity to mg (should already be in mg)
            totalPeptideInMg += peptideQuantity;

            // Convert desired dose to mg
            let peptidePerDoseInMg = peptideDosageValue;
            if (peptide.peptideDosageUnit === "mcg") {
                peptidePerDoseInMg = peptideDosageValue / 1000;
            }
            totalDesiredDoseInMg += peptidePerDoseInMg;
        });

        // --- 3. Perform Calculations ---
        let concentrationInMgPerML = 0;
        let totalDosesInVial = 0;
        let volumePerDoseInML = 0;
        let unitsToDraw = 0;

        if (waterVolumeInML > 0 && totalPeptideInMg > 0) {
            concentrationInMgPerML = totalPeptideInMg / waterVolumeInML;
        }

        if (concentrationInMgPerML > 0 && totalDesiredDoseInMg > 0) {
            totalDosesInVial = totalPeptideInMg / totalDesiredDoseInMg;
            volumePerDoseInML = totalDesiredDoseInMg / concentrationInMgPerML;
            unitsToDraw = volumePerDoseInML * 100;
        }

        // --- 4. Format results for safe display ---
        const formattedUnits = isFinite(unitsToDraw) && unitsToDraw >= 0 ? unitsToDraw.toFixed(0) : '0';
        const formattedConcentration = isFinite(concentrationInMgPerML) ? concentrationInMgPerML.toFixed(2) : '0.00';
        const formattedTotalDoses = isFinite(totalDosesInVial) && totalDosesInVial >= 0 ? Math.floor(totalDosesInVial) : '0';
        const formattedVolumePerDose = isFinite(volumePerDoseInML) && volumePerDoseInML >= 0 ? volumePerDoseInML.toFixed(2) : '0.00';

        // --- 5. Create dose summary for display ---
        let doseDescription = '';
        if (formData.peptides.length === 1) {
            const peptide = formData.peptides[0];
            doseDescription = `${parseFloat(peptide.peptideDosageValue).toFixed(peptide.peptideDosageUnit === 'mcg' ? 0 : 3)}${peptide.peptideDosageUnit}`;
        } else {
            doseDescription = formData.peptides
                .map(peptide => `${parseFloat(peptide.peptideDosageValue).toFixed(peptide.peptideDosageUnit === 'mcg' ? 0 : 3)}${peptide.peptideDosageUnit}`)
                .join(' + ');
        }

        // --- 6. Render Results UI ---
        let resultsContainer = document.querySelector(".results-container");
        if (!resultsContainer) {
            resultsContainer = this._elem("div", "results-container");
            this.target.appendChild(resultsContainer);
        }
        resultsContainer.innerHTML = '';

        const mainScale = this._elem("div", "main-scale");
        resultsContainer.appendChild(mainScale);

        // Header
        const formulateHeader = this._elem("div", "formulate-header");
        formulateHeader.innerHTML = `<h4>Formulate</h4><p>${formattedUnits} units</p>`;
        mainScale.appendChild(formulateHeader);

        // Scale visual
        const scale = this._elem("div", "formulate-scale");
        mainScale.appendChild(scale);

        const barFillPercent = isFinite(unitsToDraw) && unitsToDraw >= 0 ? Math.min((unitsToDraw / formData.scaleUnits) * 100, 100) : 0;
        scale.innerHTML = `
      <div class="formulate-value-bar-box">
        <div class="formulate-value-bar" style="width:${barFillPercent}%"></div>
      </div>
    `;

        // Scale markings
        let scaleDivide = 6;
        let valueGap = 5;
        if (formData.scaleUnits === 50) {
            scaleDivide = 10;
            valueGap = 5;
        } else if (formData.scaleUnits === 100) {
            scaleDivide = 10;
            valueGap = 10;
        }

        const formulateBars = this._elem("div", "formulate-bars");
        scale.appendChild(formulateBars);
        let showVal = 0;
        for (let i = 0; i < scaleDivide; i++) {
            const unitBox = this._elem("div", "unit-box");
            unitBox.style.width = `${100 / scaleDivide}%`;
            formulateBars.appendChild(unitBox);
            for (let j = 0; j < 5; j++) {
                const formulateBar = this._elem("div", "formulate-bar");
                const barLine = this._elem("div", `${j === 0 ? "bar-line-full" : "bar-line-small"}`);
                formulateBar.appendChild(barLine);
                if (j === 0) {
                    const barValue = this._elem("div", "line-value", showVal);
                    formulateBar.appendChild(barValue);
                    showVal += valueGap;
                }
                unitBox.appendChild(formulateBar);
            }
        }
        const unitBox = this._elem("div", "unit-box");
        unitBox.style.width = `fit-content`;
        unitBox.style.position = `absolute`;
        unitBox.style.right = `-20px`;
        formulateBars.appendChild(unitBox);
        const formulateBar = this._elem("div", "formulate-bar");
        const barLine = this._elem("div", "bar-line-full");
        formulateBar.appendChild(barLine);
        const barValue = this._elem("div", "line-value", showVal);
        formulateBar.appendChild(barValue);
        unitBox.appendChild(formulateBar);

        // Output instructions
        const outputBox = this._elem("div", "output-box");
        mainScale.appendChild(outputBox);
        const ul = this._elem("ul", "output-list");
        outputBox.appendChild(ul);

        ul.innerHTML = `
      <li>Draw <strong>${formattedUnits} units</strong> for a <strong>${doseDescription}</strong> dose.</li>
      <li>With a concentration of <strong>${formattedConcentration} mg/mL</strong>, each vial contains <strong>${formattedTotalDoses} doses</strong>.</li>
      <li>Each dose is <strong>${formattedVolumePerDose} mL</strong>.</li>
    `;
    }

    // --- Helper to create elements ---
    _elem(tag, cls, inner) {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        if (inner !== undefined) el.innerHTML = inner;
        return el;
    }
}

// Instantiate the class on an element with the ID "peptide-calculator"
new PeptideCalculator("#peptide-calculator");