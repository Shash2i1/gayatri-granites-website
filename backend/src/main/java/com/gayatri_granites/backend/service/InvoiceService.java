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

            Document document =
                    new Document(
                            PageSize.A4,
                            36,
                            36,
                            36,
                            36
                    );

            PdfWriter.getInstance(
                    document,
                    outputStream
            );

            document.open();

            // --------------------------------------------------
            // FONTS
            // --------------------------------------------------

            Font companyFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            20
                    );

            Font invoiceFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            16
                    );

            Font normalFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA,
                            10
                    );

            Font boldFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            10
                    );

            Font smallFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA,
                            8
                    );

            // --------------------------------------------------
            // HEADER
            // --------------------------------------------------

            PdfPTable headerTable =
                    new PdfPTable(2);

            headerTable.setWidthPercentage(100);

            headerTable.setWidths(
                    new float[]{70, 30}
            );

            PdfPCell companyCell =
                    new PdfPCell();

            companyCell.setBorder(Rectangle.NO_BORDER);

            Paragraph companyName =
                    new Paragraph(
                            "GAYATRI GRANITES",
                            companyFont
                    );
   

            companyCell.addElement(companyName);

            Paragraph companyInfo =
                    new Paragraph(
                            "Granite & Stone Products\n" +
                            "Premium Quality Granite Solutions",
                            smallFont
                    );

            companyCell.addElement(companyInfo);

            headerTable.addCell(companyCell);

            // --------------------------------------------------
            // QR CODE
            // --------------------------------------------------

            String qrContent =
                    "Order ID: " + order.getId()
                            + "\n"
                            + "Invoice for Gayatri Granites"
                            + "\n"
                            + "Customer: "
                            + getCustomerEmail(order)
                            + "\n"
                            + "Amount: ₹"
                            + order.getTotalAmount();

            byte[] qrBytes =
                    qrCodeService.generateQrCode(
                            qrContent,
                            200,
                            200
                    );

            Image qrImage =
                    Image.getInstance(qrBytes);

            qrImage.scaleToFit(
                    90,
                    90
            );

            PdfPCell qrCell =
                    new PdfPCell();

            qrCell.setBorder(
                    Rectangle.NO_BORDER
            );

            qrCell.setHorizontalAlignment(
                    Element.ALIGN_RIGHT
            );

            qrCell.setVerticalAlignment(
                    Element.ALIGN_MIDDLE
            );

            qrCell.addElement(qrImage);

            Paragraph qrText =
                    new Paragraph(
                            "Scan to view invoice",
                            smallFont
                    );

            qrText.setAlignment(
                    Element.ALIGN_CENTER
            );

            qrCell.addElement(qrText);

            headerTable.addCell(qrCell);

            document.add(headerTable);

            document.add(
                    new Paragraph(" ")
            );

            // --------------------------------------------------
            // INVOICE TITLE
            // --------------------------------------------------

            Paragraph invoiceTitle =
                    new Paragraph(
                            "INVOICE",
                            invoiceFont
                    );

            invoiceTitle.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(invoiceTitle);

            document.add(
                    new Paragraph(" ")
            );

            // --------------------------------------------------
            // INVOICE INFORMATION
            // --------------------------------------------------

            PdfPTable infoTable =
                    new PdfPTable(2);

            infoTable.setWidthPercentage(100);

            infoTable.setWidths(
                    new float[]{50, 50}
            );

            PdfPCell orderInfoCell =
                    new PdfPCell();

            orderInfoCell.setBorder(
                    Rectangle.NO_BORDER
            );

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

                String date =
                        order.getCreatedAt()
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
                            "Status: "
                                    + order.getStatus(),
                            normalFont
                    )
            );

            infoTable.addCell(orderInfoCell);

            PdfPCell customerCell =
                    new PdfPCell();

            customerCell.setBorder(
                    Rectangle.NO_BORDER
            );

            customerCell.addElement(
                    new Paragraph(
                            "BILL TO",
                            boldFont
                    )
            );

            customerCell.addElement(
                    new Paragraph(
                    		getCustomerName(order) + "\n" + getCustomerEmail(order) + "\n"  + order.getPhoneNumber(),
                            normalFont
                    )
            );

            if (order.getShippingAddress() != null) {

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

            document.add(
                    new Paragraph(" ")
            );

            // --------------------------------------------------
            // ITEMS TABLE
            // --------------------------------------------------

            PdfPTable itemTable =
                    new PdfPTable(6);

            itemTable.setWidthPercentage(100);

            itemTable.setWidths(
                    new float[]{
                            8,
                            30,
                            15,
                            10,
                            17,
                            20
                    }
            );

            addHeaderCell(
                    itemTable,
                    "#"
            );

            addHeaderCell(
                    itemTable,
                    "Product"
            );

            addHeaderCell(
                    itemTable,
                    "Variant"
            );

            addHeaderCell(
                    itemTable,
                    "Qty"
            );

            addHeaderCell(
                    itemTable,
                    "Unit Price"
            );

            addHeaderCell(
                    itemTable,
                    "Total"
            );

            int itemNumber = 1;

            BigDecimal calculatedTotal =
                    BigDecimal.ZERO;

            for (OrderItem item : order.getItems()) {

                String productName =
                        item.getProduct() != null
                                ? item.getProduct().getName()
                                : "Product";

                String variantInfo =
                        getVariantInfo(
                                item.getVariant()
                        );

                BigDecimal unitPrice =
                        item.getPriceAtPurchase()
                                != null
                                ? item.getPriceAtPurchase()
                                : BigDecimal.ZERO;

                int quantity =
                        item.getQuantity() != null
                                ? item.getQuantity()
                                : 0;

                BigDecimal itemTotal =
                        unitPrice.multiply(
                                BigDecimal.valueOf(
                                        quantity
                                )
                        );

                calculatedTotal =
                        calculatedTotal.add(
                                itemTotal
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
                        "₹" + unitPrice
                );

                addBodyCell(
                        itemTable,
                        "₹" + itemTotal
                );
            }

            document.add(itemTable);

            document.add(
                    new Paragraph(" ")
            );

            // --------------------------------------------------
            // TOTAL
            // --------------------------------------------------

            PdfPTable totalTable =
                    new PdfPTable(2);

            totalTable.setWidthPercentage(40);

            totalTable.setHorizontalAlignment(
                    Element.ALIGN_RIGHT
            );

            totalTable.setWidths(
                    new float[]{50, 50}
            );

            PdfPCell totalLabel =
                    new PdfPCell(
                            new Phrase(
                                    "TOTAL",
                                    boldFont
                            )
                    );

            totalLabel.setHorizontalAlignment(
                    Element.ALIGN_RIGHT
            );

            PdfPCell totalValue =
                    new PdfPCell(
                            new Phrase(
                                    "₹"
                                            + order.getTotalAmount(),
                                    boldFont
                            )
                    );

            totalValue.setHorizontalAlignment(
                    Element.ALIGN_RIGHT
            );

            totalTable.addCell(totalLabel);
            totalTable.addCell(totalValue);

            document.add(totalTable);

            document.add(
                    new Paragraph(" ")
            );

            // --------------------------------------------------
            // TRANSPORT DETAILS
            // --------------------------------------------------

            if (order.getTransportDetails() != null
                    && !order.getTransportDetails().isBlank()) {

                Paragraph transport =
                        new Paragraph(
                                "Transport Details: "
                                        + order.getTransportDetails(),
                                normalFont
                        );

                document.add(transport);

                document.add(
                        new Paragraph(" ")
                );
            }

            // --------------------------------------------------
            // REFUND DETAILS
            // --------------------------------------------------

            if (order.getRefundReason() != null
                    && !order.getRefundReason().isBlank()) {

                Paragraph refund =
                        new Paragraph(
                                "Refund Reason: "
                                        + order.getRefundReason(),
                                normalFont
                        );

                document.add(refund);

                document.add(
                        new Paragraph(" ")
                );
            }

            // --------------------------------------------------
            // FOOTER
            // --------------------------------------------------

            Paragraph footer =
                    new Paragraph(
                            "Thank you for choosing Gayatri Granites!",
                            boldFont
                    );

            footer.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(footer);

            Paragraph footer2 =
                    new Paragraph(
                            "This is a computer-generated invoice.",
                            smallFont
                    );

            footer2.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(footer2);

            // --------------------------------------------------
            // CLOSE PDF
            // --------------------------------------------------

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
    // HELPER METHODS
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

    private String getVariantInfo(
            ProductVariant variant
    ) {

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

        cell.setPadding(5);

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
}