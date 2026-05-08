import * as XLSX from "xlsx";

import { downloadTextFile } from "./downloadTextFile";
import "./MainFormComponent.css";
import { useState } from "react";

export default function MainFormComponent() {
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [raData, setRaData] = useState({
        recordId: "RA",
        submitterEIN: "",
        bsoUserId: "",
        softwareVendorCode: "",
        blanks1: "",
        resubIndicator: "0",
        wfId: "",
        softwareCode: "98",
        companyName: "",
        locationAddress: "",
        deliveryAddress: "",
        city: "",
        state: "",
        zip: "",
        zipExtension: "",
        blanks2: "",
        submitterName: "",
        submitterLocation: "",
        submitterDeliveryAddress: "",
        submitterCity: "",
        submitterState: "",
        submitterZip: "",
        submitterZipPlus4: "",
        blanks3: "",
        contactName: "",
        contactPhone: "",
        blanks4: "",
        blanks5: "",
        contactEmail: "",
        blanks6: "",
        blanks7: "",
        blanks8: "",
        preparerCode: "L",
        finalBlanks: "",
    });
    const [reData, setReData] = useState({
        recordType: "RE",
        taxYear: "",
        employerEIN: "",
        terminatingIndicator: "0",
        employerName: "",
        employerLocationAddress: "",
        employerDeliveryAddress: "",
        employerCity: "",
        employerState: "",
        employerZip: "",
        employerZipExtension: "",
        kindOfEmployer: "N",
        employmentCode: "R",
        sickPayIndicator: "0",
        employerContactName: "",
        employerContactPhoneNumber: "",
        employerEmail: "",
        finalBlanks: ""
    });

    const [rwData, setRwData] = useState([]);
    const [rsData, setRsData] = useState([]);

    function handleChange(e, setter) {
        const { name, value } = e.target;
        setter(prev => ({ ...prev, [name]: value }));
    }
    function handleExcelUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, {
                defval: "",
            });
            const rw = rows.map(mapExcelRowToRwData);
            const rs = rows.map(mapExcelRowToRsData);
            setRwData(rw);
            setRsData(rs);
        }
        reader.readAsArrayBuffer(file);
    };
    function mapExcelRowToRwData(row) {
        return {
            employeeSSN: String(row["Employee SSN"] || ""),
            employeeFirstName: row["Employee First Name"] || "",
            employeeMiddleName: row["Employee Middle Name"] || "",
            employeeLastName: row["Employee Last Name"] || "",
            employeeNameSuffix: row["Employee Suffix"] || "",
            employeeLocationAddress: row["Employee Location Address"] || "",
            employeeDeliveryAddress: row["Employee Delivery Address"] || "",
            employeeCity: row["Employee City"] || "",
            employeeState: row["Employee State"] || "",
            employeeZip: String(row["Employee ZIP Code"] || ""),
            employeeZipExtension: String(row["Employee ZIP Code Extension (if applicable)"] || ""),
            wagesTipsOtherComp: String(row["Employee Wages, Tips, Other Compensation"] || ""),
            federalIncomeTaxWithheld: String(row["Employee Federal Income Tax Withheld"] || ""),
            socialSecurityWages: String(row["Employee Social Security Wages"] || ""),
            socialSecurityTaxWithheld: String(row["Employee Social Security Tax Withheld"] || ""),
            medicareWagesAndTips: String(row["Employee Medicare Wages"] || ""),
            medicareTaxWithheld: String(row["Employee Medicare Tax Withheld"] || "")
        };
    }
    function mapExcelRowToRsData(row) {
        return {
            employeeSSN: String(row["Employee SSN"] || ""),
            employeeFirstName: row["Employee First Name"] || "",
            employeeMiddleName: row["Employee Middle Name"] || "",
            employeeLastName: row["Employee Last Name"] || "",
            employeeNameSuffix: row["Employee Suffix"] || "",

            employeeLocationAddress: row["Employee Location Address"] || "",
            employeeDeliveryAddress: row["Employee Delivery Address"] || "",
            employeeCity: row["Employee City"] || "",
            employeeState: row["Employee State"] || "",
            employeeZip: String(row["Employee ZIP Code"] || ""),
            employeeZipExtension: String(row["Employee ZIP Code Extension (if applicable)"] || ""),

            stateTaxableWages: String(row["Employee State Taxable Wages"] || ""),
            stateIncomeTaxWithheld: String(row["Employee State Income Tax Withheld"] || ""),
        };
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3000/generate-efw2", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "x-api-key": import.meta.env.VITE_API_KEY
                },
                body: JSON.stringify({ raData, reData, rwData, rsData })
            });
            const text = await res.text();
            downloadTextFile(text, "efw2-file.txt");
        }
        finally {
            setLoading(false);
        }
    }
    async function handleDownloadPDFs() {
        setGenerating(true);
        try {
            const res = await fetch("http://localhost:3000/generate-pdfs", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "x-api-key": import.meta.env.VITE_API_KEY
                },
                body: JSON.stringify({ rwData, rsData, reData })
            });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "w2-pdfs.zip";
            a.click();
            URL.revokeObjectURL(url);
        }
        finally {
            setGenerating(false);
        }

    }
    function renderInput(label, name, length, data, setter, type, required) {
        return (
            <div className="form-group">
                <label>
                    {label} <span className="length">({length})</span>
                </label>
                <input
                    type={type}
                    required={required}
                    name={name}
                    value={data[name]}
                    onChange={e => handleChange(e, setter)}
                    maxLength={length}
                />
            </div>
        );
    }


    return (
        <div className="main-form">
            <form onSubmit={handleSubmit}>
                <h2>Upload Wage Spreadsheet</h2>
                <fieldset>
                    <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} />
                </fieldset>

                <h2>RA Record</h2>

                <fieldset>
                    <legend>Submitter Identification</legend>
                    {renderInput("Submitter EIN", "submitterEIN", 9, raData, setRaData, "text", true)}
                    {renderInput("BSO User ID", "bsoUserId", 8, raData, setRaData, "text", true)}
                </fieldset>

                <fieldset>
                    <legend>Company / Location</legend>
                    {renderInput("Company Name", "companyName", 57, raData, setRaData, "text", true)}
                    {renderInput("Address Line 1", "deliveryAddress", 22, raData, setRaData, "text", true)}
                    {renderInput("Address Line 2", "locationAddress", 22, raData, setRaData, "text")}
                    {renderInput("City", "city", 22, raData, setRaData, "text", true)}
                    {renderInput("State", "state", 2, raData, setRaData, "text", true)}
                    {renderInput("ZIP", "zip", 5, raData, setRaData, "text", true)}
                    {renderInput("ZIP + 4", "zipExtension", 4, raData, setRaData, "text")}
                </fieldset>

                <fieldset>
                    <legend>Submitter Mailing Address</legend>
                    {renderInput("Submitter Name", "submitterName", 57, raData, setRaData, "text")}
                    {renderInput("Submitter Address Line 1", "submitterDeliveryAddress", 22, raData, setRaData, "text")}
                    {renderInput("Submitter Address Line 2", "submitterLocation", 22, raData, setRaData, "text")}
                    {renderInput("Submitter City", "submitterCity", 22, raData, setRaData, "text")}
                    {renderInput("Submitter State", "submitterState", 2, raData, setRaData, "text")}
                    {renderInput("Submitter ZIP", "submitterZip", 5, raData, setRaData, "text")}
                    {renderInput("Submitter ZIP + 4", "submitterZipPlus4", 4, raData, setRaData, "text")}
                </fieldset>

                <fieldset>
                    <legend>Contact Information</legend>
                    {renderInput("Contact Name", "contactName", 27, raData, setRaData, "text")}
                    {renderInput("Contact Phone", "contactPhone", 15, raData, setRaData, "tel")}
                    {renderInput("Contact Email", "contactEmail", 40, raData, setRaData, "email")}
                </fieldset>
                <h2>RE Record</h2>
                <fieldset>
                    <legend>Employer Identification</legend>
                    {renderInput("Tax Year", "taxYear", 4, reData, setReData, "text", true)}
                    {renderInput("Employer EIN", "employerEIN", 9, reData, setReData, "text", true)}
                </fieldset>

                <fieldset>
                    <legend>Employer Address</legend>
                    {renderInput("Employer Name", "employerName", 57, reData, setReData, "text", true)}
                    {renderInput("Address Line 1", "employerDeliveryAddress", 22, reData, setReData, "text", true)}
                    {renderInput("Address Line 2", "employerLocationAddress", 22, reData, setReData, "text")}
                    {renderInput("City", "employerCity", 22, reData, setReData, "text", true)}
                    {renderInput("State", "employerState", 2, reData, setReData, "text", true)}
                    {renderInput("ZIP", "employerZip", 5, reData, setReData, "text", true)}
                    {renderInput("ZIP + 4", "employerZipExtension", 4, reData, setReData, "text")}
                </fieldset>

                <fieldset>
                    <legend>Employer Contact</legend>
                    {renderInput("Contact Name", "employerContactName", 27, reData, setReData, "text")}
                    {renderInput("Contact Phone", "employerContactPhoneNumber", 15, reData, setReData, "tel")}
                    {renderInput("Contact Email", "employerEmail", 40, reData, setReData, "email")}
                </fieldset>
                <div className="button-row">
                    <button type="submit" disabled={loading}>{loading ? "Generating..." : "Download EFW2 File"}</button>
                    <button type="button" onClick={handleDownloadPDFs} disabled={generating}>{generating ? "Preparing your ZIP file..." : "Generate W-2 PDFs"}</button>
                </div>
            </form>
        </div>
    );
}
