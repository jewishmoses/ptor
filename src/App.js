import logo from './logo.png';
import './App.css';
import fontkit from '@pdf-lib/fontkit'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function generatePDF(personalNumber, rank, fullName, ptor) {

    if (personalNumber.length !== 7) {
        alert("Alert Title");
        return;
    }

    const ptors = [
        {
            id: 0,
            x: 380,
            y: 490,
            text: "רשאי לגדל זקן באופן קבוע\t\t\t\t   \nמפאת מצבו הרפואי ועל פי המלצת קר\"פ",
        }
    ]

    const ranks = ['טור', 'רבט', 'סמל', 'סמר'];

    const time = new Date();

    const dd = String(time.getDate()).padStart(2, '0');
    const mm = String(time.getMonth() + 1).padStart(2, '0');
    const yyyy = time.getFullYear();

    const dateOfMeeting = mm + '/' + dd + '/' + yyyy;
    const hourOfMetting = time.getHours() + ":" + time.getMinutes();

    const existingPdfBytes = await fetch('./template.pdf').then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    pdfDoc.registerFontkit(fontkit)

    const helveticaFontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const arialFontBytes = await fetch('./fonts/Arial.ttf').then((res) => res.arrayBuffer())
    const arialFont = await pdfDoc.embedFont(arialFontBytes)

    const arialBoldFontBytes = await fetch('./fonts/ArialBold.ttf').then((res) => res.arrayBuffer())
    const arialBoldFont = await pdfDoc.embedFont(arialBoldFontBytes)

    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    firstPage.drawText(personalNumber, {
        x: 463,
        y: 557,
        size: 10,
        font: helveticaFontBold,
        color: rgb(0, 0, 0),
    })

    firstPage.drawText(ranks[rank], {
        x: 380,
        y: 557,
        size: 10,
        font: arialBoldFont,
        color: rgb(0, 0, 0),
    })

    firstPage.drawText(fullName, {
        x: (345 - (fullName.length * 5)),
        y: 557,
        size: 10,
        font: arialBoldFont,
        color: rgb(0, 0, 0),
    })

    firstPage.drawText(ptors[ptor].text, {
        x: ptors[ptor].x,
        y: ptors[ptor].y,
        size: 10,
        font: arialFont,
        color: rgb(0, 0, 0),
    })

    firstPage.drawText(dateOfMeeting, {
        x: 450,
        y: 579,
        size: 10,
        font: arialFont,
        color: rgb(0, 0, 0),
    })

    firstPage.drawText(dateOfMeeting, {
        x: 353,
        y: 534,
        size: 10,
        font: arialFont,
        color: rgb(0, 0, 0),
    })

    firstPage.drawText(hourOfMetting, {
        x: 228,
        y: 534,
        size: 10,
        font: arialFont,
        color: rgb(0, 0, 0),
    })

    const pdfBytes = await pdfDoc.save();

    var blob = new Blob([pdfBytes], { type: "application/pdf" });

    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = "ptor.pdf";
    link.click();
}

function submit(event) {

    event.preventDefault();

    if (!event.target.checkValidity()) {
        return;
    }

    const fullName = document.getElementsByName('fullName')[0].value;
    const personalNumber = document.getElementsByName('personalNumber')[0].value;
    const rank = document.getElementsByName('rank')[0].value;
    const ptor = document.getElementsByName('ptor')[0].value;

    generatePDF(personalNumber, rank, fullName, ptor)

}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2 className="App-title">מערכת להוצאת פטורים</h2>
                <p className="App-description">אתר זה נועד למטרות לימוד בלבד.<br /> הבעלים של אתר זה לא יהיה אחראי לנזקים כלשהם.</p>
            </header>

            <form onSubmit={submit}>

                <label className="form-label" >
                    שם מלא
                    <input className="form-input" name="fullName" type="text" required></input>
                </label>

                <label className="form-label" >
                    מספר אישי
                    <input className="form-input" name="personalNumber" minLength="7" maxLength="7" type="tel" required></input>
                </label>

                <label className="form-label" >
                    דרגה
                    <select defaultValue="0" className="form-input" name="rank" type="text" required>
                        <option value="0">טור</option>
                        <option value="1">רבט</option>
                        <option value="2">סמל</option>
                        <option value="3">סמר</option>
                    </select>
                </label>

                <label className="form-label" >
                    פטור
                    <select defaultValue="0" className="form-input" name="ptor" type="text" required>
                        <option value="0">זקן</option>
                    </select>
                </label>

                <button className="form-submit">הורדה</button>

            </form>

            <span className="footer">פותח ע"י MZ</span>

        </div>
    );
}

export default App;
