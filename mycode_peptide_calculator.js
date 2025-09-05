class PeptideCalculator {
    constructor(target = "#peptide-calculator") {

        const root = document.querySelector(target);
        const targetElement = this._elem("div", "peptide-calculator");
        root.appendChild(targetElement);

        if (targetElement) {
            this.target = targetElement;
        }
        else {
            this.target = document.body;
        }

        // Inject Styles
        this.injectStyle();

        // Initial Formulate
        this.formData = {
            volumeUnits: 25,
            scaleUnits: 30,
            waterUnit: "ml",
            waterValue: 5,
            peptideQuanityUnit: "mg",
            peptidesQuantitie: 5,
            peptidesDosageUnit: "mcg",
            peptidesDosageValue: 250,
        }

        this._mainForm();

        this.isFormulate = false;
        // Draw Formulate
        this._formulate(this.formData);

    }

    _volumeSvg() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 22 23"><path fill="#FBFBFB" fill-rule="evenodd" d="M17.38.37l4.28 4.279A1.21 1.21 0 0119.95 6.36l-1.713 1.711 2.139 2.14a1.21 1.21 0 11-1.711 1.711l-.855-.855-6.846 6.846a3.631 3.631 0 01-5.134 0L2.051 21.69A1.21 1.21 0 01.34 19.979l3.777-3.777a3.63 3.63 0 010-5.135l6.846-6.847-.855-.855a1.21 1.21 0 111.71-1.711l2.14 2.138 1.712-1.711A1.211 1.211 0 1117.38.369zm-4.706 5.562l-1.71 1.712.855.855a1.21 1.21 0 11-1.712 1.712l-.855-.856-.856.856.856.856a1.21 1.21 0 11-1.711 1.71l-.856-.855-.856.856a1.21 1.21 0 000 1.712l1.712 1.712a1.21 1.21 0 001.71 0l6.847-6.847-3.424-3.423zm4.708-2.14L15.67 5.504l.855.856 1.713-1.711-.856-.857z" clip-rule="evenodd"></path></svg>`;
    }

    _peptideSvg() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="url(#pattern0_83_74)" d="M0 0H24V24H0z"></path><defs><pattern id="pattern0_83_74" width="1" height="1" patternContentUnits="objectBoundingBox"><use transform="matrix(.0098 0 0 .0098 -.132 0)" xlink:href="#image0_83_74"></use></pattern><image id="image0_83_74" width="126" height="102" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAABmCAYAAAANpiV+AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQcSURBVHgB7Z1BbhMxFIbfFPZwA0Yq+96AILGHBfuWE3TRA3SRAyDRPRLlBj0AQjkAEj1ApXAD2APhPeKRqjSZmSaN/fz+/5OsiWYmSjz/2H62n59FCCGEEBKRRpyzWCwmejjS9FTq4appmmtxjGvhVfT3ejiVOrlQ8c/EKQfiFBXdBK9VdOM05cElbku8PrQbPTyTuplrqX8uDvEs/G8JgAr/WBzitqon+4XCg0LhQXHZ/oxkKj44lwqp1rjzYjTV8j9XYVUPCoUHhcKD4qWdtIkYSzZS16bTBwPf+So+GPqfX9LHn5ps4mam7f5MClPUuEuCm1U8WXP5kcTgz5pzc01TfQE+SyGKCT9i5i2y8B3FZvCKtPGVT7c+JKfpWWQne4nXjJ7o4eOIWxFKfMdbLflXkpESwo+dbrXayL2H0AALTX9H3Jd9+jZrVZ+MubFz7Aupn7F5aNOzyUbuNv7oHvd2paXGF2Cb/36fZ7MzufvxQw6T1r+9kGWfNxqbuq0dWZ1JvU0gzHIbObnQqtxe6qzVeR8lh2wbqd9425bieS9R4hu5m/Gx1m/tuMl7iRK/7m1vBGPCyE3ec/9gXxUXvep3lXdOy4JC4UGh8KB468cfa3/3hcSkFUd4E76V+tfLbcKV4cqqHhQKDwqFB4XCg0LhQaHwoHjrzpmf+SeJybuUXOBN+LmHVSb7QAemXoojWNWDQuFByS38YuBaBJfqTbjKe4kSv87NKLroHW7yXsK4s0zasqLO6wRFdMNN3kta9UiCr1I87zTuQKHwoFB4UGoOcLg1aWXqsaZfmr6XDElSCjjhUzCiyco5C9ZgwQkiLtZcC1RVrwJvWrFq56BCs6C18Sc91yh8YPo8eGva7GhnaNWDQuFBofCghOrOqdVu7fQT2RL9/kYbQLt6PyQQIYRPgnf71O1ipN30/IYdLDDTNEJ/P0qJt7Cgx7J/7MWysGSvpHKqb+NvDb/mYpI7GOE+iGDclRCBwjugRHtbfRsfQfgSfvjVB2GsXvi0T/tU8jGN0LULYdWrEFM1uEwMM/LanluHom30CTqX5Y4SIUKuhhnAUUEu9XDZd8+IzQEPBQQO2YJC4UGh8KBQeFDQhL/e8lo40ITvs/o/CBBQwmt37f+06ppLZ2i+9XB+9Wmwx0S26VWbu79C8qfvgFxJo0LPZTkSBwutelAoPCgUHhQKDwqFB4XCg0LhQaHwoFB4UDxuPyYBsaHhN+KI3MIPeae2ms4Fk7lkJHdVHzIW/QOR9dlkFT5NjlD8u8xy++pn3/1Q23CbDv0m5DaHuYXPbtWnlS9nQjqKrMwptt9pCipohlzUvWSHMOePYp4/RTe6VfFbWYr/WnDCjZng5gJ2UdLzx80OxynYQOcOFRET2Zq5a0RXL0IIIYTk4R+Kygim5/y5lwAAAABJRU5ErkJggg=="></image></defs></svg>`;
    }

    _waterSvg() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="26" height="26" fill="none" viewBox="0 0 26 26"><path fill="url(#pattern0_237_7571)" d="M0 0H26V26H0z"></path><defs><pattern id="pattern0_237_7571" width="1" height="1" patternContentUnits="objectBoundingBox"><use transform="scale(.02)" xlink:href="#image0_237_7571"></use></pattern><image id="image0_237_7571" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACzElEQVR4nO2ayWsUQRSHKyCaSK5JLipGRTwJCh5cIqIHowieNHgx4E1FxQUEE4O4Iep/4EEFD3oJZhRPIoIQ0XgQF9yDhyjCgGAkmoyaTyrzgs04k17mdVUP+kFg6K5+9fvSqeqqnhjzn3CARuA+0G8/m1oFuMYfeoE6U2sAB/mb/aaWANYAP4DxEhF7bLWpBYAm4KMEP1vmrnwCWkyWAeqAnAQeAKZTnluZHi/AAQn6FVgoxyqx12QRYAkwJiE7AscrMQosNlmC4p/QEwl4oeTcVDy215qsAJySYK+AmSXnwjhusgCwFCgAv4C2MufDsFPyMj/pBWAG8FwCnTdlIBpPbS3jC6BHgrwA6iu0iUq3e4NiwDnAiDy9107RLirfgFa3FsWAkw++yyHt4tDrzqAYrl06/gw0h7SNy0ZXEvXAO+l0V4T2cXnjZODbpYV0+BKYloKIZaeLuzE00RVsjnhNEj4ADWmK7JOO+qOuXknO7rQkGgL7jMiboypEhio9m7TuxoOY11XDnjQ2TK+l+BaHIm9VN2DAeik8GGWmUhSxrNMUuTpREroSXFstVzRXuMNSdJEHkWGVQW+XDFLwWcLrNWjXEDktxU54FDmpIXJHim3wKHJbQ+S9FJvtUWRQQ8Runkg64JRERjREJt9VNXoUGdUQyUuxBR5F8hoij6RYm0eRAQ2RS1LskEeRixoiO6TYXY8inRoiLfI20P40eRAphL3gSPLq55wHkT4VCQmzXIp+B2Y5FlmlJiKBbkrh63E2O1VK5FQlJFBrYDl/xIHIF2CuuoiE2iad/AS2pygyHvzWKy2Zo4HOjqUk0pWqRCBcd+A79BvAfCWRcWcSgYAdgTFjZ7Mz5YRijomtTiVKJoBcyW/0HnAY2ATMiyjRl9rAjgOwUsLYp3BUCjKVrzBZA2i26yK7yJP/fMjLfmZMPj+Uc51JljvmX+A3WIZSFjgLOY8AAAAASUVORK5CYII="></image></defs></svg>`;
    }

    injectStyle() {
        const css = `      .peptide-calculator {
        max-width: 420px;
        width: auto;
        padding: 20px;
        background: linear-gradient(90deg, #0c1b6e 0%, #7186f0 100%);
        border: 1px solid #071149;
        border-radius: 10px;
        font-family: Calibri;
      }
      .main-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      .text-line {
        display: flex;
        gap: 5px;
        align-items: center;
        font-size: 0.9rem;
        color: white;
      }
      .text-line svg {
        width: 16px;
        color: white;
      }
      .input-box {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .input-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
      }
      .input-group select {
        width: 80px;
        padding: 8px;
        background: #071149;
        border: 1px solid #071149;
        color: white;
        font-size: 1.1rem;
        border-radius: 8px;
        padding-right: 10px;
      }
      .input-group label {
        font-size: 1.2rem;
        font-weight: 800;
        color: white;
      }
      .input-with-unit {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .input-group input {
        width: 100px;
        padding: 8px;
        background: #071149;
        border: 1px solid #071149;
        color: white;
        font-size: 1.1rem;
        border-radius: 8px;
      }
      .calculate-button {
        width: 100%;
        padding: 10px;
        background: #071149;
        border: 1px solid #071149;
        color: white;
        font-size: 1.1rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
      }
      .main-scale {
        width: 100%;
        max-width: 400px;
        font-family: Calibri;
      }
      .formulate-scale {
        width: 100%;
        max-width: 400px;
        height: 80px;
        background-color: #071149;
        border: 1px solid #071149;
        padding: 1px;
      }
      .formulate-bars {
        width: 100%;
        max-width: 396px;
        height: 100%;
        display: flex;
        gap: 1px;
        height: 80px;
        position: absolute;
        z-index: 2;
      }
      .unit-box {
        width: calc(100% / 6);
        height: 100%;
        display: flex;
        /* background-color: blue; */
        gap: 1px;
      }
      .formulate-bar {
        width: calc(100% / 5);
        height: 100%;
        display: flex;
        flex-direction: column;
        text-align: center;
        margin-left: 0px;
        /* background-color: red; */
        justify-content: space-between;
      }
      .bar-line-full {
        width: 1px;
        height: 60%;
        background-color: white;
      }
      .bar-line-half {
        width: 1px;
        height: 30%;
        background-color: white;
      }
      .bar-line-small {
        width: 1px;
        height: 15%;
        background-color: white;
      }
      .line-value {
        font-size: 0.8rem;
        font-weight: bold;
        text-align: center;
        color: white;
      }
      .formulate-value-bar-box {
        width: 100%;
        max-width: 396px;
        height: 80px;
        position: absolute;
        z-index: 1;
      }
      .formulate-value-bar {
        width: calc(100% / 6);
        height: 100%;
        background-color: rgba(255, 255, 255, 0.603);
      }
      .formulate-header h4 {
        font-size: 1.5rem;
        color: white;
      }
      .formulate-header p {
        font-weight: bold;
        font-size: 1.5rem;
        color: white;
      }
      .output-box {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .output-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .output-list li {
        width: 100%;
        font-size: large;
        font-weight: bold;
        color: white;
      }`;
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    }


    _mainForm() {
        const mainForm = this._elem("div", "main-form");
        this.target.appendChild(mainForm);

        // Volume Input
        const InputBox = this._elem("div", "input-box");
        mainForm.appendChild(InputBox);
        const volumeTextLine = this._elem("div", "text-line");
        InputBox.appendChild(volumeTextLine);
        volumeTextLine.innerHTML = this._volumeSvg() + "Select the Total Volume of your Syringe";
        const inputGroup = this._elem("div", "input-group");
        InputBox.appendChild(inputGroup);
        const inputLabel = this._elem("label", "input-label");
        inputGroup.appendChild(inputLabel);
        inputLabel.textContent = "Volume";
        const selectBox = this._elem("div", "select-box");
        inputGroup.appendChild(selectBox);
        const select = this._elem("select", "volume-select");
        selectBox.appendChild(select);
        const options = [30, 50, 100];
        options.forEach(option => {
            const optionElement = this._elem("option", null, option);
            if (option === this.formData.scaleUnits) {
                optionElement.selected = true;
            }
            select.appendChild(optionElement);
        });

        select.onchange = () => {
            this.formData.scaleUnits = parseInt(select.value);
            this._formulate(this.formData);
        }

        // Water Input
        const WaterBox = this._elem("div", "input-box");
        mainForm.appendChild(WaterBox);
        const waterTextLine = this._elem("div", "text-line");
        WaterBox.appendChild(waterTextLine);
        waterTextLine.innerHTML = this._waterSvg() + "Enter the Quantity of Bacteriostatic Water";
        const waterInputGroup = this._elem("div", "input-group");
        WaterBox.appendChild(waterInputGroup);
        const waterInputLabel = this._elem("label", "input-label");
        waterInputGroup.appendChild(waterInputLabel);
        waterInputLabel.textContent = "Water";
        const waterInputWithUnit = this._elem("div", "input-with-unit");
        waterInputGroup.appendChild(waterInputWithUnit);
        const waterInput = this._elem("input", "water-input");
        waterInputWithUnit.appendChild(waterInput);
        waterInput.type = "number";
        waterInput.min = "0";
        waterInput.value = this.formData.waterValue;
        waterInput.onInput = () => {
            this.formData.waterValue = parseInt(waterInput.value);
            this._formulate(this.formData);
        }
        const waterUnit = this._elem("select", "unit-select");
        waterInputWithUnit.appendChild(waterUnit);
        const waterOptions = ["ml", "iu"];
        waterOptions.forEach(option => {
            const optionElement = this._elem("option", null, option);
            if (option === this.formData.waterUnit) {
                optionElement.selected = true;
            }
            waterUnit.appendChild(optionElement);
        });

        // Peptide Input
        const PeptideBox = this._elem("div", "input-box");
        mainForm.appendChild(PeptideBox);
        const peptideTextLine = this._elem("div", "text-line");
        PeptideBox.appendChild(peptideTextLine);
        peptideTextLine.textContent = "Enter the Quantity of Peptide";
        const peptideInputGroup = this._elem("div", "input-group");
        PeptideBox.appendChild(peptideInputGroup);
        const peptideInputLabel = this._elem("label", "input-label");
        peptideInputGroup.appendChild(peptideInputLabel);
        peptideInputLabel.innerHTML = `Peptide <small>(In Vial)</small>`;
        const peptideInputWithUnit = this._elem("div", "input-with-unit");
        peptideInputGroup.appendChild(peptideInputWithUnit);
        const peptideInput = this._elem("input", "peptide-input");
        peptideInputWithUnit.appendChild(peptideInput);
        peptideInput.type = "number";
        peptideInput.min = "0";
        peptideInput.value = this.formData.peptidesQuantitie;
        peptideInput.onInput = () => {
            this.formData.peptidesQuantitie = parseInt(peptideInput.value);
            this._formulate(this.formData);
        }

        const peptideUnit = this._elem("select", "peptide-unit");
        peptideInputWithUnit.appendChild(peptideUnit);
        const peptideOptions = ["mg"];
        peptideOptions.forEach(option => {
            const optionElement = this._elem("option", null, option);
            if (option === this.formData.peptideQuanityUnit) {
                optionElement.selected = true;
            }
            peptideUnit.appendChild(optionElement);
        });
        peptideUnit.onchange = () => {
            this.formData.peptideQuanityUnit = peptideUnit.value;
            this._formulate(this.formData);
        }


        // Dose Input
        const DoseBox = this._elem("div", "input-box");
        mainForm.appendChild(DoseBox);
        const doseTextLine = this._elem("div", "text-line");
        DoseBox.appendChild(doseTextLine);
        doseTextLine.innerHTML = this._peptideSvg() + "Enter the Quantity of Peptide in each dose";
        const doseInputGroup = this._elem("div", "input-group");
        DoseBox.appendChild(doseInputGroup);
        const doseInputLabel = this._elem("label", "input-label");
        doseInputGroup.appendChild(doseInputLabel);
        doseInputLabel.innerHTML = `Peptide <small>(per Injection)</small>`;
        const doseInputWithUnit = this._elem("div", "input-with-unit");
        doseInputGroup.appendChild(doseInputWithUnit);
        const doseInput = this._elem("input", "dose-input");
        doseInputWithUnit.appendChild(doseInput);
        doseInput.type = "number";
        doseInput.min = "0";
        doseInput.value = this.formData.peptidesDosageValue;
        doseInput.onInput = () => {
            this.formData.peptidesDosageValue = parseInt(doseInput.value);
            this._formulate(this.formData);
        }


        const doseUnit = this._elem("select", "dose-unit");
        doseInputWithUnit.appendChild(doseUnit);
        const doseOptions = ["mg", "mcg"];
        doseOptions.forEach(option => {
            const optionElement = this._elem("option", null, option);
            if (option === this.formData.peptidesDosageUnit) {
                optionElement.selected = true;
            }
            doseUnit.appendChild(optionElement);
        });
        doseUnit.onchange = () => {
            this.formData.peptidesDosageUnit = doseUnit.value;
            this._formulate(this.formData);
        }

        // Calculate Button
        const CalculateBox = this._elem("div", "input-box");
        mainForm.appendChild(CalculateBox);
        const calculateButton = this._elem("button", "calculate-button");
        CalculateBox.appendChild(calculateButton);
        calculateButton.textContent = "Calculate";
        calculateButton.onclick = () => {
            this._formulate(this.formData);
        }

    }

    _formulate(formData) {
        let FormulateValue = formData.volumeUnits;
        let FormulateScale = formData.scaleUnits;

        // calculate volume units
        // Calculate how many units to draw for the desired dose
        // Convert peptide quantity and dose to the same unit (mcg)
        let totalPeptideMcg = this.formData.peptideQuanityUnit === "mg"
            ? this.formData.peptidesQuantitie * 1000
            : this.formData.peptidesQuantitie;
        let doseMcg = this.formData.peptidesDosageUnit === "mg"
            ? this.formData.peptidesDosageValue * 1000
            : this.formData.peptidesDosageValue;
        // Calculate units per dose
        FormulateValue = Math.round(
            (doseMcg / totalPeptideMcg) * this.formData.scaleUnits
        );


        if (this.isFormulate) {
            document.querySelector(".main-scale").innerHTML = "";
        }

        const mainScale = document.querySelector(".main-scale") || this._elem("div", "main-scale");
        if (!this.isFormulate) this.target.appendChild(mainScale);
        this.isFormulate = true;


        const formulateHeader = this._elem("div", "formulate-header");
        mainScale.appendChild(formulateHeader);
        formulateHeader.innerHTML = `<div style="width:100%;display:flex;justify-content:space-between;align-items:center">
        <h4>Formulate</h4><p>${FormulateValue} Units</p>
        </div>`;

        const scale = this._elem("div", "formulate-scale");
        mainScale.appendChild(scale);

        const oneFillValue = (100 / FormulateScale);
        const barFill = oneFillValue * FormulateValue;


        const formulateValueBarBox = this._elem("div", "formulate-value-bar-box");
        scale.appendChild(formulateValueBarBox);
        formulateValueBarBox.innerHTML = `<div class="formulate-value-bar" style="width:${barFill}%"></div>`;

        let scaleDivide = 6;
        let valueGap = 5;
        let scaleNumber = 0;
        if (FormulateScale == 30) {
            scaleDivide = 6;
            valueGap = 5;
        }
        else if (FormulateScale == 50) {
            scaleDivide = 10;
            valueGap = 5;
        }
        else if (FormulateScale == 100) {
            scaleDivide = 10;
            valueGap = 10;
        }

        const formulateBars = this._elem("div", "formulate-bars");
        scale.appendChild(formulateBars);
        for (let i = 0; i < scaleDivide; i++) {
            const unitBox = this._elem("div", "unit-box");
            formulateBars.appendChild(unitBox);
            unitBox.style.width = `${100 / scaleDivide}%`;
            for (let j = 0; j < 5; j++) {
                const formulateBar = this._elem("div", "formulate-bar");
                unitBox.appendChild(formulateBar);
                const barLine = this._elem("div", `${j == 0 ? "bar-line-full" : "bar-line-small"}`);
                formulateBar.appendChild(barLine);
                if (j == 0) {
                    const barValue = this._elem("div", "line-value");
                    formulateBar.appendChild(barValue);
                    barValue.textContent = scaleNumber;
                    scaleNumber = scaleNumber + valueGap;
                }
            }
        }

        const unitBox = this._elem("div", "unit-box");
        formulateBars.appendChild(unitBox);
        unitBox.style.width = `fit-content`;
        unitBox.style.position = "absolute";
        unitBox.style.right = "-0px";

        const formulateBar = this._elem("div", "formulate-bar");
        unitBox.appendChild(formulateBar);
        formulateBar.style.width = "auto";
        formulateBar.style.position = "absolute";
        formulateBar.style.right = "-3px";
        const barLine = this._elem("div", "bar-line-full");
        barLine.style.alignSelf = "flex-end";
        formulateBar.appendChild(barLine);
        const barValue = this._elem("div", "line-value");
        formulateBar.appendChild(barValue);
        barValue.textContent = scaleNumber;
        scaleNumber = scaleNumber + valueGap;


        // Output instructions
        const OutputBox = this._elem("div", "output-box");
        mainScale.appendChild(OutputBox);
        const ul = this._elem("ul", "output-list");
        OutputBox.appendChild(ul);
        const list = [
            `Draw ${FormulateValue} units for ${this.formData.peptidesDosageValue} ${this.formData.peptidesDosageUnit} doses`,
        ]
        for (let k = 0; k < list.length; k++) {
            const li = this._elem("li", "output-item");
            ul.appendChild(li);
            li.textContent = list[k];
        }
    }

    _elem(tag, cls, inner) {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        if (inner) el.innerHTML = inner;
        return el;
    }
}


new PeptideCalculator();