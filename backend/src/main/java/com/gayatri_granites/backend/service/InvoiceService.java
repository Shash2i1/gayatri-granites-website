package com.gayatri_granites.backend.service;

import com.gayatri_granites.backend.entity.Order;
import com.gayatri_granites.backend.entity.OrderItem;
import com.gayatri_granites.backend.entity.ProductVariant;
import com.gayatri_granites.backend.repository.OrderRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final OrderRepository orderRepository;
    private final QrCodeService qrCodeService;

    @Transactional(readOnly = true)
    public byte[] generateInvoice(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Order not found: " + orderId
                        )
                );

        try {

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();

            Document document = new Document(
                    PageSize.A4,
                    36,
                    36,
                    36,
                    36
            );

            PdfWriter.getInstance(document, outputStream);

            document.open();

            // ==========================================================
            // FONTS
            // ==========================================================

            Font companyFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    20
            );

            Font invoiceFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    18
            );

            Font sectionFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    11
            );

            Font normalFont = FontFactory.getFont(
                    FontFactory.HELVETICA,
                    9
            );

            Font boldFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    9
            );

            Font smallFont = FontFactory.getFont(
                    FontFactory.HELVETICA,
                    8
            );

            Font totalFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    11
            );

            // ==========================================================
            // HEADER
            // ==========================================================

            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{70, 30});

            PdfPCell companyCell = new PdfPCell();
            companyCell.setBorder(Rectangle.NO_BORDER);

            Paragraph companyName = new Paragraph(
                    "GAYATRI GRANITES",
                    companyFont
            );

            companyCell.addElement(companyName);

            Paragraph companyInfo = new Paragraph(
                    "Granite & Stone Products\n" +
                    "Premium Quality Granite Solutions",
                    smallFont
            );

            companyCell.addElement(companyInfo);

            headerTable.addCell(companyCell);

            // ==========================================================
            // QR CODE
            // ==========================================================

            String qrContent =
                    "Order ID: " + order.getId()
                            + "\n"
                            + "Invoice for Gayatri Granites"
                            + "\n"
                            + "Customer: "
                            + getCustomerEmail(order)
                            + "\n"
                            + "Amount: "
                            + formatMoney(order.getTotalAmount());

            byte[] qrBytes = qrCodeService.generateQrCode(
                    qrContent,
                    200,
                    200
            );

            Image qrImage = Image.getInstance(qrBytes);

            qrImage.scaleToFit(85, 85);

            PdfPCell qrCell = new PdfPCell();
            qrCell.setBorder(Rectangle.NO_BORDER);
            qrCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            qrCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

            qrCell.addElement(qrImage);

            Paragraph qrText = new Paragraph(
                    "Scan to view invoice",
                    smallFont
            );

            qrText.setAlignment(Element.ALIGN_CENTER);

            qrCell.addElement(qrText);

            headerTable.addCell(qrCell);

            document.add(headerTable);

            document.add(new Paragraph(" "));

            // ==========================================================
            // INVOICE TITLE
            // ==========================================================

            Paragraph invoiceTitle = new Paragraph(
                    "TAX INVOICE",
                    invoiceFont
            );

            invoiceTitle.setAlignment(Element.ALIGN_CENTER);

            document.add(invoiceTitle);

            document.add(new Paragraph(" "));

            // ==========================================================
            // INVOICE INFORMATION
            // ==========================================================

            PdfPTable infoTable = new PdfPTable(2);

            infoTable.setWidthPercentage(100);
            infoTable.setWidths(new float[]{50, 50});

            // ----------------------------------------------------------
            // ORDER INFORMATION
            // ----------------------------------------------------------

            PdfPCell orderInfoCell = new PdfPCell();
            orderInfoCell.setBorder(Rectangle.NO_BORDER);

            orderInfoCell.addElement(
                    new Paragraph(
                            "Invoice Number: INV-" + order.getId(),
                            boldFont
                    )
            );

            orderInfoCell.addElement(
                    new Paragraph(
                            "Order ID: #" + order.getId(),
                            normalFont
                    )
            );

            if (order.getCreatedAt() != null) {

                String date = order.getCreatedAt()
                        .format(
                                DateTimeFormatter.ofPattern(
                                        "dd-MM-yyyy HH:mm"
                                )
                        );

                orderInfoCell.addElement(
                        new Paragraph(
                                "Order Date: " + date,
                                normalFont
                        )
                );
            }

            orderInfoCell.addElement(
                    new Paragraph(
                            "Status: " + order.getStatus(),
                            normalFont
                    )
            );

            infoTable.addCell(orderInfoCell);

            // ----------------------------------------------------------
            // CUSTOMER INFORMATION
            // ----------------------------------------------------------

            PdfPCell customerCell = new PdfPCell();
            customerCell.setBorder(Rectangle.NO_BORDER);

            customerCell.addElement(
                    new Paragraph(
                            "BILL TO",
                            sectionFont
                    )
            );

            customerCell.addElement(
                    new Paragraph(
                            getCustomerName(order),
                            boldFont
                    )
            );

            customerCell.addElement(
                    new Paragraph(
                            getCustomerEmail(order),
                            normalFont
                    )
            );

            if (order.getPhoneNumber() != null
                    && !order.getPhoneNumber().isBlank()) {

                customerCell.addElement(
                        new Paragraph(
                                "Phone: " + order.getPhoneNumber(),
                                normalFont
                        )
                );
            }

            if (order.getShippingAddress() != null
                    && !order.getShippingAddress().isBlank()) {

                customerCell.addElement(
                        new Paragraph(
                                "Shipping Address:",
                                boldFont
                        )
                );

                customerCell.addElement(
                        new Paragraph(
                                order.getShippingAddress(),
                                normalFont
                        )
                );
            }

            infoTable.addCell(customerCell);

            document.add(infoTable);

            document.add(new Paragraph(" "));

            // ==========================================================
            // ITEMS TABLE
            // ==========================================================

            PdfPTable itemTable = new PdfPTable(6);

            itemTable.setWidthPercentage(100);

            itemTable.setWidths(
                    new float[]{
                            7,
                            30,
                            18,
                            10,
                            17,
                            18
                    }
            );

            addHeaderCell(itemTable, "#");
            addHeaderCell(itemTable, "Product");
            addHeaderCell(itemTable, "Variant");
            addHeaderCell(itemTable, "Qty");
            addHeaderCell(itemTable, "Unit Price");
            addHeaderCell(itemTable, "Amount");

            int itemNumber = 1;

            for (OrderItem item : order.getItems()) {

                String productName =
                        item.getProduct() != null
                                ? item.getProduct().getName()
                                : "Product";

                String variantInfo =
                        getVariantInfo(item.getVariant());

                BigDecimal unitPrice =
                        item.getPriceAtPurchase() != null
                                ? item.getPriceAtPurchase()
                                : BigDecimal.ZERO;

                int quantity =
                        item.getQuantity() != null
                                ? item.getQuantity()
                                : 0;

                BigDecimal itemTotal =
                        unitPrice.multiply(
                                BigDecimal.valueOf(quantity)
                        );

                addBodyCell(
                        itemTable,
                        String.valueOf(itemNumber++)
                );

                addBodyCell(
                        itemTable,
                        productName
                );

                addBodyCell(
                        itemTable,
                        variantInfo
                );

                addBodyCell(
                        itemTable,
                        String.valueOf(quantity)
                );

                addBodyCell(
                        itemTable,
                        formatMoney(unitPrice)
                );

                addBodyCell(
                        itemTable,
                        formatMoney(itemTotal)
                );
            }

            document.add(itemTable);

            document.add(new Paragraph(" "));

            // ==========================================================
            // BILLING SUMMARY
            // ==========================================================

            PdfPTable summaryTable = new PdfPTable(2);

            summaryTable.setWidthPercentage(45);
            summaryTable.setHorizontalAlignment(
                    Element.ALIGN_RIGHT
            );

            summaryTable.setWidths(
                    new float[]{60, 40}
            );

            // ----------------------------------------------------------
            // SUBTOTAL
            // ----------------------------------------------------------

            addSummaryRow(
                    summaryTable,
                    "Subtotal",
                    formatMoney(order.getSubtotal()),
                    normalFont,
                    false
            );

            // ----------------------------------------------------------
            // GST
            // ----------------------------------------------------------

            String gstLabel =
                    "GST @ "
                            + formatPercentage(
                                    order.getGstPercentage()
                            )
                            + "%";

            addSummaryRow(
                    summaryTable,
                    gstLabel,
                    formatMoney(order.getGstAmount()),
                    normalFont,
                    false
            );

            // ----------------------------------------------------------
            // SGST
            // ----------------------------------------------------------

            String sgstLabel =
                    "SGST @ "
                            + formatPercentage(
                                    order.getSgstPercentage()
                            )
                            + "%";

            addSummaryRow(
                    summaryTable,
                    sgstLabel,
                    formatMoney(order.getSgstAmount()),
                    normalFont,
                    false
            );

            // ----------------------------------------------------------
            // SHIPPING
            // ----------------------------------------------------------

            addSummaryRow(
                    summaryTable,
                    "Shipping Charges",
                    formatMoney(order.getShippingCharge()),
                    normalFont,
                    false
            );

            // ----------------------------------------------------------
            // SEPARATOR
            // ----------------------------------------------------------

            PdfPCell separatorLeft = new PdfPCell();
            separatorLeft.setBorder(
                    Rectangle.TOP
            );

            PdfPCell separatorRight = new PdfPCell();
            separatorRight.setBorder(
                    Rectangle.TOP
            );

            summaryTable.addCell(separatorLeft);
            summaryTable.addCell(separatorRight);

            // ----------------------------------------------------------
            // GRAND TOTAL
            // ----------------------------------------------------------

            addSummaryRow(
                    summaryTable,
                    "GRAND TOTAL",
                    formatMoney(order.getTotalAmount()),
                    totalFont,
                    true
            );

            document.add(summaryTable);

            document.add(new Paragraph(" "));

            // ==========================================================
            // AMOUNT IN WORDS
            // ==========================================================

            PdfPTable amountWordsTable = new PdfPTable(1);
            amountWordsTable.setWidthPercentage(100);

            PdfPCell amountWordsCell = new PdfPCell();

            amountWordsCell.setPadding(8);

            amountWordsCell.addElement(
                    new Paragraph(
                            "Amount Payable: "
                                    + formatMoney(
                                    order.getTotalAmount()
                            ),
                            boldFont
                    )
            );

            amountWordsCell.addElement(
                    new Paragraph(
                            "Amount in Words: "
                                    + numberToWords(
                                    order.getTotalAmount()
                            )
                                    + " Only",
                            normalFont
                    )
            );

            amountWordsTable.addCell(amountWordsCell);

            document.add(amountWordsTable);

            document.add(new Paragraph(" "));

            // ==========================================================
            // TRANSPORT DETAILS
            // ==========================================================

            if (order.getTransportDetails() != null
                    && !order.getTransportDetails().isBlank()) {

                PdfPTable transportTable =
                        new PdfPTable(1);

                transportTable.setWidthPercentage(100);

                PdfPCell transportCell =
                        new PdfPCell();

                transportCell.setPadding(7);

                transportCell.addElement(
                        new Paragraph(
                                "TRANSPORT DETAILS",
                                sectionFont
                        )
                );

                transportCell.addElement(
                        new Paragraph(
                                order.getTransportDetails(),
                                normalFont
                        )
                );

                transportTable.addCell(transportCell);

                document.add(transportTable);

                document.add(new Paragraph(" "));
            }

            // ==========================================================
            // REFUND DETAILS
            // ==========================================================

            if (order.getRefundReason() != null
                    && !order.getRefundReason().isBlank()) {

                PdfPTable refundTable =
                        new PdfPTable(1);

                refundTable.setWidthPercentage(100);

                PdfPCell refundCell =
                        new PdfPCell();

                refundCell.setPadding(7);

                refundCell.addElement(
                        new Paragraph(
                                "REFUND DETAILS",
                                sectionFont
                        )
                );

                refundCell.addElement(
                        new Paragraph(
                                "Reason: "
                                        + order.getRefundReason(),
                                normalFont
                        )
                );

                refundTable.addCell(refundCell);

                document.add(refundTable);

                document.add(new Paragraph(" "));
            }

            // ==========================================================
            // FOOTER
            // ==========================================================

            Paragraph footer = new Paragraph(
                    "Thank you for choosing Gayatri Granites!",
                    boldFont
            );

            footer.setAlignment(Element.ALIGN_CENTER);

            document.add(footer);

            Paragraph footer2 = new Paragraph(
                    "This is a computer-generated invoice.",
                    smallFont
            );

            footer2.setAlignment(Element.ALIGN_CENTER);

            document.add(footer2);

            // ==========================================================
            // CLOSE PDF
            // ==========================================================

            document.close();

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate invoice PDF",
                    e
            );
        }
    }

    // ==========================================================
    // CUSTOMER HELPERS
    // ==========================================================

    private String getCustomerEmail(Order order) {

        if (order.getUser() != null
                && order.getUser().getEmail() != null) {

            return order.getUser().getEmail();
        }

        return "Customer";
    }

    private String getCustomerName(Order order) {

        if (order.getUser() != null
                && order.getUser().getName() != null) {

            return order.getUser().getName();
        }

        return "Customer";
    }

    // ==========================================================
    // VARIANT HELPER
    // ==========================================================

    private String getVariantInfo(ProductVariant variant) {

        if (variant == null) {
            return "-";
        }

        StringBuilder builder =
                new StringBuilder();

        if (variant.getSize() != null) {

            builder.append(
                    variant.getSize()
            );
        }

        if (variant.getFinish() != null) {

            if (!builder.isEmpty()) {
                builder.append(" / ");
            }

            builder.append(
                    variant.getFinish()
            );
        }

        if (variant.getThicknessMm() != null) {

            if (!builder.isEmpty()) {
                builder.append(" / ");
            }

            builder.append(
                    variant.getThicknessMm()
            );

            builder.append("mm");
        }

        if (builder.isEmpty()) {
            return "-";
        }

        return builder.toString();
    }

    // ==========================================================
    // TABLE HELPERS
    // ==========================================================

    private void addHeaderCell(
            PdfPTable table,
            String text
    ) {

        Font font =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        9
                );

        PdfPCell cell =
                new PdfPCell(
                        new Phrase(
                                text,
                                font
                        )
                );

        cell.setHorizontalAlignment(
                Element.ALIGN_CENTER
        );

        cell.setVerticalAlignment(
                Element.ALIGN_MIDDLE
        );

        cell.setPadding(6);

        table.addCell(cell);
    }

    private void addBodyCell(
            PdfPTable table,
            String text
    ) {

        Font font =
                FontFactory.getFont(
                        FontFactory.HELVETICA,
                        9
                );

        PdfPCell cell =
                new PdfPCell(
                        new Phrase(
                                text != null
                                        ? text
                                        : "",
                                font
                        )
                );

        cell.setHorizontalAlignment(
                Element.ALIGN_CENTER
        );

        cell.setVerticalAlignment(
                Element.ALIGN_MIDDLE
        );

        cell.setPadding(5);

        table.addCell(cell);
    }

    private void addSummaryRow(
            PdfPTable table,
            String label,
            String value,
            Font font,
            boolean bold
    ) {

        PdfPCell labelCell =
                new PdfPCell(
                        new Phrase(
                                label,
                                font
                        )
                );

        PdfPCell valueCell =
                new PdfPCell(
                        new Phrase(
                                value,
                                font
                        )
                );

        labelCell.setBorder(
                Rectangle.NO_BORDER
        );

        valueCell.setBorder(
                Rectangle.NO_BORDER
        );

        labelCell.setHorizontalAlignment(
                Element.ALIGN_RIGHT
        );

        valueCell.setHorizontalAlignment(
                Element.ALIGN_RIGHT
        );

        labelCell.setPadding(4);
        valueCell.setPadding(4);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    // ==========================================================
    // MONEY HELPERS
    // ==========================================================

    private String formatMoney(BigDecimal amount) {

        if (amount == null) {
            amount = BigDecimal.ZERO;
        }

        return "₹"
                + amount.setScale(
                2,
                RoundingMode.HALF_UP
        ).toPlainString();
    }

    private String formatPercentage(
            BigDecimal percentage
    ) {

        if (percentage == null) {
            return "0.00";
        }

        return percentage
                .setScale(
                        2,
                        RoundingMode.HALF_UP
                )
                .stripTrailingZeros()
                .toPlainString();
    }

    // ==========================================================
    // NUMBER TO WORDS
    // ==========================================================

    private String numberToWords(
            BigDecimal amount
    ) {

        if (amount == null) {
            return "Zero Rupees";
        }

        long rupees = amount
                .setScale(
                        0,
                        RoundingMode.HALF_UP
                )
                .longValue();

        if (rupees == 0) {
            return "Zero Rupees";
        }

        return convertNumberToWords(rupees)
                + " Rupees";
    }

    private String convertNumberToWords(long number) {

        if (number < 20) {

            String[] ones = {
                    "Zero",
                    "One",
                    "Two",
                    "Three",
                    "Four",
                    "Five",
                    "Six",
                    "Seven",
                    "Eight",
                    "Nine",
                    "Ten",
                    "Eleven",
                    "Twelve",
                    "Thirteen",
                    "Fourteen",
                    "Fifteen",
                    "Sixteen",
                    "Seventeen",
                    "Eighteen",
                    "Nineteen"
            };

            return ones[(int) number];
        }

        if (number < 100) {

            String[] tens = {
                    "",
                    "",
                    "Twenty",
                    "Thirty",
                    "Forty",
                    "Fifty",
                    "Sixty",
                    "Seventy",
                    "Eighty",
                    "Ninety"
            };

            return tens[(int) (number / 10)]
                    + (number % 10 != 0
                    ? " " + convertNumberToWords(number % 10)
                    : "");
        }

        if (number < 1000) {

            return convertNumberToWords(number / 100)
                    + " Hundred"
                    + (number % 100 != 0
                    ? " "
                    + convertNumberToWords(number % 100)
                    : "");
        }

        if (number < 100000) {

            return convertNumberToWords(number / 1000)
                    + " Thousand"
                    + (number % 1000 != 0
                    ? " "
                    + convertNumberToWords(number % 1000)
                    : "");
        }

        if (number < 10000000) {

            return convertNumberToWords(number / 100000)
                    + " Lakh"
                    + (number % 100000 != 0
                    ? " "
                    + convertNumberToWords(number % 100000)
                    : "");
        }

        return convertNumberToWords(number / 10000000)
                + " Crore"
                + (number % 10000000 != 0
                ? " "
                + convertNumberToWords(number % 10000000)
                : "");
    }
}