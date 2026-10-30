import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 755, "Airline Passenger Satisfaction Prediction — Project Guide (English + Hinglish)")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 747, 558, 747)

        # Footer
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_str)
        self.drawString(54, 36, "Confidential & Educational Project Documentation | Vercel + Render Deployment")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 46, 558, 46)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#1e293b"),
        alignment=TA_CENTER
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#475569"),
        alignment=TA_CENTER
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=14,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#2563eb"),
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6,
        alignment=TA_LEFT
    )

    hinglish_style = ParagraphStyle(
        'Hinglish_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#0f766e"),
        spaceAfter=6
    )

    box_callout_style = ParagraphStyle(
        'BoxCallout',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1e293b")
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0f172a")
    )

    story = []

    # Title Banner
    story.append(Spacer(1, 15))
    story.append(Paragraph("✈️ Airline Passenger Satisfaction Prediction", title_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Complete Project Guide & Explanation (English + Simple Hinglish)", subtitle_style))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#2563eb"), spaceBefore=8, spaceAfter=14))

    # Deployment summary box
    summary_data = [
        [Paragraph("<b>Production Frontend (Vercel):</b>", box_callout_style), Paragraph("<font color='#2563eb'>https://frontend-omega-livid-48.vercel.app</font>", box_callout_style)],
        [Paragraph("<b>Production Backend (Render):</b>", box_callout_style), Paragraph("<font color='#2563eb'>https://airline-satisfaction-backend.onrender.com</font>", box_callout_style)],
        [Paragraph("<b>Interactive Swagger Docs:</b>", box_callout_style), Paragraph("<font color='#2563eb'>https://airline-satisfaction-backend.onrender.com/docs</font>", box_callout_style)],
        [Paragraph("<b>GitHub Repository:</b>", box_callout_style), Paragraph("<font color='#2563eb'>https://github.com/siddharth194thakur-gif/airline-passenger-satisfaction</font>", box_callout_style)],
        [Paragraph("<b>Machine Learning Model:</b>", box_callout_style), Paragraph("Authentic Pre-trained WEKA RandomForest (70.4 MB, 100 Trees)", box_callout_style)],
        [Paragraph("<b>Historical Model Accuracy:</b>", box_callout_style), Paragraph("<b>96.3435%</b> (Stratified 10-Fold Cross-Validation on 129,880 rows)", box_callout_style)],
        [Paragraph("<b>Hosting Cost:</b>", box_callout_style), Paragraph("<b>₹0 / Month (100% Free Tier: SQLite + Vercel + Render)</b>", box_callout_style)],
    ]
    summary_table = Table(summary_data, colWidths=[170, 334])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 14))

    # SECTION 1: INTRODUCTION
    story.append(Paragraph("1. Project Overview — Ye Project Kya Hai Aur Kyun Banaya Gaya Hai?", h1_style))
    story.append(Paragraph(
        "<b>English:</b> In the competitive aviation industry, passenger satisfaction directly impacts airline revenue, brand loyalty, and retention. "
        "This project is an end-to-end Machine Learning web application that predicts whether an airline passenger will be <b>Satisfied</b> or <b>Neutral/Dissatisfied</b> "
        "based on passenger demographics, flight logistics (flight distance, delays), and 14 specific service quality ratings (wifi, cleanliness, food, leg room, etc.).",
        body_style
    ))
    story.append(Paragraph(
        "<b>Hinglish (Asaan Bhasha Me):</b> Seedhi bhasha me samjhe to airline companies ke paas lakhon passengers aate hain. Har passenger flight ke alag-alag features ko rate karta hai—jaise seat kitni aaramdayak thi, khana kaisa tha, wifi kaisa chala, flight kitni late hui. "
        "Hamara system ye saari details lekar turant batata hai ki wo passenger hamari service se <b>Khush (Satisfied)</b> hai ya fir <b>Naraz/Asantust (Neutral or Dissatisfied)</b> hai. "
        "Isko banane ka maksad ye hai ki airlines ko pata chal sake ki kaunsi cheez sudharne se passengers khush honge.",
        hinglish_style
    ))

    # SECTION 2: ARCHITECTURE
    story.append(Spacer(1, 10))
    story.append(Paragraph("2. System Architecture — Ye Kaam Kaise Karta Hai (Step-by-Step)?", h1_style))
    story.append(Paragraph(
        "A lot of ML projects fake predictions using simple dummy scripts. <b>Our project is 100% authentic</b>. It uses a 4-tier production architecture:",
        body_style
    ))

    arch_flow = [
        [Paragraph("<b>Step 1: Frontend (User UI)</b><br/>React 18 + Vite + Tailwind CSS (Hosted on Vercel)", box_callout_style), 
         Paragraph("User website open karta hai, form me passenger ki details bharta hai (Age, Class, Ratings), aur 'Predict Satisfaction' button dabata hai.", hinglish_style)],
        [Paragraph("<b>Step 2: API Backend</b><br/>Python FastAPI + Pydantic (Hosted on Render)", box_callout_style), 
         Paragraph("FastAPI request ko check (validate) karta hai ki koi galat input to nahi hai. Fir wo data ko internal Java Engine ko bhejta hai.", hinglish_style)],
        [Paragraph("<b>Step 3: Prediction Engine</b><br/>Java OpenJDK 25 + WEKA 3.8.7 Library", box_callout_style), 
         Paragraph("Java engine asli 70.4 MB ke WEKA model ko RAM me rakhta hai. Ye mathematically 100 Decision Trees chala kar exact prediction aur probabilities nikalta hai.", hinglish_style)],
        [Paragraph("<b>Step 4: Database Storage</b><br/>SQLite (Free, Zero Cost)", box_callout_style), 
         Paragraph("Har prediction ka result SQLite database me save ho jata hai, taaki user History tab me purane saare results dekh sake.", hinglish_style)]
    ]
    arch_table = Table(arch_flow, colWidths=[200, 304])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#94a3b8")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(arch_table)

    story.append(PageBreak())

    # SECTION 3: WEKA MODEL
    story.append(Paragraph("3. WEKA ML Model — Random Forest Ki Poori Kahani", h1_style))
    story.append(Paragraph(
        "<b>English:</b> WEKA (Waikato Environment for Knowledge Analysis) is an industry-standard Java-based ML suite. "
        "The model file <code>projectmodel_weka.model</code> is an ensemble <b>Random Forest</b> classifier containing <b>100 decision trees</b>, trained on 129,880 passenger records. "
        "Because WEKA models are serialized Java objects (using Java binary serialization), Python libraries like <code>scikit-learn</code> cannot directly load or execute them. "
        "We built a native Java HTTP microservice that runs WEKA natively, providing 100% mathematically exact predictions.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Hinglish (Asaan Bhasha Me):</b> WEKA ek bohot mashhoor machine learning tool hai jo Java me bana hai. "
        "Aapka jo model hai (<code>projectmodel_weka.model</code>), wo <b>Random Forest</b> algorithm par bana hai. "
        "Random Forest ka matlab hota hai ki isme <b>100 alag-alag Decision Trees (ped)</b> milkar faisla lete hain! "
        "Jaise agar 100 me se 90 trees kahenge ki passenger Satisfied hai, to final result Satisfied aayega aur confidence 90% dikhayega. "
        "<br/><b>Khaas Baat:</b> Kyunki WEKA Java me bana hota hai, Python iski model file ko direct nahi padh sakta. Isliye humne ek chhota Java server banaya jo background me chalta hai aur Python FastAPI se baat karta hai.",
        hinglish_style
    ))

    # Metrics Table
    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>Model Performance Metrics (Verified 10-Fold Cross-Validation):</b>", h2_style))
    metrics_data = [
        [Paragraph("<b>Metric Name</b>", box_callout_style), Paragraph("<b>Value</b>", box_callout_style), Paragraph("<b>Meaning in Simple Terms</b>", box_callout_style)],
        [Paragraph("Total Training Instances", box_callout_style), Paragraph("129,880", box_callout_style), Paragraph("Itne passengers ke data par model train hua tha.", box_callout_style)],
        [Paragraph("Model Accuracy", box_callout_style), Paragraph("<b>96.3435%</b>", box_callout_style), Paragraph("125,131 instances bilkul sahi predict kiye.", box_callout_style)],
        [Paragraph("Weighted ROC Area (AUC)", box_callout_style), Paragraph("<b>0.995</b>", box_callout_style), Paragraph("Near perfect score (1.0 max hota hai).", box_callout_style)],
        [Paragraph("Weighted F1-Score", box_callout_style), Paragraph("<b>0.963</b>", box_callout_style), Paragraph("Precision aur Recall dono ka solid balance.", box_callout_style)],
        [Paragraph("Kappa Statistic", box_callout_style), Paragraph("<b>0.9253</b>", box_callout_style), Paragraph("Proves result fluke ya tukka nahi hai.", box_callout_style)],
    ]
    metrics_table = Table(metrics_data, colWidths=[150, 80, 274])
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#94a3b8")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(metrics_table)

    # SECTION 4: 22 ATTRIBUTES EXPLANATION
    story.append(Spacer(1, 14))
    story.append(Paragraph("4. The 22 Input Attributes — Model Kaun-Kaun Si Baatein Puchhta Hai?", h1_style))
    story.append(Paragraph("Model 22 alag-alag features check karta hai:", body_style))

    attrs_summary = [
        [Paragraph("<b>Category</b>", box_callout_style), Paragraph("<b>Attributes</b>", box_callout_style), Paragraph("<b>Values / Scale</b>", box_callout_style)],
        [Paragraph("Demographics", box_callout_style), Paragraph("Gender, Age, Customer Type (First-time / Returning)", box_callout_style), Paragraph("Male/Female, 7-85, Loyal/Disloyal", box_callout_style)],
        [Paragraph("Flight Details", box_callout_style), Paragraph("Type of Travel, Class, Flight Distance, Delays", box_callout_style), Paragraph("Business/Personal, Eco/Business, Miles, Minutes", box_callout_style)],
        [Paragraph("Pre-Flight Ratings", box_callout_style), Paragraph("Departure/Arrival Convenience, Online Booking, Gate Location, Check-in Service, Online Boarding", box_callout_style), Paragraph("0 (Poor) to 5 (Excellent)", box_callout_style)],
        [Paragraph("In-Flight Comfort", box_callout_style), Paragraph("Seat Comfort, Leg Room Service, Cleanliness, Food and Drink", box_callout_style), Paragraph("0 (Poor) to 5 (Excellent)", box_callout_style)],
        [Paragraph("On-Board Amenities", box_callout_style), Paragraph("Inflight Wifi, Inflight Entertainment, On-board Service, Baggage Handling, Inflight Service", box_callout_style), Paragraph("0 (Poor) to 5 (Excellent)", box_callout_style)],
    ]
    attrs_table = Table(attrs_summary, colWidths=[120, 240, 144])
    attrs_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#94a3b8")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(attrs_table)

    story.append(PageBreak())

    # SECTION 5: FRONTEND, BACKEND, AND ZERO-COST DATABASE
    story.append(Paragraph("5. Tech Stack & Why We Chose It (Free & Scalable)", h1_style))
    
    tech_data = [
        [Paragraph("<b>Component</b>", box_callout_style), Paragraph("<b>Technology</b>", box_callout_style), Paragraph("<b>Kyun Use Kiya? (Reason)</b>", box_callout_style)],
        [Paragraph("Frontend UI", box_callout_style), Paragraph("React 18 + Vite + Tailwind CSS + Lucide Icons + Recharts", box_callout_style), Paragraph("Super fast, fully responsive on mobile & desktop, beautiful dark/light mode, live analytics charts.", box_callout_style)],
        [Paragraph("Backend API", box_callout_style), Paragraph("Python FastAPI + Pydantic v2 + Uvicorn", box_callout_style), Paragraph("Super high performance, automatic input validation, instant Swagger interactive documentation at <code>/docs</code>.", box_callout_style)],
        [Paragraph("ML Engine", box_callout_style), Paragraph("Java OpenJDK 25 + WEKA 3.8.7 HTTP Server", box_callout_style), Paragraph("Asli WEKA Random Forest model ko bina kisi simulation ke direct memory me chalaane ke liye.", box_callout_style)],
        [Paragraph("Database", box_callout_style), Paragraph("SQLite (<code>predictions.db</code>)", box_callout_style), Paragraph("<b>Zero-Cost (Bilkul Free)</b>. Kisi expensive cloud database ka kharcha nahi hota.", box_callout_style)],
        [Paragraph("Frontend Hosting", box_callout_style), Paragraph("Vercel (Free Hobby Plan)", box_callout_style), Paragraph("Global CDN, lightning fast page loads, automatic HTTPS SSL certificate.", box_callout_style)],
        [Paragraph("Backend Hosting", box_callout_style), Paragraph("Render Docker Web Service (Free Tier)", box_callout_style), Paragraph("Both Python and Java run together inside a single isolated Docker container.", box_callout_style)]
    ]
    tech_table = Table(tech_data, colWidths=[110, 170, 224])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#94a3b8")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(tech_table)

    # SECTION 6: INTERVIEW & VIVA QUESTIONS
    story.append(Spacer(1, 14))
    story.append(Paragraph("6. Top Viva / Interview Questions & Ready Answers", h1_style))
    story.append(Paragraph("Agar koi teacher, examiner ya interviewer aapse is project par sawal pooche, to ye bolna:", body_style))

    qas = [
        ("Q1: Aapne isme kaunsa algorithm use kiya hai aur kyun?",
         "Humne WEKA ka <b>Random Forest</b> classifier use kiya hai. Ye ek ensemble technique hai jo 100 Decision Trees banata hai. Ye tabular data par bohot accurate hota hai aur overfitting ko rokkta hai. Iski cross-validation accuracy 96.34% aayi hai."),
        
        ("Q2: Python project me Java ka kya kaam hai?",
         "Aapka trained model WEKA me bana hai, jo ek Java binary serialized format (.model) me hota hai. Python isko natively direct run nahi kar sakta. Isliye humne ek lightweight Java prediction engine banaya jo model ko memory me load karta hai aur FastAPI ke sath communicate karta hai."),
        
        ("Q3: Model ke hisaab se sabse important features kaunse hain?",
         "Analysis se pata chalta hai ki <b>Online Boarding</b>, <b>Inflight Wifi Service</b>, <b>Seat Comfort</b>, <b>Type of Travel (Business vs Personal)</b> aur <b>Flight Class (Business vs Economy)</b> sabse zyaada passenger satisfaction decide karte hain."),

        ("Q4: Is project ka real-world use-case kya hai?",
         "Airlines real-time me check kar sakti hain ki kisi flight ke passengers kyu asantust (dissatisfied) the—jaise wifi kharab tha ya delay zyada tha—aur targeted improvements karke revenue bacha sakti hain."),

        ("Q5: Deploy kahan kiya hai?",
         "Frontend <b>Vercel</b> par deployed hai aur Backend + Java Engine <b>Render</b> par Docker container ke zariye deployed hai. Dono bilkul free tier par chal rahe hain.")
    ]

    for q, a in qas:
        story.append(Paragraph(f"<b>{q}</b>", h2_style))
        story.append(Paragraph(a, hinglish_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {filename}")

if __name__ == "__main__":
    out_path = "/Users/siddharthsingh/wekaproject/PROJECT_GUIDE_HINGLISH_ENGLISH.pdf"
    build_pdf(out_path)
