import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateAttendancePDF = (
    internName: string,
    attendanceData: any[],
    month: number,
    year: number
) => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("MAHARASHTRA REMOTE SENSING APPLICATION CENTER", 105, 15, {
        align: "center",
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const rows = [];
    const days = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
    ];

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dateStr = `${month + 1}/${i}/${year}`;
        const dayStr = days[date.getDay()];

        const record = attendanceData.find((a) => {
            const d = new Date(a.date);
            return (
                d.getDate() === i && d.getMonth() === month && d.getFullYear() === year
            );
        });

        let status = record ? record.status.toUpperCase() : "";

        rows.push([i, dateStr, dayStr, status]);
    }

    autoTable(doc, {
        head: [["SR.NO", "DATE", "DAY", "PRESENTE"]],
        body: rows,
        startY: 25,
        theme: "plain",
        styles: {
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            textColor: [0, 0, 0],
            fontSize: 10,
            cellPadding: 2,
        },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: "bold",
            halign: "center",
            lineWidth: 0.1,
        },
        bodyStyles: {
            halign: "center",
        },
        columnStyles: {
            0: { cellWidth: 20 }, 
            1: { cellWidth: 40 }, 
            2: { cellWidth: 40 },
            3: { cellWidth: 80 },
        },
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    autoTable(doc, {
        body: [
            ["Name for Student", internName, "", ""],
            ["", "", "Extrimus01", ""],
            ["", "", "HR MRSAC", "Sign"],
        ],
        startY: finalY + 10,
        theme: "plain",
        styles: {
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            textColor: [0, 0, 0],
            fontSize: 10,
            cellPadding: 4,
        },
        columnStyles: {
            0: { cellWidth: 45 },
            1: { cellWidth: 55 },
            2: { cellWidth: 50 },
            3: { cellWidth: 40 },
        },
    });

    doc.save(`${internName}_Attendance_${month + 1}_${year}.pdf`);
};


