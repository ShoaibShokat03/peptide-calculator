class PeptideCalculator {
    constructor(target = "#peptide-calculator") {

        const targetElement = document.querySelector(target);

        if (targetElement) {
            this.target = targetElement;
        }
        else {
            this.target = document.body;
        }

        // Inject Styles
        this.injectStyle();

        this._mainForm();

        // Initial Formulate
        this.formulateOptions = {
            valueUnits: 25,
            unit: "mcg",
            scaleUnits: 30
        }

        // Draw Formulate
        this._formulate(this.formulateOptions);
        this.isFormulate = false;

    }

    injectStyle() {
        const css = ``;
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    }

    _formulate(formulateOptions) {
        const FormulateValue = formulateOptions.valueUnits;
        const FormulateUnit = formulateOptions.unit;
        const FormulateScale = formulateOptions.scaleUnits;

        const mainScale = this._elem("div", "main-scale");
        this.target.appendChild(mainScale);
        if (this.isFormulate) {
            document.querySelector(".main-scale").innerHTML = "";
        }
        console.log("Formulate Is:", this.isFormulate);
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
        unitBox.style.right = "0px";

        const formulateBar = this._elem("div", "formulate-bar");
        unitBox.appendChild(formulateBar);
        formulateBar.style.width = "auto";
        formulateBar.style.position = "absolute";
        formulateBar.style.right = "-2px";
        const barLine = this._elem("div", "bar-line-full");
        barLine.style.alignSelf = "flex-end";
        formulateBar.appendChild(barLine);
        const barValue = this._elem("div", "line-value");
        formulateBar.appendChild(barValue);
        barValue.textContent = scaleNumber;
        scaleNumber = scaleNumber + valueGap;

    }

    _mainForm() {
        const mainForm = this._elem("div", "main-form");
        this.target.appendChild(mainForm);


        // Volume Input
        const InputBox = this._elem("div", "input-box");
        mainForm.appendChild(InputBox);
        const volumeTextLine = this._elem("div", "volume-text-line");
        InputBox.appendChild(volumeTextLine);
        volumeTextLine.textContent = "Select the Total Volume of your Syringe";
        const inputGroup = this._elem("div", "input-group");
        InputBox.appendChild(inputGroup);
        const inputLabel = this._elem("label", "input-label");
        inputGroup.appendChild(inputLabel);
        inputLabel.textContent = "Volume";
        const selectBox = this._elem("div", "select-box");
        inputGroup.appendChild(selectBox);
        const select = this._elem("select", "volume-select");
        selectBox.appendChild(select);
        const options = ["30", "50", "100"];
        options.forEach(option => {
            select.appendChild(this._elem("option", null, option));
        });

        select.onchange = () => {
            this.formulateOptions.valueUnits = select.value;
            this._formulate(this.formulateOptions);
        }

        // Water Input
        const WaterBox = this._elem("div", "input-box");
        mainForm.appendChild(WaterBox);
        const waterTextLine = this._elem("div", "water-text-line");
        WaterBox.appendChild(waterTextLine);
        waterTextLine.textContent = "Enter the Quantity of Bacteriostatic Water";
        const waterInputGroup = this._elem("div", "input-group");
        WaterBox.appendChild(waterInputGroup);
        const waterInputLabel = this._elem("label", "input-label");
        waterInputGroup.appendChild(waterInputLabel);
        waterInputLabel.textContent = "Water";
        const waterInputWithUnit = this._elem("div", "input-with-unit");
        waterInputGroup.appendChild(waterInputWithUnit);
        const waterInput = this._elem("input", "water-input");
        waterInputWithUnit.appendChild(waterInput);
        const waterUnit = this._elem("select", "unit-select");
        waterInputWithUnit.appendChild(waterUnit);
        const waterOptions = ["ml", "iu"];
        waterOptions.forEach(option => {
            waterUnit.appendChild(this._elem("option", null, option));
        });

        // Peptide Input
        const PeptideBox = this._elem("div", "input-box");
        mainForm.appendChild(PeptideBox);
        const peptideTextLine = this._elem("div", "peptide-text-line");
        PeptideBox.appendChild(peptideTextLine);
        peptideTextLine.textContent = "Enter the Quantity of Peptide";
        const peptideInputGroup = this._elem("div", "input-group");
        PeptideBox.appendChild(peptideInputGroup);
        const peptideInputLabel = this._elem("label", "input-label");
        peptideInputGroup.appendChild(peptideInputLabel);
        peptideInputLabel.textContent = "Peptide";
        const peptideInputWithUnit = this._elem("div", "input-with-unit");
        peptideInputGroup.appendChild(peptideInputWithUnit);
        const peptideInput = this._elem("input", "peptide-input");
        peptideInputWithUnit.appendChild(peptideInput);
        const peptideUnit = this._elem("select", "peptide-unit");
        peptideInputWithUnit.appendChild(peptideUnit);
        const peptideOptions = ["mg", "mcg"];
        peptideOptions.forEach(option => {
            peptideUnit.appendChild(this._elem("option", null, option));
        });

        // Dose Input
        const DoseBox = this._elem("div", "input-box");
        mainForm.appendChild(DoseBox);
        const doseTextLine = this._elem("div", "dose-text-line");
        DoseBox.appendChild(doseTextLine);
        doseTextLine.textContent = "Enter the Quantity of Peptide in each dose";
        const doseInputGroup = this._elem("div", "input-group");
        DoseBox.appendChild(doseInputGroup);
        const doseInputLabel = this._elem("label", "input-label");
        doseInputGroup.appendChild(doseInputLabel);
        doseInputLabel.textContent = "Peptide";
        const doseInputWithUnit = this._elem("div", "input-with-unit");
        doseInputGroup.appendChild(doseInputWithUnit);
        const doseInput = this._elem("input", "dose-input");
        doseInputWithUnit.appendChild(doseInput);
        const doseUnit = this._elem("select", "dose-unit");
        doseInputWithUnit.appendChild(doseUnit);
        const doseOptions = ["mg", "mcg"];
        doseOptions.forEach(option => {
            doseUnit.appendChild(this._elem("option", null, option));
        });

        // Calculate Button
        const CalculateBox = this._elem("div", "input-box");
        mainForm.appendChild(CalculateBox);
        const calculateButton = this._elem("button", "calculate-button");
        CalculateBox.appendChild(calculateButton);
        calculateButton.textContent = "Calculate";

        // Results
        const ResultsBox = this._elem("div", "results-box");
        mainForm.appendChild(ResultsBox);
        const resultsHeader = this._elem("div", "results-header");
        ResultsBox.appendChild(resultsHeader);
        resultsHeader.textContent = "Results";
        const resultsValue = this._elem("div", "results-value");
        ResultsBox.appendChild(resultsValue);


    }

    _elem(tag, cls, inner) {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        if (inner) el.innerHTML = inner;
        return el;
    }
}


new PeptideCalculator();