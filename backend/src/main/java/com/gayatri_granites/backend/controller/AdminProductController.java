package com.gayatri_granites.backend.controller;

import com.gayatri_granites.backend.dto.*;
import com.gayatri_granites.backend.dto.response.ImageResponse;
import com.gayatri_granites.backend.dto.response.ProductResponse;
import com.gayatri_granites.backend.dto.response.VariantResponse;
import com.gayatri_granites.backend.service.AdminProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProduct(id));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id,
                                                            @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Product deactivated"));
    }

    @PostMapping(value = "/{id}/images", consumes = "multipart/form-data")
    public ResponseEntity<ImageResponse> addImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "false") boolean isPrimary,
            @RequestParam(required = false) Integer displayOrder) {

        return ResponseEntity.ok(productService.addImage(id, file, isPrimary, displayOrder));
    }

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable Long imageId) {
        productService.deleteImage(imageId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Image deleted"));
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<ProductResponse> updateStock(@PathVariable Long id,
                                                          @RequestBody StockUpdateRequest request) {
        return ResponseEntity.ok(productService.updateStock(id, request));
    }

    @PutMapping("/{id}/price")
    public ResponseEntity<ProductResponse> updatePrice(@PathVariable Long id,
                                                          @RequestBody PriceUpdateRequest request) {
        return ResponseEntity.ok(productService.updatePrice(id, request));
    }

    @PutMapping("/{id}/discount")
    public ResponseEntity<ProductResponse> updateDiscount(@PathVariable Long id,
                                                             @RequestBody DiscountRequest request) {
        return ResponseEntity.ok(productService.updateDiscount(id, request));
    }

    @PostMapping("/{id}/variants")
    public ResponseEntity<VariantResponse> addVariant(@PathVariable Long id,
                                                          @RequestBody VariantRequest request) {
        return ResponseEntity.ok(productService.addVariant(id, request));
    }
}