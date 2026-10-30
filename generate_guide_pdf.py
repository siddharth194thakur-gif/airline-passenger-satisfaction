import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
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
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748b"))
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "AeroPredict — Complete Project Guide (Hinglish + English)")
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)

        # Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_text)
        self.drawString(54, 36, "Confidential & Educational — Airline Passenger Satisfaction AI Project")
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
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
        textColor=colors.HexColor("#1e1b4b"),
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#4338ca"),
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=colors.HexColor("#1e293b"),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#334155"),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyHinglish',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=6
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1e293b")
    )

    q_style = ParagraphStyle(
        'QStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#4338ca"),
        spaceBefore=8,
        spaceAfter=2,
        keepWithNext=True
    )

    ans_style = ParagraphStyle(
        'AnsStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6
    )

    story = []

    # Title & Header
    story.append(Paragraph("AeroPredict: Airline Passenger Satisfaction", title_style))
    story.append(Paragraph("Complete Project Explanation Guide (A to Z) — English & Hinglish", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#4f46e5"), spaceAfter=14))

    # Box: What is this guide?
    intro_box_data = [[
        Paragraph(
            "<b>Yeh Guide Kiske Liye Hai?</b><br/>"
            "Agar aapko Machine Learning, Coding ya Web Development ka deep knowledge nahi hai, toh chinta ki koi baat nahi! "
            "Is PDF me bilkul basic, aasan shabdon me samjhaya gaya hai ki yeh project kya karta hai, iska har component kaise kaam karta hai, "
            "aur agar koi viva/interview me pooche toh kya bolna hai.",
            callout_style
        )
    ]]
    intro_table = Table(intro_box_data, colWidths=[504])
    intro_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#eef2ff")),
        ('BORDER', (0,0), (-1,-1), 1, colors.HexColor("#c7d2fe")),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(intro_table)
    story.append(Spacer(1, 12))

    # SECTION 1
    story.append(Paragraph("1. Simple Words Me: Yeh Project Kya Hai? (Overview)", h1_style))
    story.append(Paragraph(
        "<b>English:</b> This project is a Machine Learning Web Application that predicts whether an airline passenger is <b>Satisfied</b> or <b>Neutral/Dissatisfied</b> with their flight experience based on their ratings.<br/>"
        "<b>Hinglish:</b> Yeh ek AI Web Application hai. Jab koi passenger flight me safar karta hai, toh woh alag-alag cheezon ko ratings deta hai — jaise seat aaramdayak thi ya nahi, khana kaisa tha, Wifi kaisa tha, flight late hui ya time pe thi. "
        "Yeh website un ratings ko dekhkar turant predict karke bata deti hai ki passenger flight se <b>Khush (Satisfied)</b> hai ya <b>Nakhush (Neutral/Dissatisfied)</b> hai.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Real-Life Example:</b> Jaise Zomato ya Swiggy par khana order karne ke baad agar delivery late ho aur khana thanda ho toh customer dissatisfied ho jata hai. "
        "Theek waise hi, flight me agar seat comfort bekaar ho aur 2 ghante ki delay ho toh passenger dissatisfied hoga. Hamara AI model yahi pattern pehchanta hai.",
        body_style
    ))

    story.append(Spacer(1, 10))

    # SECTION 2
    story.append(Paragraph("2. Machine Learning Model Kya Hai Aur Kaha Se Aaya? (ML Details)", h1_style))
    story.append(Paragraph(
        "<b>Model File:</b> <code>projectmodel_weka.model</code> (Size: 70.4 MB)<br/>"
        "<b>Software:</b> <b>WEKA</b> (Waikato Environment for Knowledge Analysis) — Data mining & ML tool.<br/>"
        "<b>Algorithm:</b> <b>Random Forest</b> (100 Decision Trees ka collection).",
        body_style
    ))

    ml_table_data = [
        [Paragraph("<b>Metric</b>", body_style), Paragraph("<b>Value</b>", body_style), Paragraph("<b>Matlab (Meaning in Simple Words)</b>", body_style)],
        [Paragraph("Training Instances", body_style), Paragraph("129,880", body_style), Paragraph("Lagbhag 1.3 Lakh passengers ke asli data par train hua hai.", body_style)],
        [Paragraph("10-Fold CV Accuracy", body_style), Paragraph("<b>96.34%</b>", body_style), Paragraph("100 me se 96 se zyada baar model ka prediction ekdum sahi nikalta hai.", body_style)],
        [Paragraph("ROC Area (AUC)", body_style), Paragraph("<b>0.995</b>", body_style), Paragraph("1.0 max hota hai; 0.995 ka matlab model ki accuracy world-class hai.", body_style)],
        [Paragraph("Weighted F1-Score", body_style), Paragraph("0.963", body_style), Paragraph("Precision aur Recall ka balanced score (Outstanding).", body_style)],
        [Paragraph("Kappa Statistic", body_style), Paragraph("0.9253", body_style), Paragraph("Tukke (luck) se nahi, solid data patterns se predictions aate hain.", body_style)],
    ]
    ml_table = Table(ml_table_data, colWidths=[130, 90, 284])
    ml_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(ml_table)

    story.append(Spacer(1, 10))

    # SECTION 3
    story.append(Paragraph("3. 3-Tier Architecture (Yeh Kaam Kaise Karta Hai?)", h1_style))
    story.append(Paragraph(
        "Pura system 3 mukhya hisson (layers) me bata hua hai jo aapas me milkar kaam karte hain:",
        body_style
    ))

    arch_data = [
        [
            Paragraph("<b>1. Frontend (User Interface)</b>", body_style),
            Paragraph("<b>Tech:</b> React 18, Vite, TypeScript, Tailwind CSS<br/>"
                      "<b>Kaam:</b> Yeh woh sundar website hai jo user ko screen par dikhti hai. Isme user sliders aur buttons se ratings bharta hai aur charts dekhta hai.", body_style)
        ],
        [
            Paragraph("<b>2. Backend (API Server)</b>", body_style),
            Paragraph("<b>Tech:</b> Python 3.14, FastAPI, Pydantic, SQLite<br/>"
                      "<b>Kaam:</b> Frontend se ratings ko receive karta hai, check karta hai ki ratings 0-5 ke beech sahi hain ya nahi, aur data ko database me save karta hai.", body_style)
        ],
        [
            Paragraph("<b>3. Java Engine (ML Model Host)</b>", body_style),
            Paragraph("<b>Tech:</b> Java 25 (LTS), WEKA Library (weka.jar)<br/>"
                      "<b>Kaam:</b> Model <code>.model</code> file Java me bani thi. Python ise directly read nahi kar sakta. Isliye ek lightweight Java Server banaya jo model ko memory me rakhkar real calculations karta hai.", body_style)
        ]
    ]
    arch_table = Table(arch_data, colWidths=[160, 344])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#faf5ff")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e9d5ff")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(arch_table)

    story.append(Spacer(1, 14))
    story.append(PageBreak())

    # SECTION 4
    story.append(Paragraph("4. Website Ke 5 Pages Aur Unka Kaam", h1_style))

    pages_info = [
        ("Dashboard (/) : Home Page",
         "Puri application ka overview deta hai. Isme 2 cheezein alag-alag dikhayi gayi hain: (1) Historical WEKA 96.34% accuracy benchmark, aur (2) Live web predictions ka pie-chart aur real-time count."),
        ("Predict Satisfaction (/predict) : Asli Kaam Wala Page",
         "Yaha user ratings enter karta hai (Jaise Seat Comfort: 5/5, Food: 4/5, Delay: 10 mins). Jaise hi 'Predict Satisfaction' button dabate hain, model instant result deta hai ki passenger Satisfied hai ya Dissatisfied, saath me exact percentage bhi dikhata hai (e.g. 94% probability)."),
        ("Prediction History (/history) : Purane Records Ka Khazana",
         "Jitne bhi predictions ab tak kiye gaye hain, woh sab yaha ek table me save rehte hain. Aap unhe search kar sakte hain, filter kar sakte hain, CSV file download kar sakte hain, ya delete kar sakte hain."),
        ("Model Performance (/performance) : Research & Evaluation Page",
         "Is page par WEKA ka verified Confusion Matrix aur har metric ka explanation hai — Precision kya hota hai, Recall kya hota hai, ROC Area kya hota hai."),
        ("About Project (/about) : Project Ki Jankari",
         "System ka architecture diagram, technology stack, model configuration (100 trees) aur system health diagnostics dikhata hai.")
    ]

    for p_title, p_desc in pages_info:
        story.append(Paragraph(f"• <b>{p_title}</b>", h2_style))
        story.append(Paragraph(p_desc, body_style))

    story.append(Spacer(1, 10))

    # SECTION 5
    story.append(Paragraph("5. Step-by-Step: Jab User 'Predict' Click Karta Hai Toh Kya Hota Hai?", h1_style))
    story.append(Paragraph(
        "<b>Step 1:</b> User form bharta hai (e.g. Female, 35 yrs, Business Class, Seat Comfort = 5).<br/>"
        "<b>Step 2:</b> User 'Predict Satisfaction' click karta hai.<br/>"
        "<b>Step 3:</b> React Frontend yeh data JSON format me FastAPI Backend ko bhejta hai.<br/>"
        "<b>Step 4:</b> FastAPI Pydantic se check karta hai ki sabhi 22 values valid hain.<br/>"
        "<b>Step 5:</b> FastAPI internal network se Java Engine (port 8081) ko data forward karta hai.<br/>"
        "<b>Step 6:</b> Java Engine 70 MB wale RandomForest model ke 100 trees me yeh data daalta hai.<br/>"
        "<b>Step 7:</b> Model vote karta hai (e.g., 94 trees bole 'Satisfied', 6 trees bole 'Dissatisfied').<br/>"
        "<b>Step 8:</b> Java result FastAPI ko return karta hai.<br/>"
        "<b>Step 9:</b> FastAPI is result ko SQLite database me permanent save kar leta hai.<br/>"
        "<b>Step 10:</b> React Frontend par green color me 'Satisfied (94% Probability)' ka animated card display ho jata hai!",
        body_style
    ))

    story.append(Spacer(1, 10))

    # SECTION 6
    story.append(Paragraph("6. Database ₹0 (Free) Kaise Hai?", h1_style))
    story.append(Paragraph(
        "Aapne manga tha ki paise na lage. Hamne isme <b>SQLite</b> (`predictions.db`) use kiya hai. "
        "SQLite ek file-based database hota hai jo aapke computer ya server ke andar hi chalta hai. "
        "Isko chalane ke liye kisi cloud provider ko monthly rent ya hosting fees nahi deni padti — yeh <b>100% Free (Zero Cost)</b> hai.",
        body_style
    ))

    story.append(Spacer(1, 10))
    story.append(PageBreak())

    # SECTION 7
    story.append(Paragraph("7. Viva / Interview Questions & Answers (Agar Koi Pooche Toh Kya Bolna Hai)", h1_style))

    qa_list = [
        (
            "Q1: Aapka project kis cheez par based hai?",
            "Ans: Yeh ek Airline Passenger Satisfaction Prediction system hai jo passengers ki ratings aur flight operational data ke aadhar par predict karta hai ki passenger satisfied hoga ya dissatisfied."
        ),
        (
            "Q2: Aapne kaun sa Machine Learning Algorithm use kiya hai?",
            "Ans: Maine WEKA ka Random Forest classification algorithm use kiya hai jisme 100 decision trees (RandomTree base learner) hain."
        ),
        (
            "Q3: Model ki accuracy kitni aayi hai?",
            "Ans: Model ki Stratified 10-Fold Cross-Validation accuracy 96.3435% aayi hai (129,880 dataset instances par). ROC Area 0.995 hai aur weighted F1-Score 0.963 hai."
        ),
        (
            "Q4: Python backend ke saath Java kyu lagaya?",
            "Ans: Model WEKA me trained tha aur ek Java serialized file (.model) ke roop me saved tha. Python pickle ya joblib is Java binary ko read nahi kar sakta. Isliye ek high-performance Java HTTP microservice banayi jo WEKA SerializationHelper se model ko memory me load karke predict karti hai."
        ),
        (
            "Q5: Kitne attributes / features model me hain?",
            "Ans: Total 23 attributes hain: 22 input features (Gender, Age, Travel Type, Class, Flight Distance, Delays, aur 14 Service Ratings jaise Seat Comfort, Wifi, Food) + 1 target attribute 'Satisfaction'."
        ),
        (
            "Q6: Kya yeh live website mobile par chal sakti hai?",
            "Ans: Haan, yeh 100% fully responsive hai. Chahe 320px ka chhota mobile phone ho, tablet ho, ya laptop ho — layout, rating buttons aur charts automatically adapt ho jaate hain."
        )
    ]

    for q, a in qa_list:
        story.append(Paragraph(q, q_style))
        story.append(Paragraph(a, ans_style))

    story.append(Spacer(1, 14))

    # Summary box
    summary_data = [[
        Paragraph(
            "<b>Final Summary for You:</b><br/>"
            "Aapka project ek complete professional SaaS-level application hai. Isme actual machine learning model (Random Forest), "
            "asli Java prediction engine, FastAPI backend, modern React frontend, SQLite database, aur Cloudflare public live URL sab kuch successfully integrated hai. "
            "Aap confidence ke saath ise kisi ko bhi dikha sakte hain!",
            callout_style
        )
    ]]
    summary_table = Table(summary_data, colWidths=[504])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdf4")),
        ('BORDER', (0,0), (-1,-1), 1, colors.HexColor("#86efac")),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(summary_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully built: {filename}")

if __name__ == '__main__':
    project_pdf = "/Users/siddharthsingh/wekaproject/Airline_Satisfaction_Project_Guide.pdf"
    desktop_pdf = "/Users/siddharthsingh/Desktop/Airline_Satisfaction_Project_Guide.pdf"
    build_pdf(project_pdf)
    build_pdf(desktop_pdf)
